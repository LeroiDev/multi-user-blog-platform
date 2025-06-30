import { LinkButton } from "../components/CustomButton";
import PostCard from "../components/PostCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { useAuthStore } from "../stores/authStore";

interface Post {
  id: number;
  title: string;
  content: string;
  author_email: string;
  publication_date: string;
  thumbnail_url?: string;
}

export default function HomeScreen() {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery<Post[]>({
    queryKey: ["posts", { limit: 3 }],
    queryFn: () => api.get("/posts/?limit=3").then((r) => r.data),
  });

  const token = useAuthStore((s) => s.token);
  const isLoggedIn = Boolean(token);

  return (
    <>
      {/* CTA Section */}
      <div className="container mt-12 text-center text-neutral-100">
        <h1 className="text-5xl font-extrabold mb-4">Horizon Haven Blog</h1>

        {!isLoggedIn ? (
          <>
            <p className="text-xl mb-6">
              Welcome! Explore inspiring stories or register to start sharing
              your own.
            </p>
            <div className="flex justify-center gap-4">
              <LinkButton to="/posts" variant="secondary">
                View Posts
              </LinkButton>
            </div>
          </>
        ) : (
          <>
            <p className="text-xl mb-6">
              Welcome back! Ready to write your next great post?
            </p>
            <div className="flex justify-center gap-4">
              <LinkButton to="/posts" variant="secondary">
                View Posts
              </LinkButton>
              <LinkButton to="/posts/new" variant="primary">
                New Post
              </LinkButton>
            </div>
          </>
        )}
      </div>

      {/* Latest Posts */}
      <div className="container mt-16">
        <h2 className="text-3xl font-heading text-neutral-100 mb-8">
          Latest Posts
        </h2>
        {isLoading ? (
          <p className="text-center text-neutral-400">Loading posts…</p>
        ) : error ? (
          <p className="text-center text-error">Failed to load posts</p>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {posts.map((p) => (
              <PostCard
                key={p.id}
                id={p.id}
                title={p.title}
                excerpt={p.content}
                author={p.author_email}
                date={p.publication_date}
                thumbnailUrl={p.thumbnail_url}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-400">No posts yet.</p>
        )}
      </div>
    </>
  );
}
