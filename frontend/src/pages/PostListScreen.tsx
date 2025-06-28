// src/pages/PostListScreen.tsx
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";      // your Axios instance
import { Link } from "react-router-dom";

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
    queryFn: () => api.get("/posts").then(res => res.data)
  });

  if (isLoading) return <div>Loading posts…</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4 grid gap-4 md:grid-cols-2">
      {posts?.map((post: Post) => (
        <Link
          key={post.id}
          to={`/posts/${post.id}`}
          className="border p-4 rounded hover:shadow"
        >
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="text-sm text-gray-600">
            By {post.author_email} on{" "}
            {new Date(post.publication_date).toLocaleDateString()}
          </p>
          <p className="mt-2 text-base line-clamp-2">{post.content}</p>
        </Link>
      ))}
    </div>
  );
}
