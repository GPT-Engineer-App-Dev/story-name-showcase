import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";

const fetchTopStories = async () => {
  const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
  const storyIds = await response.json();
  return Promise.all(storyIds.slice(0, 100).map(fetchStory));
};

const fetchStory = async (id) => {
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
  return response.json();
};

const StoryItem = ({ story }) => (
  <Card className="mb-4">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{story.title}</CardTitle>
      <div className="text-sm text-muted-foreground">Score: {story.score}</div>
    </CardHeader>
    <CardContent>
      <a
        href={story.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-500 hover:underline flex items-center"
      >
        Read more <ExternalLink className="ml-1 h-4 w-4" />
      </a>
    </CardContent>
  </Card>
);

const SkeletonStory = () => (
  <Card className="mb-4">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-[60px]" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-[100px]" />
    </CardContent>
  </Card>
);

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: stories, isLoading } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });

  const filteredStories = stories?.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hacker News Top Stories</h1>
      <Input
        type="text"
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-8"
      />
      {isLoading ? (
        Array(10)
          .fill()
          .map((_, index) => <SkeletonStory key={index} />)
      ) : (
        filteredStories?.map((story) => <StoryItem key={story.id} story={story} />)
      )}
    </div>
  );
};

export default Index;