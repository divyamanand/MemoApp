import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import { createQuestion, deleteQuestion, getAllQuestionsOfUser, getTodaysRevisions } from "../controller/question.controller.js";

const router = Router()

router.post("/add-question", verifyJWT, createQuestion)
router.delete("/delete-question/:questionId", verifyJWT, deleteQuestion)
router.get("/questions", verifyJWT, getAllQuestionsOfUser)

export default router