import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

const TagsSchema = z.object({
  tags: z.array(z.string().min(1)).max(20),
});

const QuestionsSchema = z.object({
  questions: z.array(
    z.object({
      questionName: z.string(),
      difficulty: z.enum(["Easy", "Medium", "Hard"]),
      tags: z.array(z.string()),
      description: z.string(),
      choices: z.object({
        options: z.array(z.string()),
        multipleCorrect: z.boolean(),
      }),
      link: z.string().nullable(),
    })
  ),
});

export const getRecommendedTags = asyncHandler(async (req, res) => {
  const { topicDescription } = req.body;

  const response = await openai.responses.parse({
    model: "gpt-4.1-mini-2025-04-14",
    input: [
      { role: "system", content: "You output only JSON matching the schema." },
      {
        role: "user",
        content: `You are given a topic description: "${topicDescription}".  
Analyze the full syllabus and related content for this topic.  
Identify the most relevant topics and syllabus tags, using **only 1–2 words per tag**.  
Break the topic into clear, well-defined subtopics (maximum 20).  
Return the result as valid JSON strictly matching this schema: { "tags": ["tag1", "tag2"] }  
Do not include explanations or extra text outside the JSON.  
`,
      },
    ],
    text: {
      format: zodTextFormat(TagsSchema, "tags"),
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, response.output_parsed, "Here are recommended tags."));
});


export const generateQuestions = asyncHandler(async (req, res) => {
  const { tags } = req.body;

  const response = await openai.responses.parse({
    model: "gpt-4.1-mini-2025-04-14",
    input: [
      { role: "system", content: "You output only JSON matching the schema." },
      {
        role: "user",
        content: `You are given study tags: "${tags}". 
Generate important questions and return JSON strictly matching this schema:
{
  "questions": [
    {
      "questionName": "string",
      "difficulty": "Easy | Medium | Hard",
      "tags": ["string"],
      "description": "string",
      "choices": {
        "options": ["string"],
        "multipleCorrect": true
      },
      "link": "string or null"
    }
  ]
}`,
      },
    ],
    text: {
      format: zodTextFormat(QuestionsSchema, "questions"),
    },
  });


  return res
    .status(201)
    .json(new ApiResponse(201, response.output_parsed, "Here are recommended questions."));
});
