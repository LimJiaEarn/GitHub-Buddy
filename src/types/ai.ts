export enum AiChatRole {
  System = "system",
  Ai = "assistant",
  User = "user",
}

export interface AiChatMessage {
  role: AiChatRole;
  content: string;
}

export enum AiOption {
  Gemini = "GEMINI",
  OpenAi = "OPENAI",
  Claude = "CLAUDE",
  Perplexity = "PERPLEXITY",
  DeepSeek = "DEEPSEEK",
}

export interface OpenAiInitParams {
  apiKey: string;
  baseURL?: string;
}
