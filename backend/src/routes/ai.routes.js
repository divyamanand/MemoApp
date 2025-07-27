import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware";
import { generateQuestions } from "../controller/openai.controller";


const router = Router()
router.get("/related-question", verifyJWT, generateQuestions)