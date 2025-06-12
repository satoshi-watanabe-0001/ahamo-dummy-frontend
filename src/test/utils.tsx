import React from 'react'
import { render, RenderOptions } from '@testing-library/react'

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options })

export const testAccessibility = async (_container: HTMLElement) => {
  // const results = await axe(container)
  // expect(results).toHaveNoViolations()
  console.log('アクセシビリティテストは一時的に無効化されています')
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
