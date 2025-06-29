import { useLocation, Outlet } from "react-router-dom";
import { LinkButton } from "./CustomButton";
import BackgroundVideo from "./BackgroundVideo";
import { AnimatePresence, motion } from "framer-motion";

import lightningPoster from "../assets/images/lightning_blog.jpg";
import loginVidMp4 from "../assets/videos/loginVid.mp4";
import postsVidMp4 from "../assets/videos/postsVid.mp4";
import detailVidMp4 from "../assets/videos/detailVid.mp4";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/posts", label: "Posts" },
  { to: "/login", label: "Login" },
  { to: "/register", label: "Register" },
];

export default function Layout() {
  const { pathname } = useLocation();

  // Map each route to its clip:
  let videoMp4: string;
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    videoMp4 = loginVidMp4;
  } else if (pathname === "/posts") {
    videoMp4 = postsVidMp4;
  } else if (pathname.match(/^\/posts\/\d+$/) && !pathname.endsWith("/edit")) {
    videoMp4 = detailVidMp4;
  } else {
    // fallback or for /posts/:id/edit
    videoMp4 = loginVidMp4;
  }

  console.log("Current path:", pathname, "→ playing:", videoMp4);

  return (
    <BackgroundVideo srcMp4={videoMp4} poster={lightningPoster}>
      <div className="min-h-screen flex flex-col bg-transparent text-neutral-100">
        {/* HEADER */}
        <header className="sticky top-0 z-20 bg-transparent">
          <div className="container flex justify-between items-center py-4">
            <LinkButton
              to="/"
              variant="primary"
              className="text-2xl font-heading"
            >
              Lightning Blog
            </LinkButton>
            <nav className="flex space-x-4">
              {navItems.map((item) => (
                <LinkButton
                  key={item.to}
                  to={item.to}
                  variant={pathname === item.to ? "primary" : "secondary"}
                >
                  {item.label}
                </LinkButton>
              ))}
            </nav>
          </div>
        </header>
        {/* MAIN CONTENT */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            className="flex-grow container py-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
        {/* FOOTER */}
        <footer className="bg-transparent text-center text-sm py-4">
          © {new Date().getFullYear()} Lightning Blog • All rights reserved
        </footer>
      </div>
    </BackgroundVideo>
  );
}
