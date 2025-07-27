import { OpenAI } from "openai/client.js";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";

export const generateQuestions = asyncHandler(async (req, res) => {
    const client = new OpenAI({
        apiKey: process.env.OPENAI_KEY
    });

    const question = req.body;

    const prompt = `
            You are given a question in JSON format. Based on the provided data, generate ONE new question that:
            - Has the same topic or domain.
            - Maintains a similar difficulty level.
            - Follows the same schema and structure as the original question.
            - Do NOT include any explanations, only return the new question in the exact same JSON schema.

            Original Question:
            ${JSON.stringify(question)}
            `;

    const response = await client.responses.create({
        model: "gpt-4o-mini-2024-07-18",
        input: [
            {
                role: "system",
                content: "You are an expert at generating high-quality practice questions in JSON format."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0.7,
        max_output_tokens: 200
    });

    const generatedQuestion = response.output_text;

    return res.status(201).json(new ApiResponse(201, generatedQuestion, "Here is a recommended question for you."));
});
