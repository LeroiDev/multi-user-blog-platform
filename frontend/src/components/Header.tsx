import { useLocation } from "react-router-dom";
import { LinkButton } from "./CustomButton";

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="w-full bg-neutral-800 text-neutral-100 shadow-md">
      <nav className="container flex items-center justify-between py-4">
        {/* Logo / Brand */}
        <LinkButton
          to="/"
          variant="primary"
          className="font-heading text-xl px-4 py-2"
        >
          Blog
        </LinkButton>

        {/* Navigation Links */}
        <div className="flex space-x-4">
          <LinkButton
            to="/"
            variant={pathname === "/" ? "primary" : "secondary"}
            className="px-3 py-1 font-medium text-sm"
          >
            Home
          </LinkButton>
          <LinkButton
            to="/posts"
            variant={pathname.startsWith("/posts") ? "primary" : "secondary"}
            className="px-3 py-1 font-medium text-sm"
          >
            Posts
          </LinkButton>
          <LinkButton
            to="/login"
            variant={pathname === "/login" ? "primary" : "secondary"}
            className="px-3 py-1 font-medium text-sm"
          >
            Login
          </LinkButton>
          <LinkButton
            to="/register"
            variant={pathname === "/register" ? "primary" : "secondary"}
            className="px-3 py-1 font-medium text-sm"
          >
            Register
          </LinkButton>
        </div>
      </nav>
    </header>
);
}
