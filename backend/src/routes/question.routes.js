import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import { countNCompleted, countTotalCompleted, createMultipleQuestions, createQuestion, deleteQuestion, getAllQuestionsOfUser, getHeatmap, getTagsCount, getTodaysRevisions, markPOTDCompleted, markRevisionCompleted } from "../controller/question.controller.js";

const router = Router()

router.post("/add-question", verifyJWT, createQuestion)
router.post("/add-multiple-questions", verifyJWT, createMultipleQuestions)
router.delete("/delete-question/:questionId", verifyJWT, deleteQuestion)
router.get("/questions", verifyJWT, getAllQuestionsOfUser)
router.get("/revisions", verifyJWT, getTodaysRevisions)
router.patch("/complete-potd", verifyJWT, markPOTDCompleted)
router.get("/complete-n-count/:numberOfTimes", verifyJWT, countNCompleted)
router.get("/total-count", verifyJWT, countTotalCompleted)
router.patch("/mark-revision/:questionID/:revisionID", verifyJWT, markRevisionCompleted)
router.get("/heatmap", verifyJWT, getHeatmap)
router.get("/tags", verifyJWT, getTagsCount)

export default router