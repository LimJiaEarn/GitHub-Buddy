"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";
import { AiOption } from "@/types/ai";
import { AI_PROVIDER_CONFIG } from "@/constants/ai";

export default function SettingsPage() {
  const [githubToken, setGithubToken] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [apiKeys, setApiKeys] = useState<Record<AiOption, string>>(
    Object.values(AiOption).reduce((acc, option) => {
      acc[option] = "";
      return acc;
    }, {} as Record<AiOption, string>)
  );

  useEffect(() => {
    // Load settings from localStorage on component mount
    const storedGithubToken = localStorage.getItem("github_token") || "";
    const storedGithubUsername = localStorage.getItem("github_username") || "";

    // Load all API keys
    const loadedApiKeys = { ...apiKeys };
    Object.values(AiOption).forEach((option) => {
      const storageKey = AI_PROVIDER_CONFIG[option].key;
      loadedApiKeys[option] = localStorage.getItem(storageKey) || "";
    });

    setGithubToken(storedGithubToken);
    setGithubUsername(storedGithubUsername);
    setApiKeys(loadedApiKeys);
  }, []);

  const handleApiKeyChange = (option: AiOption, value: string) => {
    setApiKeys((prev) => ({ ...prev, [option]: value }));
  };

  const saveSettings = () => {
    // Save GitHub settings to localStorage
    localStorage.setItem("github_token", githubToken);
    localStorage.setItem("github_username", githubUsername);

    // Save all API keys
    Object.values(AiOption).forEach((option) => {
      const storageKey = AI_PROVIDER_CONFIG[option].key;
      localStorage.setItem(storageKey, apiKeys[option]);
    });

    toast.success("Settings saved successfully");
  };

  const clearSettings = () => {
    // Clear GitHub settings
    localStorage.removeItem("github_token");
    localStorage.removeItem("github_username");
    localStorage.removeItem("last_repo");

    // Clear all API keys
    Object.values(AiOption).forEach((option) => {
      const storageKey = AI_PROVIDER_CONFIG[option].key;
      localStorage.removeItem(storageKey);
    });

    // Reset state
    setGithubToken("");
    setGithubUsername("");
    setApiKeys(
      Object.values(AiOption).reduce((acc, option) => {
        acc[option] = "";
        return acc;
      }, {} as Record<AiOption, string>)
    );

    toast.success("Settings cleared successfully");
  };

  return (
    <div className="mx-auto p-4 w-full flex flex-col justify-start items-center">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="grid gap-6 max-w-2xl w-full">
        <Card>
          <CardHeader>
            <CardTitle>GitHub API Configuration</CardTitle>
            <CardDescription>
              Configure your GitHub credentials to access repositories.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">GitHub Username</Label>
              <Input
                id="username"
                placeholder="Your GitHub username"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="token">Personal Access Token</Label>
              <Input
                id="token"
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                This token is stored locally in your browser and is used to
                access GitHub APIs.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Provider API Keys</CardTitle>
            <CardDescription>
              Configure API keys for different AI providers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.values(AiOption).map((option) => {
              const provider = AI_PROVIDER_CONFIG[option];
              return (
                <div key={option} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Image
                      src={provider.icon}
                      alt={provider.name}
                      width={24}
                      height={24}
                    />
                    <Label htmlFor={option}>{provider.name}</Label>
                  </div>
                  <Input
                    id={option}
                    type="password"
                    value={apiKeys[option]}
                    onChange={(e) => handleApiKeyChange(option, e.target.value)}
                    placeholder={provider.placeholder}
                  />
                  <p className="text-sm text-muted-foreground">
                    {provider.description}
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="w-full flex justify-center items-center gap-4">
          <Button
            className="flex-1"
            variant="destructive"
            onClick={clearSettings}
          >
            Clear Settings
          </Button>
          <Button className="flex-1" onClick={saveSettings}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
