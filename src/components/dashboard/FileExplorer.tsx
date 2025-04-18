"use client";

import { useState } from "react";
import { GitHubRepoDirectory } from "@/types/github";
import { FolderIcon, FileIcon, ChevronRightIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface FileExplorerProps {
  contents: GitHubRepoDirectory;
  onNavigate: (path: string) => void;
  onFileSelect: (path: string) => void;
  currentPath: string;
  isLoading?: boolean;
}

export function FileExplorer({
  contents,
  onNavigate,
  onFileSelect,
  currentPath,
  isLoading = false,
}: FileExplorerProps) {
  const [searchFilter, setSearchFilter] = useState("");

  // Helper for breadcrumb navigation
  const getBreadcrumbs = () => {
    if (!currentPath) return [{ label: "Root", path: "" }];

    const paths = currentPath.split("/");
    let currentPathBuilder = "";

    return [
      { label: "Root", path: "" },
      ...paths.map((segment) => {
        currentPathBuilder = currentPathBuilder
          ? `${currentPathBuilder}/${segment}`
          : segment;
        return {
          label: segment,
          path: currentPathBuilder,
        };
      }),
    ];
  };

  // Navigate to a specific breadcrumb
  const handleBreadcrumbClick = (path: string) => {
    onNavigate(path);
  };

  // Filter files based on search input
  const filteredContents = contents.filter((item) =>
    item.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Sort contents to display directories first, then files
  const sortedContents = [...filteredContents].sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }
    return a.type === "dir" ? -1 : 1;
  });

  return (
    <div className="border rounded-md h-full flex flex-col overflow-hidden">
      <div className="p-3 border-b">
        <div className="flex space-x-2 mb-2">
          {getBreadcrumbs().map((crumb, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRightIcon className="h-4 w-4 mx-1 text-muted-foreground" />
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => handleBreadcrumbClick(crumb.path)}
              >
                {crumb.label}
              </Button>
            </div>
          ))}
        </div>

        <input
          type="text"
          placeholder="Filter files..."
          className="w-full px-2 py-1 text-sm border rounded"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
        />
      </div>

      <ScrollArea className="flex-grow">
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground">
            Loading...
          </div>
        ) : sortedContents.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No files found
          </div>
        ) : (
          <div className="p-2">
            {currentPath && (
              <div
                className="flex items-center p-2 rounded-md hover:bg-muted cursor-pointer"
                onClick={() => {
                  const paths = currentPath.split("/");
                  paths.pop();
                  onNavigate(paths.join("/"));
                }}
              >
                <FolderIcon className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-sm">..</span>
              </div>
            )}

            {sortedContents.map((item) => (
              <div
                key={item.path}
                className="flex items-center p-2 rounded-md hover:bg-muted cursor-pointer"
                onClick={() =>
                  item.type === "dir"
                    ? onNavigate(item.path)
                    : onFileSelect(item.path)
                }
              >
                {item.type === "dir" ? (
                  <FolderIcon className="h-4 w-4 mr-2 text-blue-500" />
                ) : (
                  <FileIcon className="h-4 w-4 mr-2 text-gray-500" />
                )}
                <span className="text-sm truncate">{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
