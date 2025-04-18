// GitHub API URL builders
export const createRepoInfoUrl = (
  username: string,
  repoName: string
): string => {
  return `https://api.github.com/repos/${username}/${repoName}`;
};

export const createRepoDirectoryUrl = (
  username: string,
  repoName: string,
  path: string = ""
): string => {
  return `https://api.github.com/repos/${username}/${repoName}/contents/${path}`;
};

export const createUserReposUrl = (username: string): string => {
  return `https://api.github.com/users/${username}/repos`;
};

// Helper to get file extension from filename
export const getFileExtension = (filename: string): string => {
  if (!filename) return "";
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
};

// Helper to get base64 content
export const decodeBase64Content = (content: string): string => {
  try {
    return atob(content.replace(/\n/g, ""));
  } catch (error) {
    console.error("Error decoding content:", error);
    return "Error decoding content";
  }
};

// Helper to determine if content might be binary
export const isBinaryContent = (content: string): boolean => {
  // Simple heuristic: check for null bytes or high frequency of non-printable chars
  const nonPrintableChars = content.match(/[\x00-\x08\x0E-\x1F\x7F-\xFF]/g);
  return (
    nonPrintableChars !== null &&
    nonPrintableChars.length > content.length * 0.1
  );
};
