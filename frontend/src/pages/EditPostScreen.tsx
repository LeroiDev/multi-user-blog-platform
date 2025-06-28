// src/pages/EditPostScreen.tsx
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

interface Post {
  id: number;
  title: string;
  content: string;
}

export default function EditPostScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Fetch existing post
  const {
    data: post,
    isLoading,
    error,
  } = useQuery<Post>({
    queryKey: ["post", id],
    queryFn: () => api.get<Post>(`/posts/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  // Local form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Pre-fill when post loads
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);
  // Mutation for updating
  const updateMutation = useMutation({
    mutationFn: () => api.put(`/posts/${id}`, { title, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate(`/posts/${id}`);
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  if (isLoading) return <div>Loading…</div>;
  if (error instanceof Error) return <div>Error: {error.message}</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <form onSubmit={onSubmit} className="p-4 max-w-2xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Edit Post</h2>

      <div>
        <label className="block mb-1 font-medium">Title</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Content</label>
        <textarea
          className="w-full border px-3 py-2 rounded h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={updateMutation.isPending}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        {updateMutation.isPending ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
