"use server";
import { AiChatRole, AiOption } from "@/types/ai";

import OpenAi from "openai";
import { SimpleDataResponse } from "@/types/global";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { getLlmOptionBaseUrl } from "@/constants/ai";

interface userCode {
  code: string;
  language: string;
}

export interface OpenAiInitParams {
  apiKey: string;
  baseURL?: string;
}

interface cloudPromptAiProps {
  aiOption: AiOption;
  aiModel: string;
  apiKey: string;
  chatMessages: ChatCompletionMessageParam[];
  codeContext: userCode | null;
}

export const promptAI = async ({
  aiOption,
  aiModel,
  apiKey,
  chatMessages,
  codeContext,
}: cloudPromptAiProps): Promise<SimpleDataResponse<string>> => {
  try {
    // Prepare messages array with system prompt
    const systemMessage = [SYSTEM_PROMPT];

    const sendMessages: ChatCompletionMessageParam[] = [
      { role: AiChatRole.System, content: systemMessage.join("\n\n\n") },
      ...chatMessages,
    ];

    if (codeContext) {
      sendMessages.push({
        role: AiChatRole.User,
        content: [
          {
            type: "text",
            text: `This is the code:\n\`\`\`${codeContext.language}\n${codeContext.code}\n\`\`\``,
          },
        ],
      });
    }

    const llmProvider = aiOption;
    const llmModel = aiModel;
    const messages = sendMessages;

    const LLMClient = new OpenAi({
      apiKey,
      baseURL: getLlmOptionBaseUrl(llmProvider),
    });

    const response = await LLMClient.chat.completions.create({
      model: llmModel,
      messages,
    });

    const reply = response.choices[0].message.content;

    if (!reply) {
      throw new Error("Reply of length 0 received");
    }

    return {
      success: true,
      message: "Successfully received reply",
      data: reply,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to get reply",
      data: "",
    };
  }
};

const SYSTEM_PROMPT: string = `You are an assistant for a user navigating a github repository. You may receive questions related to the user file

## ROLE AND PURPOSE
- Help users understand the current code file
- Guide them towards improvements in the code file if they ask for it
- Analyze code and suggest improvements or identify bugs

## RESPONSE FORMAT
Always structure your responses using these sections when applicable:

### CODE REVIEW (if code is provided)
- Identify logical errors or bugs
- Point out inefficiencies or potential optimizations
- Highlight good practices already implemented

### CONSIDERATIONS
- Highlight potential optimizations or trade-offs

## FORMATTING GUIDELINES
- Use markdown for structured, readable responses
- Use \`code blocks\` for small code snippets
- Use larger code blocks with syntax highlighting for multi-line code:
\`\`\`python
# Python code example
\`\`\`
- Use bulleted lists for multiple points
- Use bold text for emphasis on important concepts
- Use blockquotes for hints or tips

## IMPORTANT NOTES
- Adapt your level of help based on the user's questions
- Provide explanations that foster learning

Always maintain a helpful, encouraging tone while prioritizing educational value`;
