import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { LLMRequest } from "../utils/LLMRequest.js";
import { sendLLMRequest } from "../utils/OpenAiClient.js";

export const getRecommendedTags = asyncHandler(async (req, res) => {
  const {topicDescription} = req.body;

  const prompt = `
        You are given a topic description: "${topicDescription}".

        Your task:
        1. Break this topic into smaller, well-defined subtopics and related areas of study.  
        2. Return these as concise tags (single words or short forms, maximum 20).  
        3. Only output valid JSON in the following format:

        {
        "tags": ["tag1", "tag2", "tag3", ...]
        }
    `;

    const systemRole = `
        You are a precise assistant that extracts academic subtopics.  
        - Always break the given topic into smaller, well-defined subtopics or related fields.  
        - Output only concise, single-word or short-form tags (max 20).  
        - Do not explain or add extra text.  
        - Respond strictly in valid JSON with the format:  
        {
            "tags": ["tag1", "tag2", "tag3", ...]
        }
        `;

  const llmRequest = new LLMRequest(
    systemRole,
    prompt
  );

  const generatedtags = await sendLLMRequest(llmRequest);

    let parsedTags;
    try {
    parsedTags = JSON.parse(generatedtags);
    } catch (e) {
    throw new ApiError(500, "LLM returned invalid JSON");
    }

  return res
    .status(201)
    .json(new ApiResponse(201, parsedTags, "Here is a recommended question for you."));
});

export const generateQuestions = asyncHandler(async (req, res) => {
  const { tags } = req.body;

  const prompt = `
    You are given tags related to some study syllabus a student wants to learn about: "${tags}".

    Your task:
    1. Take these tags and generate some very important questions.  
    2. Follow this JSON schema strictly:
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
          "link": "string"
        }
      ]
    }
  `;

  const llmRequest = new LLMRequest("", prompt);

  const generatedQuestions = await sendLLMRequest(llmRequest);

  let parsedQuestions;
  try {
    // First parse response wrapper
    let firstParse = JSON.parse(generatedQuestions);

    // If "data" is still a stringified JSON → parse again
    if (typeof firstParse === "string") {
      parsedQuestions = JSON.parse(firstParse);
    } else if (typeof firstParse.data === "string") {
      parsedQuestions = JSON.parse(firstParse.data);
    } else {
      parsedQuestions = firstParse;
    }
  } catch (e) {
    throw new ApiError(500, "LLM returned invalid JSON");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, parsedQuestions, "Here is a recommended question for you."));
});
