import { useState, useEffect, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FormField from "../components/CustomFormField";
import { Button } from "../components/CustomButton";
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

  // Fetch the existing post
  const {
    data: post,
    isLoading,
    error,
  } = useQuery<Post>({
    queryKey: ["post", id],
    queryFn: () => api.get<Post>(`/posts/${id}`).then((r) => r.data),
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

  // Handle loading/error states
  if (isLoading) {
    return <p className="text-center">Loading…</p>;
  }
  if (error instanceof Error) {
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }
  if (!post) {
    return <p className="text-center">Post not found.</p>;
  }

  // Submit handler
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-heading mb-6 text-neutral-900">Edit Post</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField label="Title" htmlFor="title">
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-neutral-300 rounded"
            required
          />
        </FormField>
        <FormField label="Content" htmlFor="content">
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full p-2 border border-neutral-300 rounded"
            required
          />
        </FormField>
        <Button
          type="submit"
          disabled={updateMutation.isPending}
          className="w-full"
        >
          {updateMutation.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
