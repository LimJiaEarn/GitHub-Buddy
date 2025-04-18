"use client";

import { useState, useEffect } from "react";
import { GitHubFile } from "@/types/github";
import ChatInput from "./Input";
import ChatMessages from "./Messages";
import { AiOption } from "@/types/ai";
import { promptAI } from "@/app/actions/prompting";
import { decodeBase64Content, getFileExtension } from "@/utils/formURLs";
import { displayAiOption, AI_PROVIDER_CONFIG } from "@/constants/ai";
import { toast } from "sonner";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { useRouter } from "next/navigation";

interface AiChatProps {
  file: GitHubFile | null;
}

export default function AiChat({ file }: AiChatProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<AiOption>(AiOption.OpenAi);
  const [model, setModel] = useState<string>("gpt-4-turbo");
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([
    {
      role: "assistant",
      content: `Hello I am your assistant from ${displayAiOption(
        provider
      )}, I am here to answer your questions!`,
    },
  ]);

  const [content, setContent] = useState<string>("");
  const [language, setLanguage] = useState<string>("text");

  const router = useRouter();

  useEffect(() => {
    if (file && file.content) {
      const decodedContent = decodeBase64Content(file.content);
      setContent(decodedContent);

      // Determine language based on file extension
      const ext = getFileExtension(file.name);
      const langMap: { [key: string]: string } = {
        js: "javascript",
        jsx: "jsx",
        ts: "typescript",
        tsx: "tsx",
        py: "python",
        java: "java",
        html: "html",
        css: "css",
        json: "json",
        md: "markdown",
        yml: "yaml",
        yaml: "yaml",
        // Add more mappings as needed
      };

      setLanguage(langMap[ext] || "text");
    }
    setMessages([]);
  }, [file]);

  const handleSendMessage = async (message: string) => {
    const apiKey = localStorage.getItem(AI_PROVIDER_CONFIG[provider].key);

    if (!message.trim()) return;

    if (!apiKey) {
      toast("Error!", {
        description: `${displayAiOption(provider)}'s API key not set!`,
        action: {
          label: "Set Now",
          onClick: () => router.push("/settings"),
        },
      });
      return;
    }

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: message }]);

    setIsLoading(true);

    try {
      const {
        success,
        message,
        data: reply,
      } = await promptAI({
        aiOption: provider,
        aiModel: model,
        apiKey,
        chatMessages: messages,
        codeContext: {
          code: content,
          language,
        },
      });

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply || "I'm sorry, I couldn't process that request.",
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelSelect = (
    selectedProvider: AiOption,
    selectedModel: string
  ) => {
    setProvider(selectedProvider);
    setModel(selectedModel);
  };

  return (
    <div className="flex flex-col h-full p-2">
      <div className="flex flex-col gap-2">
        <h2 className="text-center w-full font-bold text-xl">
          {displayAiOption(provider)} Assistant
        </h2>
      </div>
      <div className="flex-1 overflow-auto w-full my-2 p-1 flex flex-col">
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          providerName={displayAiOption(provider)}
        />
      </div>
      <ChatInput
        onSendMessage={handleSendMessage}
        isDisabled={isLoading}
        onModelSelect={handleModelSelect}
        selectedProvider={provider}
        selectedModel={model}
      />
    </div>
  );
}
