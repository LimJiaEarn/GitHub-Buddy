"use client";

import { useGithub } from "@/hooks/useGithub";
import { FileExplorer } from "@/components/dashboard/FileExplorer";
import { FileViewer } from "@/components/dashboard/FileViewer";
import { DirectSearch } from "@/components/dashboard/DirectSearch";
import { SplitView } from "@/components/layout/split-view";
import AiChat from "@/components/chat/Chat";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ChevronLeftIcon } from "lucide-react";

export default function Home() {
  const {
    handleRepoSubmit,
    handleRepoLinkSubmit,
    handleDirectoryClick,
    handleFileClick,
    isLoading,
    repo,
    directoryContents,
    currentFile,
    currentPath,
  } = useGithub();

  const searchParams = useSearchParams();

  useEffect(() => {
    const repoLink = searchParams.get("repoLink");

    if (repoLink) {
      handleRepoLinkSubmit(repoLink);
    }
  }, [searchParams]);

  return (
    <div className="mx-auto p-4 h-full">
      {!repo ? (
        <div className="max-w-md mx-auto mt-10">
          <DirectSearch onSubmit={handleRepoSubmit} isLoading={isLoading} />
        </div>
      ) : (
        <div className="h-full flex flex-col">
          <div className="mb-4">
            <h1 className="text-2xl font-bold glow-text">
              {repo.owner.login}/{repo.name}
            </h1>
            {repo.description && (
              <p className="text-muted-foreground">{repo.description}</p>
            )}
          </div>

          <SplitView
            className="flex-1 h-full"
            leftPane={
              <FileExplorer
                contents={directoryContents}
                onNavigate={handleDirectoryClick}
                onFileSelect={handleFileClick}
                currentPath={currentPath}
                isLoading={isLoading}
              />
            }
            centerPane={
              currentFile ? (
                <FileViewer file={currentFile} isLoading={isLoading} />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <ChevronLeftIcon
                    className="text-muted-foreground pr-2"
                    size={30}
                  />
                  <p className="text-muted-foreground">Select a file to view</p>
                  <ChevronLeftIcon
                    className="text-muted-foreground pl-2"
                    size={30}
                  />
                </div>
              )
            }
            rightPane={<AiChat file={currentFile} />}
            leftPaneWidth={15}
            centerPaneWidth={50}
          />
        </div>
      )}
    </div>
  );
}
