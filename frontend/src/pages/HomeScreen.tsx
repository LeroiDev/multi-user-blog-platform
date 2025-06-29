import { LinkButton } from "../components/CustomButton";
import PostCard from "../components/PostCard";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

import lightningImg from "../assets/images/lightning_blog.jpg";

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
    queryFn: () => api.get("/posts?limit=3").then((r) => r.data),
  });

  return (
    <>
      {/* Hero Banner */}
      <div
        className="w-full h-[400px] bg-cover bg-center"
        style={{ backgroundImage: `url(${lightningImg})` }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <h1 className="text-6xl font-heading text-white drop-shadow-lg">
            Welcome to Lightning Blog
          </h1>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mt-12 text-center">
        <p className="text-xl text-neutral-700">
          A modern multi-user blogging platform—log in or register to start
          writing!
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <LinkButton to="/posts" variant="primary">
            View Posts
          </LinkButton>
          <LinkButton to="/posts/new" variant="secondary">
            New Post
          </LinkButton>
          <LinkButton to="/login" variant="primary">
            Login
          </LinkButton>
          <LinkButton to="/register" variant="secondary">
            Register
          </LinkButton>
        </div>
      </div>

      {/* Latest Posts */}
      <div className="container mt-16">
        <h2 className="text-3xl font-heading text-neutral-900 mb-8">
          Latest Posts
        </h2>
        {isLoading ? (
          <p className="text-center text-neutral-500">Loading posts…</p>
        ) : error ? (
          <p className="text-center text-error">Failed to load posts</p>
        ) : posts?.length ? (
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
          <p className="text-center text-neutral-500">No posts yet.</p>
        )}
      </div>
    </>
  );
}
