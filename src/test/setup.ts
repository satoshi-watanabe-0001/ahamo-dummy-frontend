import '@testing-library/jest-dom'
import { configure } from '@testing-library/react'
import { toHaveNoViolations } from 'jest-axe'

configure({ testIdAttribute: 'data-testid' })

expect.extend({ toHaveNoViolations })

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
})

Object.defineProperty(globalThis, 'CSS', {
  writable: true,
  value: {
    supports: vi.fn(() => false),
    escape: vi.fn((str: string) => str),
  },
})
