import { render, screen } from '../../test/utils'
import { testAccessibility } from '../../test/utils'
import { Badge } from './badge'
import { describe, it, expect } from 'vitest'

describe('Badge', () => {
  it('デフォルトバッジが正しくレンダリングされる', () => {
    render(<Badge>テストバッジ</Badge>)
    const badge = screen.getByText('テストバッジ')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-blue-600', 'text-white')
  })

  it('各バリアントが正しいスタイルを適用する', () => {
    const { rerender } = render(<Badge variant="default">デフォルト</Badge>)
    expect(screen.getByText('デフォルト')).toHaveClass('bg-blue-600', 'text-white')

    rerender(<Badge variant="secondary">セカンダリ</Badge>)
    expect(screen.getByText('セカンダリ')).toHaveClass('bg-gray-200', 'text-gray-900')

    rerender(<Badge variant="destructive">削除</Badge>)
    expect(screen.getByText('削除')).toHaveClass('bg-red-600', 'text-white')

    rerender(<Badge variant="outline">アウトライン</Badge>)
    expect(screen.getByText('アウトライン')).toHaveClass('text-gray-900', 'border-gray-300')
  })

  it('カスタムクラス名が適用される', () => {
    render(<Badge className="custom-class">カスタム</Badge>)
    const badge = screen.getByText('カスタム')
    expect(badge).toHaveClass('custom-class')
  })

  it('基本的なスタイルクラスが適用される', () => {
    render(<Badge>スタイルテスト</Badge>)
    const badge = screen.getByText('スタイルテスト')
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'rounded-full',
      'border',
      'px-2.5',
      'py-0.5',
      'text-xs',
      'font-semibold',
      'transition-colors'
    )
  })

  it('フォーカス管理のスタイルが適用される', () => {
    render(<Badge>フォーカステスト</Badge>)
    const badge = screen.getByText('フォーカステスト')
    expect(badge).toHaveClass(
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-ring',
      'focus:ring-offset-2'
    )
  })

  it('HTMLプロパティが正しく渡される', () => {
    render(<Badge data-testid="test-badge" title="テストタイトル">プロパティテスト</Badge>)
    const badge = screen.getByTestId('test-badge')
    expect(badge).toHaveAttribute('title', 'テストタイトル')
  })

  it('アクセシビリティ要件を満たす', async () => {
    const { container } = render(<Badge>アクセシビリティテスト</Badge>)
    await testAccessibility(container)
  })
})
