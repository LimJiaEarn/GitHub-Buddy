import {
  GitHubFile,
  GitHubRepoDirectory,
  GitHubRepoInfo,
  GitHubSearchResult,
} from "@/types/github";
import { createRequestHeaders, getGitHubToken } from "@/utils/formRequest";

// Helper functions for GitHub API URLs
const createRepoInfoUrl = (username: string, repoName: string): string => {
  return `https://api.github.com/repos/${username}/${repoName}`;
};

const createRepoDirectoryUrl = (
  username: string,
  repoName: string,
  path: string = ""
): string => {
  return `https://api.github.com/repos/${username}/${repoName}/contents/${path}`;
};

const createSearchReposUrl = (query: string): string => {
  return `https://api.github.com/search/repositories?q=${encodeURIComponent(
    query
  )}`;
};

// Fetch repo information
export async function fetchRepoInfo(
  username: string,
  repoName: string
): Promise<GitHubRepoInfo> {
  try {
    const token = getGitHubToken();

    console.log(
      "[fetchRepoInfo] Sending request to: ",
      createRepoInfoUrl(username, repoName)
    );

    const response = await fetch(createRepoInfoUrl(username, repoName), {
      method: "GET",
      headers: createRequestHeaders(token),
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching repo info:", error);
    throw error;
  }
}

// Fetch repository directory content
export async function fetchRepoDirectory(
  username: string,
  repoName: string,
  path: string = ""
): Promise<GitHubRepoDirectory> {
  try {
    const token = getGitHubToken();
    const url = createRepoDirectoryUrl(username, repoName, path);

    const response = await fetch(url, {
      method: "GET",
      headers: createRequestHeaders(token),
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching repo directory:", error);
    throw error;
  }
}

// Fetch file content
export async function fetchFileContent(
  username: string,
  repoName: string,
  filePath: string
): Promise<GitHubFile> {
  try {
    const token = getGitHubToken();
    const url = createRepoDirectoryUrl(username, repoName, filePath);

    console.log("[fetchFileContent] Sending request to: ", url);

    const response = await fetch(url, {
      method: "GET",
      headers: createRequestHeaders(token),
      next: { revalidate: 60 }, // Cache file content for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching file content:", error);
    throw error;
  }
}

// Search for repositories
export async function searchRepositories(
  query: string
): Promise<GitHubSearchResult> {
  try {
    const token = getGitHubToken();
    const url = createSearchReposUrl(query);

    console.log("[searchRepositories] Sending request to: ", url);

    const response = await fetch(url, {
      method: "GET",
      headers: createRequestHeaders(token),
      next: { revalidate: 60 }, // Cache search results for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching repositories:", error);
    throw error;
  }
}
