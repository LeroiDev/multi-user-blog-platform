export default function Footer() {
  return (
    <footer className="w-full bg-neutral-800 text-neutral-500 text-sm py-4 mt-12">
      <div className="container text-center">
        © {new Date().getFullYear()} Blog • All rights reserved
      </div>
    </footer>
  );
}
