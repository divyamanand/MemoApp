import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import { createQuestion, deleteQuestion, getQuestionsByType } from "../controller/question.controller.js";

const router = Router()

router.post("/add-question", verifyJWT, createQuestion)
router.delete("/delete-question/:questionId", verifyJWT, deleteQuestion)
router.get("/questions", verifyJWT, getQuestionsByType)


export default router