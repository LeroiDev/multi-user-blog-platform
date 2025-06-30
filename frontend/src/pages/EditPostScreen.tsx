import { useState, useEffect, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import FormField from "../components/CustomFormField";
import { Button, LinkButton } from "../components/CustomButton";
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

  // 1. Fetch the existing post
  const {
    data: post,
    isLoading: postLoading,
    error: postError,
  } = useQuery<Post>({
    queryKey: ["post", id],
    queryFn: () => api.get<Post>(`/posts/${id}`).then((r) => r.data),
    enabled: Boolean(id),
  });

  // 2. Local form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 3. Pre-fill when post loads
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  // 4. Mutation for updating
  const updateMutation = useMutation({
    mutationFn: () => api.put(`/posts/${id}`, { title, content }),
    onSuccess: () => {
      toast.success("Post updated successfully");
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate(`/posts/${id}`);
    },
    onError: () => {
      toast.error("Failed to save changes");
    },
  });

  // 5. Loading / error / not found states
  if (postLoading) {
    return <p className="text-center">Loading…</p>;
  }
  if (postError instanceof Error) {
    return <p className="text-center text-red-500">Error: {postError.message}</p>;
  }
  if (!post) {
    return <p className="text-center">Post not found.</p>;
  }

  // 6. Handle form submit
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

        <div className="flex justify-center items-center space-x-4 mt-6">
          {/* Primary “Save Changes” button */}
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            variant="primary"
            className="px-6"
          >
            {updateMutation.isPending ? "Saving…" : "Save Changes"}
          </Button>

          {/* Secondary “Cancel” link */}
          <LinkButton
            to={`/posts/${id}`}
            variant="secondary"
            className="px-6"
          >
            Cancel
          </LinkButton>
        </div>
      </form>
    </div>
  );
}
