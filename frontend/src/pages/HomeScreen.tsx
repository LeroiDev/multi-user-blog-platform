import { Link } from "react-router-dom";

export default function HomeScreen() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Blog</h1>
      <p className="mb-8 text-lg text-gray-400">
        A simple multi-user blog platform. Sign up, log in, and start writing!
      </p>
      <div className="space-x-4">
        <Link
          to="/posts"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          View Posts
        </Link>
        <Link to="/posts/new" className="bg-green-600 …">
          New Post
        </Link>
        <Link
          to="/login"
          className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
