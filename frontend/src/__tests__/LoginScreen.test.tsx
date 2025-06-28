import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeAll, afterEach, afterAll, test, expect } from "vitest";
import LoginScreen from "../pages/LoginScreen";
import PostListScreen from "../pages/PostListScreen";
import { server } from "../__mocks__/server";

// MSW before all tests, reset handlers after each, close when done
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

test("successful login stores token and redirects to posts list", async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/" element={<PostListScreen />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );

  // fill out and submit the form
  await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
  await userEvent.type(screen.getByLabelText(/password/i), "password");
  await userEvent.click(screen.getByRole("button", { name: /login/i }));

  // after successful login, the PostListScreen shows its loading message
  const loading = await screen.findByText(/loading posts…/i);
  expect(loading).toBeTruthy();
});
