import { AiOption } from "@/types/ai";

export const AI_OPTIONS_AND_MODELS: Record<AiOption, string[]> = {
  GEMINI: [
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
  ],
  OPENAI: ["o1", "o1-mini", "o3-mini", "gpt-4o", "gpt-4o-mini", "gpt-4-turbo"],
  DEEPSEEK: ["deepseek-chat", "deepseek-reasoner"],
  CLAUDE: [
    "claude-3-7-sonnet-20250219",
    "claude-3-5-sonnet-20240620",
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307",
  ],
  PERPLEXITY: [
    "sonar",
    "sonar-pro",
    "sonar-reasoning",
    "sonar-reasoning-pro",
    "sonar-deep-research",
  ],
};

export const BASE_URLS: Record<AiOption, string> = {
  GEMINI: "https://generativelanguage.googleapis.com/v1beta/openai/",
  OPENAI: "",
  DEEPSEEK: "https://api.deepseek.com/v1",
  CLAUDE: "https://api.anthropic.com/v1/",
  PERPLEXITY: "https://api.perplexity.ai",
  // <FUTURE_PROVIDER>: <BASE URL>  // 1 line of code for integration
};

export const DEFAULT_AI_MODEL: string = "gemini-1.5-pro";
export const DEFAULT_AI_OPTION: AiOption = AiOption.Gemini;

export const SYSTEM_PROMPT: string = `You are an AI coding assistant for a GitHub repository explorer. You help users understand code in the repository they're viewing.

## ROLE AND PURPOSE
- Help users understand repository code structure
- Explain how specific files work and their purpose
- Answer questions about programming patterns and techniques used

## RESPONSE FORMAT
Always structure your responses using these sections when applicable:

### FILE ANALYSIS
- Summarize the purpose of the file
- Identify key functions, classes, or components
- Explain the file's role in the larger codebase

### CODE EXPLANATION
- Break down complex parts of the code
- Explain programming patterns or techniques used
- Clarify any unusual or advanced code structures

### CONSIDERATIONS
- Note potential improvements or optimization opportunities
- Highlight good practices implemented in the code
- Suggest related files that might be worth examining

## FORMATTING GUIDELINES
- Use markdown for structured, readable responses
- Use \`code blocks\` for small code snippets
- Use larger code blocks with syntax highlighting for multi-line code:
\`\`\`typescript
// TypeScript code example
\`\`\`
- Use bulleted lists for multiple points
- Use bold text for emphasis on important concepts

Always maintain a helpful, educational tone while focusing on the specific code the user is asking about.`;

export const FIRST_MESSAGE: string =
  "Hello! I'm your GitHub Buddy AI assistant. I can help you understand any file in this repository. Select a file and ask me questions about it!";

export const DEFAULT_ERROR_MESSAGE: string =
  "Something went wrong with the AI response. Please try again later!";

export const getLlmOptionBaseUrl = (aiOption: AiOption): string => {
  return BASE_URLS[aiOption];
};

export const AI_MODELS_DISPLAY = [
  { model: "gemini-1.5-pro", display: "Gemini 1.5 Pro" },
  { model: "gemini-1.5-flash", display: "Gemini 1.5 Flash" },
  { model: "gemini-2.0-flash", display: "Gemini 2.0 Flash" },
  { model: "gemini-2.0-flash-lite", display: "Gemini 2.0 Flash-Lite" },
  { model: "o1", display: "GPT o1" },
  { model: "o1-mini", display: "GPT o1-mini" },
  { model: "o3-mini", display: "GPT o3-mini" },
  { model: "gpt-4o", display: "GPT 4o" },
  { model: "gpt-4o-mini", display: "GPT 4o-mini" },
  { model: "gpt-4-turbo", display: "GPT 4-turbo" },
  { model: "claude-3-7-sonnet-20250219", display: "Claude 3.7 Sonnet" },
  { model: "claude-3-5-sonnet-20240620", display: "Claude 3.5 Sonnet" },
  { model: "claude-3-opus-20240229", display: "Claude 3 Opus" },
  { model: "claude-3-sonnet-20240229", display: "Claude 3 Sonnet" },
  { model: "claude-3-haiku-20240307", display: "Claude 3 Haiku" },
];

export const displayAiModel = (aiModel: string): string => {
  const display = AI_MODELS_DISPLAY.find((item) => item.model === aiModel);
  return display ? display.display : aiModel;
};

export const displayAiOption = (aiChoice: AiOption): string => {
  switch (aiChoice) {
    case AiOption.Gemini:
      return "Gemini";
    case AiOption.OpenAi:
      return "OpenAI";
    case AiOption.Claude:
      return "Claude";
    case AiOption.DeepSeek:
      return "DeepSeek";
    case AiOption.Perplexity:
      return "Perplexity";
    default:
      return "";
  }
};

export const AI_PROVIDER_CONFIG: Record<
  AiOption,
  {
    name: string;
    key: string;
    icon: string;
    placeholder: string;
    description: string;
  }
> = {
  [AiOption.OpenAi]: {
    name: "OpenAI",
    key: "openai_api_key",
    icon: "/company/openai.svg",
    placeholder: "Your OpenAI API key",
    description: "Get your API key from the OpenAI dashboard.",
  },
  [AiOption.Gemini]: {
    name: "Gemini",
    key: "gemini_api_key",
    icon: "/company/gemini.svg",
    placeholder: "Your Gemini API key",
    description: "Get your API key from the Google AI Studio.",
  },
  [AiOption.DeepSeek]: {
    name: "DeepSeek",
    key: "deepseek_api_key",
    icon: "/company/deepseek.svg",
    placeholder: "Your DeepSeek API key",
    description: "Get your API key from the DeepSeek platform.",
  },
  [AiOption.Perplexity]: {
    name: "Perplexity",
    key: "perplexity_api_key",
    icon: "/company/perplexity.svg",
    placeholder: "Your Perplexity API key",
    description: "Get your API key from the Perplexity dashboard.",
  },
  [AiOption.Claude]: {
    name: "Claude",
    key: "claude_api_key",
    icon: "/company/claude.svg",
    placeholder: "Your Claude API key",
    description: "Get your API key from Anthropic's dashboard.",
  },
};
