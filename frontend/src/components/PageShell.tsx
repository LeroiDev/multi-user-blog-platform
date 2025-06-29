import { type PropsWithChildren } from "react";
import { Link, useLocation } from "react-router-dom";

export default function PageShell({ children }: PropsWithChildren) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-white text-gray-800 shadow">
        <nav className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Blog
          </Link>
          <div className="space-x-4">
            <Link
              to="/"
              className={`hover:text-blue-600 ${
                pathname === "/" ? "text-blue-600 font-semibold" : ""
              }`}
            >
              Home
            </Link>
            <Link
              to="/login"
              className={`hover:text-blue-600 ${
                pathname === "/login" ? "text-blue-600 font-semibold" : ""
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`hover:text-blue-600 ${
                pathname === "/register" ? "text-blue-600 font-semibold" : ""
              }`}
            >
              Register
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">{children}</main>
    </div>
  );
}
