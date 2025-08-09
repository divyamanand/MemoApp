import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import { countIndividualQuestionRevisionsCompleted, countNCompleted, countTotalCompleted, createQuestion, deleteQuestion, getAllQuestionsOfUser, getTodaysRevisions, markPOTDCompleted, markRevisionCompleted } from "../controller/question.controller.js";

const router = Router()

router.post("/add-question", verifyJWT, createQuestion)
router.delete("/delete-question/:questionId", verifyJWT, deleteQuestion)
router.get("/questions", verifyJWT, getAllQuestionsOfUser)
router.get("/revisions", verifyJWT, getTodaysRevisions)
router.post("/complete-potd", verifyJWT, markPOTDCompleted)
router.get("/complete-n-count/:numberOfTimes", verifyJWT, countNCompleted)
router.get("/total-count", verifyJWT, countTotalCompleted)
router.post("/mark-revision/:questionID/:revisionID", verifyJWT, markRevisionCompleted)
// router.get("/get-individual-count/:questionID", verifyJWT, countIndividualQuestionRevisionsCompleted)

export default router