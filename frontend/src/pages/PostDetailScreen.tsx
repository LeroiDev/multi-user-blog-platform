import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "../components/Sidebar";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { LinkButton, Button } from "../components/CustomButton";
import { api } from "../api/client";
import { useAuthStore } from "../stores/authStore";
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

  // 1) Fetch the post
  const {
    data: post,
    isLoading,
    error,
  } = useQuery<Post>({
    queryKey: ["post", id],
    queryFn: () => api.get(`/posts/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  // 2) Delete confirmation dialog state
  const [showConfirm, setShowConfirm] = useState(false);

  // 3) Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/posts/${id}`),
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/posts", { replace: true });
    },
    onError: () => {
      toast.error("Failed to delete post");
    },
  });

  // 1) Loading skeleton
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-neutral-300 rounded w-1/2 mx-auto" />
        <div className="h-6 bg-neutral-300 rounded w-1/3 mx-auto" />
        <div className="h-64 bg-neutral-300 rounded" />
        <div className="space-y-2">
          <div className="h-4 bg-neutral-300 rounded" />
          <div className="h-4 bg-neutral-300 rounded w-5/6" />
          <div className="h-4 bg-neutral-300 rounded w-2/3" />
        </div>
      </div>
    );
  }

  // 2) Error state
  if (error instanceof Error) {
    return <p className="text-center text-red-500">{error.message}</p>;
  }

  // 3) Not found state
  if (!post) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center bg-neutral-100 p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-3xl font-heading mb-4">Post not found</h2>
        <p className="mb-6 text-neutral-700">
          We couldn’t find the post you were looking for.
        </p>
        <LinkButton to="/posts" variant="primary">
          Back to Posts
        </LinkButton>
      </div>
    );
  }

  // 4) Main render
  const isOwner = Boolean(token && currentUser?.id === post.owner_id);

  return (
    <>
      <div className="flex gap-8">
        {/* Main content column */}
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
