import { render, screen, fireEvent } from '../../test/utils'
import { testAccessibility } from '../../test/utils'
import { Button } from './button'

describe('Button', () => {
  it('デフォルトボタンが正しくレンダリングされる', () => {
    render(<Button>テストボタン</Button>)
    const button = screen.getByRole('button', { name: 'テストボタン' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-blue-600', 'text-white')
  })

  it('各バリアントが正しいスタイルを適用する', () => {
    const { rerender } = render(<Button variant="destructive">削除</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-red-600')

    rerender(<Button variant="outline">アウトライン</Button>)
    expect(screen.getByRole('button')).toHaveClass('border', 'border-gray-300')

    rerender(<Button variant="secondary">セカンダリ</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-gray-200')

    rerender(<Button variant="ghost">ゴースト</Button>)
    expect(screen.getByRole('button')).toHaveClass('hover:bg-gray-100')

    rerender(<Button variant="link">リンク</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-blue-600', 'underline-offset-4')
  })

  it('各サイズが正しく適用される', () => {
    const { rerender } = render(<Button size="sm">小</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-9')

    rerender(<Button size="lg">大</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-11')

    rerender(<Button size="icon">アイコン</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-10', 'w-10')
  })

  it('ローディング状態が正しく表示される', () => {
    render(<Button loading>読み込み中</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByText('読み込み中...')).toBeInTheDocument()
  })

  it('クリックイベントが正しく動作する', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>クリック</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('無効状態でクリックできない', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>無効</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('アクセシビリティ属性が正しく設定される', () => {
    render(
      <Button 
        aria-label="テストボタン" 
        aria-describedby="help-text"
        aria-expanded={true}
        aria-pressed={false}
      >
        ボタン
      </Button>
    )
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'テストボタン')
    expect(button).toHaveAttribute('aria-describedby', 'help-text')
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(button).toHaveAttribute('aria-pressed', 'false')
  })

  it('アクセシビリティ要件を満たす', async () => {
    const { container } = render(
      <Button aria-label="テストボタン">
        ボタン
      </Button>
    )
    await testAccessibility(container)
  })
})
