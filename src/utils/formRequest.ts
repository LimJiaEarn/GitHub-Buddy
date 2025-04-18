export const createRequestHeaders = (authToken: string | undefined) => {
  return {
    Authorization: authToken ? `Bearer ${authToken}` : "",
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
};

export const getGitHubToken = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("github_token") || "";
  }
  return "";
};
