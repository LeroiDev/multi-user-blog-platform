// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

interface UserRegistration {
  email: string;
  password: string;
}

interface TokenResponse {
  access_token: string;
  token_type: 'bearer';
}

interface Post {
  id: number;
  title: string;
  content: string;
  publication_date: string;
  author_email: string;
}

export const handlers = [
  // 1. Mock user registration
  http.post('http://localhost:8000/users/', async ({ request }) => {
    const data = (await request.json()) as UserRegistration;
    return HttpResponse.json(
      { id: 1, email: data.email },
      { status: 201 }
    );
  }),

  // 2. Mock login
  http.post('http://localhost:8000/token', async ({ request }) => {
    const form = await request.formData();
    const password = form.get('password') as string;

    if (password !== 'password') {
      return HttpResponse.json(
        { detail: 'Incorrect username or password' },
        { status: 401 }
      );
    }

    const body: TokenResponse = {
      access_token: 'fake-jwt',
      token_type: 'bearer',
    };
    return HttpResponse.json(body, { status: 200 });
  }),

  // 3a. Preflight OPTIONS for /posts (CORS)
  http.options('http://localhost:8000/posts', () => {
    return new HttpResponse(null, { status: 200 });
  }),

  // 3b. Mock fetching all posts (both /posts and /posts/)
  http.get('http://localhost:8000/posts', () => {
    const fakePosts: Post[] = [
      {
        id: 1,
        title: 'Test',
        content: 'This is a mocked post.',
        publication_date: new Date().toISOString(),
        author_email: 'a@b.com',
      },
    ];
    return HttpResponse.json(fakePosts, { status: 200 });
  }),
  http.get('http://localhost:8000/posts/', () => {
    const fakePosts: Post[] = [
      {
        id: 1,
        title: 'Test',
        content: 'This is a mocked post.',
        publication_date: new Date().toISOString(),
        author_email: 'a@b.com',
      },
    ];
    return HttpResponse.json(fakePosts, { status: 200 });
  }),
];
