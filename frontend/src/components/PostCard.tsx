import { Link } from "react-router-dom";

interface PostCardProps {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
}

export default function PostCard({
  id,
  title,
  excerpt,
  author,
  date,
}: PostCardProps) {
  return (
    <Link
      to={`/posts/${id}`}
      className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 text-neutral-900"
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-neutral-700 mb-4 line-clamp-2">{excerpt}</p>
      <div className="text-xs text-neutral-500">
        {author} • {new Date(date).toLocaleDateString()}
      </div>
    </Link>
  );
}
