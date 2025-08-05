import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import { generateQuestions } from "../controller/openai.controller.js";


const router = Router()
router.get("/related-question", verifyJWT, generateQuestions)

export default router