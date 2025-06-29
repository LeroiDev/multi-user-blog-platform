import { type PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { LinkButton } from "./CustomButton";

const navItems: { to: string; label: string }[] = [
  { to: "/", label: "Home" },
  { to: "/login", label: "Login" },
  { to: "/register", label: "Register" },
];

export default function PageShell({ children }: PropsWithChildren) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* HEADER */}
      <header className="bg-gray-800 text-gray-100 shadow">
        <nav className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <LinkButton
            to="/"
            variant={pathname === "/" ? "primary" : "secondary"}
            className="text-2xl font-bold py-1 px-2"
          >
            Blog
          </LinkButton>

          <div className="flex space-x-4">
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
          </div>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow px-6 py-12 flex justify-center">
        {children}
      </main>

      {/* FOOTER (optional) */}
      <footer className="bg-gray-800 text-gray-500 text-xs text-center py-4">
        © {new Date().getFullYear()} Your Company
      </footer>
    </div>
  );
}
