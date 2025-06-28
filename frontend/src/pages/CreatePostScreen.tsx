import { useState, type FC, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
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

const CreatePostScreen: FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

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
        // AxiosError has .response?.data
        const detail = (err.response?.data as { detail?: string })?.detail;
        message = detail ?? message;
      }
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block mb-1 font-medium">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            rows={8}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create Post"}
        </button>
      </form>
    </main>
  );
};

export default CreatePostScreen;
