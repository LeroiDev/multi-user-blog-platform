import { Link } from "react-router-dom";

interface PostCardProps {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  thumbnailUrl?: string; // ← allow the optional prop
}

export default function PostCard({
  id,
  title,
  excerpt,
  author,
  date,
  thumbnailUrl,
}: PostCardProps) {
  return (
    <Link
      to={`/posts/${id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 \
       transition transform duration-200 ease-in-out p-6 text-neutral-900 no-underline"
    >
      {/* (Optional) if you want to show the thumbnail in future:*/}
      {thumbnailUrl && (
        <img src={thumbnailUrl} alt={title} className="mb-4 rounded" />
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-neutral-700 mb-4 line-clamp-2">{excerpt}</p>
      <div className="text-xs text-neutral-500">
        {author} • {new Date(date).toLocaleDateString()}
      </div>
    </Link>
  );
}
