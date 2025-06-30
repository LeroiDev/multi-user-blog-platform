import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../components/Sidebar";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { api } from "../api/client";
import { useAuthStore } from "../stores/authStore";
import { LinkButton, Button } from "../components/CustomButton";
import { useState } from "react";
import toast from "react-hot-toast";

interface Post {
  id: number;
  title: string;
  content: string;
  author_email: string;
  publication_date: string;
  owner_id: number;
  thumbnail_url?: string;
}

export default function PostDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const currentUser = useAuthStore((s) => s.user);

  const {
    data: post,
    isLoading,
    error,
  } = useQuery<Post>({
    queryKey: ["post", id],
    queryFn: () => api.get(`/posts/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const [showConfirm, setShowConfirm] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully");
      navigate("/posts", { replace: true });
    },
    onError: () => {
      toast.error("Failed to delete post");
    },
  });

  if (isLoading) {
    return <p className="text-center">Loading post…</p>;
  }

  if (error instanceof Error) {
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  if (!post) {
    return <p className="text-center">Post not found.</p>;
  }

  const isOwner = Boolean(token && currentUser?.id === post.owner_id);

  return (
    <>
      <div className="flex gap-8">
        {/* Main content */}
        <article className="flex-grow bg-white rounded-lg shadow-lg overflow-hidden">
          {post.thumbnail_url && (
            <img
              src={post.thumbnail_url}
              alt={post.title}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-6">
            <h1 className="font-heading text-3xl mb-4">{post.title}</h1>
            <p className="text-sm text-neutral-500 mb-6">
              By {post.author_email} on{" "}
              {new Date(post.publication_date).toLocaleDateString()}
            </p>
            <div className="prose prose-lg max-w-none text-neutral-800 mb-6 whitespace-pre-wrap">
              {post.content}
            </div>
            {isOwner && (
              <div className="flex space-x-4">
                <LinkButton to={`/posts/${id}/edit`} variant="secondary">
                  Edit
                </LinkButton>
                <Button onClick={() => setShowConfirm(true)} variant="error">
                  Delete
                </Button>
              </div>
            )}
          </div>
        </article>

        {/* Sidebar */}
        <Sidebar authorEmail={post.author_email} />
      </div>
      {/* Confirmation Modal */}
      <ConfirmationDialog
        open={showConfirm}
        title="Delete this post?"
        description="Once deleted, you can’t recover this post."
        confirmText="Yes, delete"
        cancelText="Cancel"
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          deleteMutation.mutate();
        }}
      />
    </>
  );
}
