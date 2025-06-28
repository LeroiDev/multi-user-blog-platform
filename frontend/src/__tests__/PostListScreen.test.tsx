import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import PostListScreen from '../pages/PostListScreen'
import { vi, test, expect } from 'vitest'

// Mock the *exact* import path your component uses:
vi.mock('../api/client', () => {
  return {
    api: {
      get: vi.fn().mockResolvedValue({
        data: [
          {
            id: 1,
            title: 'Test',
            content: 'This is a mocked post.',
            publication_date: new Date().toISOString(),
            author_email: 'a@b.com',
          },
        ],
      }),
    },
  }
})

const qc = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

test('renders list of posts', async () => {
  render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <PostListScreen />
      </MemoryRouter>
    </QueryClientProvider>
  )

  // wait for the mocked data to appear
  expect(await screen.findByText('Test')).toBeInTheDocument()

  // because the email is rendered inside a larger string with whitespace,
  // match via a regex
  expect(screen.getByText(/a@b\.com/)).toBeInTheDocument()
})
