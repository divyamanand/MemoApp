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


export const getQuestionsByType = asyncHandler(async (req, res) => {
  const type = req.query.type;
  let pageNum = Math.max(parseInt(req.query.page, 10) || 1, 1);
  let sizeNum = Math.max(parseInt(req.query.pageSize, 10) || 10, 1);

  if (type !== 'Questions' && type !== 'Revisions') {
    return res.status(400).json({ message: 'Invalid type, must be Questions or Revisions' });
  }
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const isRevisionType = type === 'Revisions';
  const dateExprOp = isRevisionType ? '$eq' : '$ne';

  const result = await Question.aggregate([
    { $match: { userId: req.user._id } },
    {
      $addFields: {
        upcomingRevisions: {
          $slice: [
            {
              $filter: {
                input: '$revisions',
                as: 'rev',
                cond: { $gte: ['$$rev.date', today] }
              }
            },
            3
          ]
        }
      }
    },
    {
      $match: {
        $expr: {
          [dateExprOp]: [
            { $dateToString: { format: '%Y-%m-%d', date: { $arrayElemAt: ['$upcomingRevisions.date', 0] } } },
            { $dateToString: { format: '%Y-%m-%d', date: today } }
          ]
        }
      }
    },
    { $project: { revisions: 0 } },
    {
      $facet: {
        metadata: [{ $count: 'totalQuestions' }],
        data: [
          { $skip: (pageNum - 1) * sizeNum },
          { $limit: sizeNum }
        ]
      }
    }
  ]);

  const totalQuestions = (result[0].metadata[0] && result[0].metadata[0].totalQuestions) || 0;
  const questions = result[0].data || [];

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        metadata: { totalQuestions, page: pageNum, pageSize: sizeNum },
        questions
      },
      isRevisionType
        ? "Today's revision questions fetched"
        : "Questions fetched (excluding today's revisions)"
    )
  );
});
