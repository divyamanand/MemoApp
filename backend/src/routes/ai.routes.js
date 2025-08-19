import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import {  generateQuestions, generateQuestionsFromPrompt, getRecommendedTags } from "../controller/openai.controller.js";


const router = Router()
router.post("/recommended-topic", verifyJWT, getRecommendedTags)
router.post("/generate-questions", verifyJWT, generateQuestions)
router.post("/generate-prompt-questions", verifyJWT, generateQuestionsFromPrompt)

export default router