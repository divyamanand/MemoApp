import { OpenAI } from "openai";

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

export async function sendLLMRequest(llmRequest) {
  const response = await openaiClient.responses.create({
    model: llmRequest.model,
    input: llmRequest.input,
    temperature: llmRequest.temperature,
    max_output_tokens: llmRequest.max_output_tokens
  });

  return response.output_text;
}

