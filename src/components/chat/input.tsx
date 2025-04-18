"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, SendIcon, Trash } from "lucide-react";
import ModelSelector from "@/components/chat/ModelSelector";
import { AiOption } from "@/types/ai";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
  onModelSelect: (selectedProvider: AiOption, selectedModel: string) => void;
  selectedProvider: AiOption;
  selectedModel: string;
}

export default function ChatInput({
  onSendMessage,
  isDisabled = false,
  onModelSelect,
  selectedProvider,
  selectedModel,
}: ChatInputProps) {
  const [prompt, setPrompt] = useState<string>("");

  const handleSend = () => {
    if (prompt.trim()) {
      console.log(`sending prompt: ${prompt}`);
      onSendMessage(prompt);
      setPrompt("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDelete = () => {
    alert("todo");
  };

  return (
    <div className="border-t bg-background flex items-end gap-2 w-full">
      <Textarea
        placeholder="What is this code doing?"
        className="w-full min-h-[80px] flex-1 resize-none"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
      />
      <div className="flex flex-col gap-1">
        <div>
          <Button
            className="h-10 w-10 p-0"
            disabled={!prompt.trim() || isDisabled}
            onClick={handleSend}
          >
            {isDisabled ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <SendIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
        <ModelSelector
          onModelSelect={onModelSelect}
          selectedProvider={selectedProvider}
          selectedModel={selectedModel}
        />
      </div>
    </div>
  );
}
