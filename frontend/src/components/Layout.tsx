import { useLocation, Outlet } from "react-router-dom";
import { LinkButton } from "./CustomButton";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/posts", label: "Posts" },
  { to: "/login", label: "Login" },
  { to: "/register", label: "Register" },
];

export default function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 text-neutral-900">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-neutral-900 text-neutral-100 shadow">
        <div className="container flex justify-between items-center py-4">
          <LinkButton
            to="/"
            variant="primary"
            className="font-heading text-2xl px-4 py-2"
          >
            Lightning Blog
          </LinkButton>
          <nav className="flex space-x-4">
            {navItems.map((item) => (
              <LinkButton
                key={item.to}
                to={item.to}
                variant={pathname === item.to ? "primary" : "secondary"}
                className="py-1 px-3 text-sm"
              >
                {item.label}
              </LinkButton>
            ))}
          </nav>
        </div>
      </header>

      {/* This Outlet is where nested routes will render */}
      <main className="flex-grow container py-12">
        <Outlet />
      </main>

      <footer className="bg-neutral-900 text-neutral-500 text-center py-4">
        © {new Date().getFullYear()} Lightning Blog • All rights reserved
      </footer>
    </div>
  );
}
