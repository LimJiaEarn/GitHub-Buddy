"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  GitHubFile,
  GitHubRepoDirectory,
  GitHubRepoInfo,
} from "@/types/github";
import {
  fetchRepoInfo,
  fetchRepoDirectory,
  fetchFileContent,
} from "@/app/actions/github-client";
import { toast } from "sonner";

interface GitHubContextType {
  repo: GitHubRepoInfo | null;
  directoryContents: GitHubRepoDirectory;
  currentFile: GitHubFile | null;
  isLoading: boolean;
  loadRepo: (username: string, repoName: string) => Promise<void>;
  loadDirectory: (path: string) => Promise<void>;
  loadFile: (path: string) => Promise<void>;
  currentPath: string;
  username: string;
  repoName: string;
}

const GitHubContext = createContext<GitHubContextType | undefined>(undefined);

export function GitHubProvider({ children }: { children: ReactNode }) {
  const [repo, setRepo] = useState<GitHubRepoInfo | null>(null);
  const [directoryContents, setDirectoryContents] =
    useState<GitHubRepoDirectory>([]);
  const [currentFile, setCurrentFile] = useState<GitHubFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [username, setUsername] = useState("");
  const [repoName, setRepoName] = useState("");

  const loadRepo = useCallback(async (username: string, repoName: string) => {
    setIsLoading(true);
    try {
      // Store the username and repo name
      setUsername(username);
      setRepoName(repoName);

      // Fetch repo info
      const repoInfo = await fetchRepoInfo(username, repoName);
      setRepo(repoInfo);

      // Reset path and load root directory
      setCurrentPath("");
      const contents = await fetchRepoDirectory(username, repoName);
      setDirectoryContents(contents);

      // Clear any previously selected file
      setCurrentFile(null);
    } catch (error) {
      console.error("Error loading repository:", error);
      toast.error("Failed to load repository");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadDirectory = useCallback(
    async (path: string) => {
      if (!username || !repoName) return;

      setIsLoading(true);
      try {
        const contents = await fetchRepoDirectory(username, repoName, path);
        setDirectoryContents(contents);
        setCurrentPath(path);
        // Clear any previously selected file when navigating directories
        setCurrentFile(null);
      } catch (error) {
        console.error("Error loading directory:", error);
        toast.error("Failed to load directory contents");
      } finally {
        setIsLoading(false);
      }
    },
    [username, repoName]
  );

  const loadFile = useCallback(
    async (path: string) => {
      if (!username || !repoName) return;

      setIsLoading(true);
      try {
        const file = await fetchFileContent(username, repoName, path);
        setCurrentFile(file);
        setCurrentPath(path);
      } catch (error) {
        console.error("Error loading file:", error);
        toast.error("Failed to load file content");
      } finally {
        setIsLoading(false);
      }
    },
    [username, repoName]
  );

  const value = {
    repo,
    directoryContents,
    currentFile,
    isLoading,
    loadRepo,
    loadDirectory,
    loadFile,
    currentPath,
    username,
    repoName,
  };

  return (
    <GitHubContext.Provider value={value}>{children}</GitHubContext.Provider>
  );
}

export function useGitHubContext() {
  const context = useContext(GitHubContext);
  if (context === undefined) {
    throw new Error("useGitHubContext must be used within a GitHubProvider");
  }
  return context;
}
