import { render, screen, fireEvent } from '../../test/utils'
import { testAccessibility } from '../../test/utils'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card'
import { describe, it, expect, vi } from 'vitest'

describe('Card Components', () => {
  describe('Card', () => {
    it('基本的なカードがレンダリングされる', () => {
      render(<Card>テストカード</Card>)
      const card = screen.getByText('テストカード')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('rounded-lg', 'border', 'border-gray-200', 'bg-white', 'shadow-sm')
    })

    it('カスタムクラス名が適用される', () => {
      render(<Card className="custom-card">カスタムカード</Card>)
      const card = screen.getByText('カスタムカード')
      expect(card).toHaveClass('custom-card')
    })

    it('クリックイベントが動作する', () => {
      const handleClick = vi.fn()
      render(<Card onClick={handleClick}>クリック可能カード</Card>)
      const card = screen.getByText('クリック可能カード')
      fireEvent.click(card)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('HTMLプロパティが正しく渡される', () => {
      render(<Card data-testid="test-card">プロパティテスト</Card>)
      const card = screen.getByTestId('test-card')
      expect(card).toBeInTheDocument()
    })
  })

  describe('CardHeader', () => {
    it('カードヘッダーがレンダリングされる', () => {
      render(<CardHeader>ヘッダーテスト</CardHeader>)
      const header = screen.getByText('ヘッダーテスト')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
    })

    it('カスタムクラス名が適用される', () => {
      render(<CardHeader className="custom-header">カスタムヘッダー</CardHeader>)
      const header = screen.getByText('カスタムヘッダー')
      expect(header).toHaveClass('custom-header')
    })
  })

  describe('CardTitle', () => {
    it('カードタイトルがレンダリングされる', () => {
      render(<CardTitle>タイトルテスト</CardTitle>)
      const title = screen.getByText('タイトルテスト')
      expect(title).toBeInTheDocument()
      expect(title.tagName).toBe('H3')
      expect(title).toHaveClass('text-2xl', 'font-semibold', 'leading-none', 'tracking-tight')
    })

    it('カスタムクラス名が適用される', () => {
      render(<CardTitle className="custom-title">カスタムタイトル</CardTitle>)
      const title = screen.getByText('カスタムタイトル')
      expect(title).toHaveClass('custom-title')
    })
  })

  describe('CardDescription', () => {
    it('カード説明がレンダリングされる', () => {
      render(<CardDescription>説明テスト</CardDescription>)
      const description = screen.getByText('説明テスト')
      expect(description).toBeInTheDocument()
      expect(description.tagName).toBe('P')
      expect(description).toHaveClass('text-sm', 'text-gray-600')
    })

    it('カスタムクラス名が適用される', () => {
      render(<CardDescription className="custom-description">カスタム説明</CardDescription>)
      const description = screen.getByText('カスタム説明')
      expect(description).toHaveClass('custom-description')
    })
  })

  describe('CardContent', () => {
    it('カードコンテンツがレンダリングされる', () => {
      render(<CardContent>コンテンツテスト</CardContent>)
      const content = screen.getByText('コンテンツテスト')
      expect(content).toBeInTheDocument()
      expect(content).toHaveClass('p-6', 'pt-0')
    })

    it('カスタムクラス名が適用される', () => {
      render(<CardContent className="custom-content">カスタムコンテンツ</CardContent>)
      const content = screen.getByText('カスタムコンテンツ')
      expect(content).toHaveClass('custom-content')
    })
  })

  describe('CardFooter', () => {
    it('カードフッターがレンダリングされる', () => {
      render(<CardFooter>フッターテスト</CardFooter>)
      const footer = screen.getByText('フッターテスト')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
    })

    it('カスタムクラス名が適用される', () => {
      render(<CardFooter className="custom-footer">カスタムフッター</CardFooter>)
      const footer = screen.getByText('カスタムフッター')
      expect(footer).toHaveClass('custom-footer')
    })
  })

  describe('Card Complete Structure', () => {
    it('完全なカード構造がレンダリングされる', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>完全なカードタイトル</CardTitle>
            <CardDescription>完全なカード説明</CardDescription>
          </CardHeader>
          <CardContent>
            完全なカードコンテンツ
          </CardContent>
          <CardFooter>
            完全なカードフッター
          </CardFooter>
        </Card>
      )

      expect(screen.getByText('完全なカードタイトル')).toBeInTheDocument()
      expect(screen.getByText('完全なカード説明')).toBeInTheDocument()
      expect(screen.getByText('完全なカードコンテンツ')).toBeInTheDocument()
      expect(screen.getByText('完全なカードフッター')).toBeInTheDocument()
    })

    it('アクセシビリティ要件を満たす', async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>アクセシビリティテスト</CardTitle>
            <CardDescription>アクセシビリティテスト説明</CardDescription>
          </CardHeader>
          <CardContent>
            アクセシビリティテストコンテンツ
          </CardContent>
        </Card>
      )
      await testAccessibility(container)
    })
  })
})
