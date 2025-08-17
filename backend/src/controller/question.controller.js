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
  const {_id, ...rest} = req.body
  const questionData = { ...rest, userId: req.user._id };

  console.log("Data received from question", questionData)

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

    // Keep only questions that have at least one revision today
    { $match: { "todaysRevisions.0": { $exists: true } } },

    // Compute metadata fields
    {
      $addFields: {
        completedCount: {
          $size: {
            $filter: {
              input: "$revisions",
              as: "rev",
              cond: { $eq: ["$$rev.completed", true] }
            }
          }
        },
        lastRevised: {
          $max: {
            $map: {
              input: {
                $filter: {
                  input: "$revisions",
                  as: "rev",
                  cond: { $eq: ["$$rev.completed", true] }
                }
              },
              as: "r",
              in: "$$r.date"
            }
          }
        },
        upcomingRevisions: {
          $slice: [
            {
              $filter: {
                input: "$revisions",
                as: "rev",
                cond: { $gte: ["$$rev.date", new Date()] }
              }
            },
            3
          ]
        },
        pastRevisions: {
          $slice: [
            {
              $reverseArray: {
                $filter: {
                  input: "$revisions",
                  as: "rev",
                  cond: { $lt: ["$$rev.date", new Date()] }
                }
              }
            },
            3
          ]
        }
      }
    },

    // Remove revisions + todaysRevisions array
    {
      $project: {
        revisions: 0,
        todaysRevisions: 0
      }
    },

    // Facet for pagination + metadata
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [
          { $sort: { createdAt: -1 } },
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

  const pipeline = [
    { $match: { userId: req.user._id } },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * pageSize },
    { $limit: pageSize },

    {
      $addFields: {
        completedRevisions: {
          $filter: {
            input: "$revisions",
            as: "rev",
            cond: { $eq: ["$$rev.completed", true] }
          }
        },
        pendingRevisions: {
          $filter: {
            input: "$revisions",
            as: "rev",
            cond: { $eq: ["$$rev.completed", false] }
          }
        }
      }
    },
    {
      $addFields: {
        completedCount: { $size: "$completedRevisions" },
        lastRevised: {
          $max: {
            $map: {
              input: "$completedRevisions",
              as: "rev",
              in: "$$rev.date"
            }
          }
        },
        pastRevisions: {
          $slice: [
            {
              $reverseArray: {
                $sortArray: { input: "$completedRevisions", sortBy: { date: 1 } }
              }
            },
            3
          ]
        },
        upcomingRevisions: {
          $slice: [
            {
              $sortArray: { input: "$pendingRevisions", sortBy: { date: 1 } }
            },
            3
          ]
        }
      }
    },
    {
      $project: {
        revisions: 0,
        completedRevisions: 0,
        pendingRevisions: 0
      }
    }
  ];

  const questions = await Question.aggregate(pipeline);

  const totalQuestions = await Question.countDocuments({ userId: req.user._id });
  const totalPages = Math.ceil(totalQuestions / pageSize) || 1;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        metadata: { totalQuestions, totalPages, page, pageSize },
        questions,
      },
      "All questions fetched successfully"
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

export const countNCompleted = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { numberOfTimes } = req.params;

  const n = parseInt(numberOfTimes, 10);
  if (isNaN(n) || n < 0) {
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

export const countTotalCompleted = asyncHandler(async (req, res) => {
  const userId = req.user._id

  const today = new Date()
  today.setUTCHours(0,0,0,0)

  const result = await Question.aggregate([
  { $match: { userId } },
  {
    $project: {
      completedRevisionsCount: {
        $size: {
          $filter: {
            input: "$revisions",
            as: "rev",
            cond: {
              $and: [
                { $eq: ["$$rev.completed", true] },
                { $lt: ["$$rev.date", today] }  // before today
              ]
            }
          }
        }
      }
    }
  },
  {
    $group: {
      _id: null,
      totalCompletedRevisions: { $sum: "$completedRevisionsCount" }
    }
  }
]);

const totalCompleted = result.length > 0 ? result[0].totalCompletedRevisions : 0;

return res.status(200).json(
  new ApiResponse(200, { totalCompleted }, "Total completed revisions count (excluding today)")
);

})

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

export const getHeatmap = asyncHandler(async (req, res) => {
  const user = req.user
  const {from, to} = req.query

  const matchStage = {
    userId: user._id
  }

  let dateFilter = {}

  if (from) dateFilter.$gte = new Date(from)
  if (to) dateFilter.$lte = new Date(to)
  
  if (Object.keys(dateFilter).length > 0) {
    matchStage["revisions.date"] = dateFilter
  }

  const result = await Question.aggregate([
    {$match: matchStage},
    {$unwind: "$revisions"},

    { $match: { "revisions.completed": true } },

    {
      $group: {
        _id: {
          $dateToString: {format: "%Y-%m-%d", date: "$revisions.date"}
        },
        count: {$sum: 1}
      },
    },

    {$sort: {_id: 1}},
    {
      $project: {
        _id: 0,
        day: "$_id",
        count: 1,
      }
    }
  ])

  return res.status(200).json(
    new ApiResponse(200, result, "Heatmap fetched successfully")
  );

})