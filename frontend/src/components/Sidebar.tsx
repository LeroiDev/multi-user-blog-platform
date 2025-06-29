import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

interface Post {
  id: number;
  title: string;
}

export default function Sidebar({ authorEmail }: { authorEmail: string }) {
  // Fetch latest 5 posts by this author
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["authorPosts", authorEmail],
    queryFn: () =>
      api
        .get(`/posts?author=${encodeURIComponent(authorEmail)}&limit=5`)
        .then((res) => res.data),
  });

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="font-heading text-lg mb-2">About the Author</h3>
        <p className="text-sm text-neutral-700">
          <strong>{authorEmail}</strong>
        </p>
        <p className="mt-2 text-sm text-neutral-600">
          This author has written {posts?.length ?? "..."} posts.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-heading text-lg mb-2">More by this Author</h3>
        {isLoading ? (
          <p className="text-sm text-neutral-500">Loading…</p>
        ) : posts?.length ? (
          <ul className="space-y-2">
            {posts.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/posts/${p.id}`}
                  className="text-primary hover:underline text-sm"
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-500">No other posts.</p>
        )}
      </div>
    </aside>
  );
}
