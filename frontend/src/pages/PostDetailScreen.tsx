// src/pages/PostDetailScreen.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { useAuthStore } from "../stores/authStore";

interface Post {
  id: number;
  title: string;
  content: string;
  author_email: string;
  publication_date: string;
  owner_id: number;
}

export default function PostDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.user);

  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ["post", id],
    queryFn: () => api.get<Post>(`/posts/${id}`).then((res) => res.data),
    enabled: !!id
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/");
    },
  });

  if (isLoading) return <div>Loading post…</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;
  if (!post) return <div>Post not found.</div>;

  const isOwner = currentUser?.id === post.owner_id;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-600 mb-4">
        By {post.author_email} on{" "}
        {new Date(post.publication_date).toLocaleDateString()}
      </p>
      <div className="prose mb-6 whitespace-pre-wrap">{post.content}</div>

      {isOwner && (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/posts/${id}/edit`)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (confirm("Delete this post?")) {
                deleteMutation.mutate();
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
