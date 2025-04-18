"use server";

import {
  fetchRepoInfo,
  fetchRepoDirectory,
  fetchFileContent,
} from "./github-client";
import {
  GitHubFile,
  GitHubRepoDirectory,
  GitHubRepoInfo,
} from "@/types/github";

// Server action to fetch repository info
export async function fetchRepoInfo_SA(
  username: string,
  repoName: string
): Promise<GitHubRepoInfo> {
  try {
    return await fetchRepoInfo(username, repoName);
  } catch (error) {
    console.error("Server action error fetching repo info:", error);
    throw new Error("Failed to fetch repository information");
  }
}

// Server action to fetch repository directory
export async function fetchRepoDirectory_SA(
  username: string,
  repoName: string,
  path: string = ""
): Promise<GitHubRepoDirectory> {
  try {
    return await fetchRepoDirectory(username, repoName, path);
  } catch (error) {
    console.error("Server action error fetching repo directory:", error);
    throw new Error("Failed to fetch repository directory");
  }
}

// Server action to fetch file content
export async function fetchFileContent_SA(
  username: string,
  repoName: string,
  filePath: string
): Promise<GitHubFile> {
  try {
    return await fetchFileContent(username, repoName, filePath);
  } catch (error) {
    console.error("Server action error fetching file content:", error);
    throw new Error("Failed to fetch file content");
  }
}

// Helper function to get user repositories
export async function fetchUserRepos_SA(
  username: string
): Promise<GitHubRepoInfo[]> {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Server action error fetching user repos:", error);
    throw new Error("Failed to fetch user repositories");
  }
}
