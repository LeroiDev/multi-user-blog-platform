import PageShell from "../components/PageShell";
import { LinkButton } from "../components/CustomButton";

export default function HomeScreen() {
  return (
    <PageShell>
      <div className="bg-gray-800 p-12 rounded-2xl shadow-lg">
        <h1 className="text-5xl font-extrabold mb-4 text-white">
          Welcome to the Blog
        </h1>
        <p className="mb-8 text-lg text-gray-300">
          A simple multi-user blog platform. Sign up, log in, and start writing!
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <LinkButton to="/posts" variant="primary">
            View Posts
          </LinkButton>
          <LinkButton to="/posts/new" variant="secondary">
            New Post
          </LinkButton>
          <LinkButton to="/login" variant="primary">
            Login
          </LinkButton>
          <LinkButton to="/register" variant="secondary">
            Register
          </LinkButton>
        </div>
      </div>
    </PageShell>
  );
}
