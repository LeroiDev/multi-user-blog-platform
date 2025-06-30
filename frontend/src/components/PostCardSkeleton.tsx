export default function PostCardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow p-6">
      <div className="h-6 bg-neutral-200 rounded w-3/4 mb-4" />
      <div className="h-4 bg-neutral-200 rounded w-full mb-2" />
      <div className="h-4 bg-neutral-200 rounded w-5/6 mb-2" />
      <div className="h-3 bg-neutral-200 rounded w-1/2 mt-4" />
    </div>
  );
}
