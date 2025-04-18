import { GitHubRepoInfo } from "@/types/github";
import { Button } from "@/components/ui/button";
import {
  GitForkIcon,
  StarIcon,
  EyeIcon,
  CodeIcon,
  CalendarIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RepoCardProps {
  repo: GitHubRepoInfo;
  onSelect: () => void;
  showFullName?: boolean;
}

export function RepoCard({
  repo,
  onSelect,
  showFullName = false,
}: RepoCardProps) {
  // Format the updated date
  const updatedAt = new Date(repo.updated_at);
  const updatedTimeAgo = formatDistanceToNow(updatedAt, { addSuffix: true });

  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-primary truncate">
          {showFullName ? repo.full_name : repo.name}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 mr-1" />
            {repo.stargazers_count.toLocaleString()}
          </div>
          <div className="flex items-center">
            <GitForkIcon className="h-4 w-4 mr-1" />
            {repo.forks_count.toLocaleString()}
          </div>
        </div>
      </div>

      {repo.description && (
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {repo.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {repo.language && (
            <div className="flex items-center">
              <CodeIcon className="h-3 w-3 mr-1" />
              {repo.language}
            </div>
          )}
          <div className="flex items-center">
            <CalendarIcon className="h-3 w-3 mr-1" />
            {updatedTimeAgo}
          </div>
          <div className="flex items-center">
            <EyeIcon className="h-3 w-3 mr-1" />
            {repo.watchers_count.toLocaleString()}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onSelect}
          className="text-xs px-2 h-7"
        >
          Browse
        </Button>
      </div>
    </div>
  );
}
