class LLMRequest {
    constructor(
        systemRole, 
        prompt, 
        model = "gpt-4o-mini-2024-07-18", 
        temperature = 0.7, 
        max_output_tokens = 512,
        response_format = { type: "json_object" }
    ) {
        this.model = model;
        this.input = [
            { role: "system", content: systemRole },
            { role: "user", content: prompt }
        ];
        this.temperature = temperature;
        this.max_output_tokens = max_output_tokens;
        this.response_format = response_format
    }
}

export {LLMRequest}