import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT.middleware.js";
import { createQuestion, deleteQuestion, getAllQuestionsOfUser, getTodaysRevisions } from "../controller/question.controller.js";

const router = Router()

router.post("/add-question", verifyJWT, createQuestion)
router.delete("/delete-question/:questionId", verifyJWT, deleteQuestion)
router.get("/questions", verifyJWT, (req, res) => {
    const type = req.query.type

    if (type === "revisions") {
        return getTodaysRevisions(req, res)
    } else if (type === "questions") {
        return getAllQuestionsOfUser(req, res)
    }
})

export default router