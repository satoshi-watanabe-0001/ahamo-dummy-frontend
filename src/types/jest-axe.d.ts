declare module 'jest-axe' {
  export function axe(container: Element | Document): Promise<any>
  export function toHaveNoViolations(): any
}

declare global {
  namespace Vi {
    interface Assertion<T = any> {
      toHaveNoViolations(): T
    }
  }
}

declare module 'vitest' {
  interface Assertion<T = any> {
    toHaveNoViolations(): T
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): any
  }
}
