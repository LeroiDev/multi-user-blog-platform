import PostCard from "../components/PostCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { LinkButton } from "../components/CustomButton";

interface Post {
  id: number;
  title: string;
  content: string;
  author_email: string;
  publication_date: string;
}

export default function PostListScreen() {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: () => api.get("/posts/").then((r) => r.data),
  });

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg text-neutral-900">
      <h2 className="text-3xl font-heading mb-6">All Posts</h2>

      {isLoading ? (
        // Skeleton grid
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-neutral-300 rounded-lg" />
          ))}
        </div>
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
        // Empty state card
        <div className="p-8 bg-neutral-100 rounded-lg shadow-lg text-center">
          <p className="mb-4 text-neutral-700">There aren’t any posts yet.</p>
          <LinkButton to="/posts/new" variant="secondary">
            Be the first to write one
          </LinkButton>
        </div>
      )}
    </div>
  );
}
