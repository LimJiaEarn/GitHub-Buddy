"use client";

import { useGithub } from "@/hooks/useGithub";
import { DirectSearch } from "@/components/dashboard/DirectSearch";
import { BrowseUserRepos } from "@/components/dashboard/BrowseUserRepos";
import { BrowseGitHubRepos } from "@/components/dashboard/BrowseGitHubRepos";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const { isLoading } = useGithub();

  const handleRepoSelect = (username: string, repoName: string) => {
    router.push(`/explore?repoLink=${username}/${repoName}`);
  };

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-6rem)]">
      <div className="max-w-4xl mx-auto mt-6">
        <Tabs defaultValue="search">
          <TabsList className="mb-4">
            <TabsTrigger value="search">Search GitHub Repos</TabsTrigger>
            <TabsTrigger value="browse">Search User Repos</TabsTrigger>
            <TabsTrigger value="direct">Direct URL</TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <BrowseGitHubRepos onRepoSelect={handleRepoSelect} />
          </TabsContent>

          <TabsContent value="browse">
            <BrowseUserRepos onRepoSelect={handleRepoSelect} />
          </TabsContent>

          <TabsContent value="direct">
            <DirectSearch onSubmit={handleRepoSelect} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
