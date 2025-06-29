// src/pages/PostListScreen.tsx
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import PostCard from "../components/PostCard";

interface Post {
  id: number;
  title: string;
  content: string;
  author_email: string;
  publication_date: string;
}

export default function PostListScreen() {
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: () => api.get("/posts").then((res) => res.data),
  });

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg text-neutral-900">
      <h2 className="text-3xl font-heading mb-6">All Posts</h2>

      {isLoading ? (
        <p className="text-center text-neutral-500">Loading posts…</p>
      ) : error instanceof Error ? (
        <p className="text-center text-error">Error: {error.message}</p>
      ) : posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              excerpt={post.content}
              author={post.author_email}
              date={post.publication_date}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-neutral-500">No posts yet.</p>
      )}
    </div>
  );
}
