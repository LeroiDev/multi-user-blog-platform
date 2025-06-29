import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../components/CustomFormField";
import { Button } from "../components/CustomButton";
import { api } from "../api/client";
import axios from "axios";

interface PostCreatePayload {
  title: string;
  content: string;
}

interface PostResponse {
  id: number;
  title: string;
  content: string;
  publication_date: string;
  author_email: string;
}

export default function CreatePostScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const payload: PostCreatePayload = { title, content };
    try {
      const response = await api.post<PostResponse>("/posts", payload);
      navigate(`/posts/${response.data.id}`);
    } catch (err: unknown) {
      let message = "Failed to create post";
      if (axios.isAxiosError(err)) {
        const detail = (err.response?.data as { detail?: string })?.detail;
        message = detail ?? message;
      }
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-heading mb-6 text-neutral-900">
        Create New Post
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Title" htmlFor="title">
          <input
            id="title"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            className="w-full p-2 border border-neutral-300 rounded"
            required
          />
        </FormField>
        <FormField label="Content" htmlFor="content">
          <textarea
            id="content"
            value={content}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setContent(e.target.value)
            }
            rows={8}
            className="w-full p-2 border border-neutral-300 rounded"
            required
          />
        </FormField>
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Creating…" : "Create Post"}
        </Button>
      </form>
    </div>
  );
}
