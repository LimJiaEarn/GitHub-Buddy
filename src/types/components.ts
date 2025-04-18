// src/types/components.ts
import { GitHubFile, GitHubRepoDirectory, GitHubRepoInfo } from "./github";

// FileViewer component types
export interface FileViewerProps {
  file: GitHubFile;
  isLoading?: boolean;
  onBack?: () => void;
}

// FileExplorer component types
export interface FileExplorerProps {
  contents: GitHubRepoDirectory;
  currentPath: string;
  onNavigate: (path: string) => void;
  onFileSelect: (file: GitHubFile) => void;
}

// RepoCard component types
export interface RepoCardProps {
  repo: GitHubRepoInfo;
}

// RepoForm component types
export interface RepoFormProps {
  onSubmit: (username: string, repo: string) => void;
  isLoading: boolean;
}

// MainLayout component types
export interface MainLayoutProps {
  repoContents?: GitHubRepoDirectory | null;
  repoInfo?: GitHubRepoInfo;
  currentPath: string;
  isLoading: boolean;
  onNavigate: (path: string) => void;
  children?: React.ReactNode;
}
