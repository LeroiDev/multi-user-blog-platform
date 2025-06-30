import { LinkButton } from "../components/CustomButton";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-neutral-100 text-neutral-900 p-6">
      <h1 className="text-5xl font-heading font-extrabold mb-4">404</h1>
      <p className="text-xl mb-6">Sorry, that page doesn’t exist.</p>
      <LinkButton to="/" variant="secondary" className="px-6 py-3">
        Go Home
      </LinkButton>
    </div>
  );
}
