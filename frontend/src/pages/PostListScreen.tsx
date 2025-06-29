import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import PageShell from "../components/PageShell";
import PostCard from "../components/PostCard";

interface Post {
  id: number;
  title: string;
  content: string;
  author_email: string;
  publication_date: string;
  thumbnail_url?: string;
}

export default function PostListScreen() {
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: () => api.get("/posts").then((res) => res.data),
  });

  return (
    <PageShell>
      {isLoading && <p className="text-center">Loading posts…</p>}
      {error instanceof Error && (
        <p className="text-center text-red-500">Error: {error.message}</p>
      )}
      {!isLoading && posts?.length === 0 && (
        <p className="text-center text-neutral-500">No posts yet.</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {posts?.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            excerpt={post.content}
            author={post.author_email}
            date={post.publication_date}
            thumbnailUrl={post.thumbnail_url}
          />
        ))}
      </div>
    </PageShell>
  );
}
