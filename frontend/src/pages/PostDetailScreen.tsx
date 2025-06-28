import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

interface Post {
  id: number;
  title: string;
  content: string;
  author_email: string;
  publication_date: string;
}

export default function PostDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const {
    data: post,
    isLoading,
    error,
  } = useQuery<Post>({
    queryKey: ["post", id],
    queryFn: () => api.get(`/posts/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  if (isLoading) return <div>Loading post…</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p className="text-sm text-gray-600">
        By {post.author_email} on{" "}
        {new Date(post.publication_date).toLocaleDateString()}
      </p>
      <div className="mt-4 whitespace-pre-wrap">{post.content}</div>
    </div>
  );
}
