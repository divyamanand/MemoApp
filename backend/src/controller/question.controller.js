import { use } from "react";
import { Question } from "../schema/questionSchema.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";


const createRevisionPlan = async (questionId) => {
    const question = await Question.findById(questionId)

    if (!question) {
        throw new ApiError(401, "Question Not Found. No Revision Can be Created")
    }

    const revisions = question.generateRevision()
    question.revisions = revisions
    await question.save()

    return revisions
}

export const createQuestion = asyncHandler(async (req, res) => {
  const questionData = { ...req.body, userId: req.user._id };

  if (!questionData.formData) questionData.formData = {};

  if (!questionData.formData.revisionFormula) {
    const diff = questionData.difficulty;

    if (!diff) throw new ApiError(401, "Difficulty is Missing for the Question")

    const getVal = (m) => (m instanceof Map ? m.get(diff) : m[diff]);
    const k = getVal(req.user.k_vals);
    const c = getVal(req.user.c_vals);
    const i = getVal(req.user.iterations);
    questionData.formData.revisionFormula = { k, c, i };
  }

  const question = await Question.create(questionData);
  if (!question) throw new ApiError(401, "Error adding the question");

  await createRevisionPlan(question._id);

  const updatedQuestion = await Question.findById(question._id);
  return res
    .status(201)
    .json(new ApiResponse(201, updatedQuestion, "Question added successfully"));
});


export const deleteQuestion = asyncHandler(async (req, res) => {

    const {questionId}= req.params
    const question = await Question.findOneAndDelete({_id: questionId, userId: req.user._id})

    if (!question) {
        throw new ApiError(404, "Question Not Found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Question Deleted Successfully"))
    
})

export const getTodaysRevisions = asyncHandler(async (req, res) => {
  let page = parseInt(req.query.page, 10) || 1;
  let pageSize = parseInt(req.query.pageSize, 10) || 50;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(today.getUTCDate() + 1);

  const result = await Question.aggregate([
    { $match: { userId: req.user._id } },
    {
      $addFields: {
        todaysRevisions: {
          $filter: {
            input: "$revisions",
            as: "rev",
            cond: {
              $and: [
                { $gte: ["$$rev.date", today] },
                { $lt: ["$$rev.date", tomorrow] }
              ]
            }
          }
        }
      }
    },
    // Only keep questions that have at least 1 revision today
    { $match: { "todaysRevisions.0": { $exists: true } } },
    { $project: { revisions: 0 } },
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [
          { $skip: (page - 1) * pageSize },
          { $limit: pageSize }
        ]
      }
    }
  ]);

  const total = result[0].metadata[0]?.total || 0;
  const totalPages = Math.ceil(total / pageSize) || 1;

  return res.status(200).json(
    new ApiResponse(
      200,
      { metadata: { total, totalPages, page, pageSize }, questions: result[0].data || [] },
      "Today's revisions fetched"
    )
  );
});


export const getAllQuestionsOfUser = asyncHandler(async (req, res) => {
  let { page, pageSize } = req.query;

  page = parseInt(page, 10) || 1;
  pageSize = parseInt(pageSize, 10) || 10;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(today.getUTCDate() + 1);

  const questions = await Question.aggregate([
    { $match: { userId: req.user._id } },
    {
      $addFields: {
        hasTodaysRevision: {
          $gt: [
            {
              $size: {
                $filter: {
                  input: "$revisions",
                  as: "rev",
                  cond: {
                    $and: [
                      { $gte: ["$$rev.date", today] },
                      { $lt: ["$$rev.date", tomorrow] }
                    ]
                  }
                }
              }
            },
            0
          ]
        }
      }
    },
    // Exclude questions that have any revision today
    { $match: { hasTodaysRevision: false } },
    {
      $addFields: {
        upcomingRevisions: {
          $slice: [
            {
              $filter: {
                input: "$revisions",
                as: "rev",
                cond: { $gte: ["$$rev.date", today] }
              }
            },
            3
          ]
        }
      }
    },
    { $project: { revisions: 0, hasTodaysRevision: 0 } },
    {
      $facet: {
        metadata: [{ $count: "totalQuestions" }],
        data: [
          { $skip: (page - 1) * pageSize },
          { $limit: pageSize }
        ]
      }
    }
  ]);

  const totalQuestions = questions[0].metadata[0]?.totalQuestions || 0;
  const totalPages = Math.ceil(totalQuestions / pageSize) || 1;

  return res.status(200).json(
    new ApiResponse(
      200,
      { metadata: { totalQuestions, totalPages, page, pageSize }, questions: questions[0].data || [] },
      "Questions fetched excluding today's revisions"
    )
  );
});

export const markPOTDCompleted = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Use MongoDB's $cond and $inc to atomically update streakCount depending on lastPOTDDate
  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    [
      {
        $set: {
          lastPOTDDate: today,
          streakCount: {
            $cond: [
              {
                $eq: [
                  { $subtract: [today, "$lastPOTDDate"] },
                  86400000, // 1 day in ms
                ],
              },
              { $add: ["$streakCount", 1] },
              1,
            ],
          },
          "currentPOTD.completed": true,
        },
      },
    ],
    { new: true }
  );

  return res.status(200).json(
    new ApiResponse(200, { new_streak: updatedUser.streakCount }, "Question marked completed")
  );
});

export const countTotalCompleted = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { numberOfTimes } = req.params;

  const n = parseInt(numberOfTimes, 10);
  if (isNaN(n) || n < 1) {
    throw new ApiError(400, null, "Invalid number of times");
  }

  const result = await Question.aggregate([
    { $match: { userId } },
    {
      $project: {
        completedRevisionsCount: {
          $size: {
            $filter: {
              input: "$revisions",
              as: "rev",
              cond: { $eq: ["$$rev.completed", true] }
            }
          }
        }
      }
    },
    {
      $match: {
        completedRevisionsCount: { $gte: n }
      }
    },
    {
      $count: "questionsCount"
    }
  ]);

  const count = result.length > 0 ? result[0].questionsCount : 0;

  return res.status(200).json(
    new ApiResponse(200, { count }, `Number of questions revised at least ${n} times`)
  );
});

export const markRevisionCompleted = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { questionID, revisionID } = req.params;

  // Find the question with the user and revision
  const question = await Question.findOne({ _id: questionID, userId });

  if (!question) {
    throw new ApiError(404, null, "Question not found");
  }

  // Find the revision inside revisions array
  const revision = question.revisions.id(revisionID);
  if (!revision) {
    throw new ApiError(404, null, "Revision not found");
  }

  // Toggle completed
  revision.completed = !revision.completed;

  // Optionally update lastSolved date if completed now
  if (revision.completed) {
    question.lastSolved = new Date();
  }

  await question.save();

  return res.status(200).json(
    new ApiResponse(200, revision, "Revision completion toggled successfully")
  );
});

export const countIndividualQuestionRevisionsCompleted = asyncHandler(async (req, res) => {
    const user = req.user
    const {questionID} = req.params

    const question = Question.findOne({_id: questionID, userId: user._id})
    
    if (!question) {
      throw new ApiError(404, null, "Question Not Found")
    }

    const completedCount  = question.completedCount

    return res.status(200).json(
      new ApiResponse(200, {completedCount}, "Completed count fetched successffully")
    )
})
