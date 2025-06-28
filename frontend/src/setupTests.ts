import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './__mocks__/server'
import '@testing-library/jest-dom'

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
