import { Link } from "react-router-dom";

export interface PostCardProps {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  thumbnailUrl?: string;
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
      className="block bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h2 className="font-heading text-2xl text-neutral-900 mb-2">{title}</h2>
        <p className="text-neutral-700 mb-4 line-clamp-3">{excerpt}</p>
        <div className="flex items-center text-sm text-neutral-500">
          <span>{author}</span>
          <span className="mx-2">•</span>
          <time>{new Date(date).toLocaleDateString()}</time>
        </div>
      </div>
    </Link>
  );
}
