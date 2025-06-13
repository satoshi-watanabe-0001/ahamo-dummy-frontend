import React from 'react'
import { render, RenderOptions } from '@testing-library/react'

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options })

export const testAccessibility = async (container: HTMLElement) => {
  const { axe } = await import('jest-axe')
  const results = await axe(container)
  
  if (results.violations.length > 0) {
    const violationMessages = results.violations.map((violation: any) => {
      return `${violation.id}: ${violation.description}\n  - ${violation.nodes.map((node: any) => node.target).join('\n  - ')}`
    }).join('\n\n')
    
    throw new Error(`アクセシビリティ違反が検出されました:\n\n${violationMessages}`)
  }
  
  expect(results.violations).toHaveLength(0)
}

export const createMockPlan = (overrides = {}) => ({
  id: 'test-plan-1',
  name: 'テストプラン',
  description: 'テスト用のプラン説明',
  monthlyFee: 2970,
  dataCapacity: '20GB',
  voiceCalls: '5分以内無料',
  sms: '無料',
  features: ['テスト機能1', 'テスト機能2'],
  isActive: true,
  isPopular: false,
  ...overrides,
})

export * from '@testing-library/react'
export { customRender as render }
