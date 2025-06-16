import { render, screen, fireEvent } from '../../test/utils'
import { testAccessibility } from '../../test/utils'
import { Input } from './input'

describe('Input', () => {
  it('基本的な入力フィールドがレンダリングされる', () => {
    render(<Input placeholder="テスト入力" />)
    const input = screen.getByPlaceholderText('テスト入力')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('border-gray-300', 'focus:ring-blue-500')
  })

  it('値の変更が正しく動作する', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'テスト値' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('異なる入力タイプが正しく設定される', () => {
    const { rerender } = render(<Input type="email" data-testid="email-input" />)
    expect(screen.getByTestId('email-input')).toHaveAttribute('type', 'email')

    rerender(<Input type="password" data-testid="password-input" />)
    expect(screen.getByTestId('password-input')).toHaveAttribute('type', 'password')

    rerender(<Input type="tel" data-testid="tel-input" />)
    expect(screen.getByTestId('tel-input')).toHaveAttribute('type', 'tel')
  })

  it('IMEモードが正しく設定される', () => {
    render(<Input imeMode="active" data-testid="ime-input" />)
    const input = screen.getByTestId('ime-input')
    expect(input).toBeInTheDocument()
  })

  it('inputModeが正しく設定される', () => {
    const { rerender } = render(<Input inputMode="numeric" data-testid="numeric-input" />)
    expect(screen.getByTestId('numeric-input')).toHaveAttribute('inputMode', 'numeric')

    rerender(<Input inputMode="email" data-testid="email-input" />)
    expect(screen.getByTestId('email-input')).toHaveAttribute('inputMode', 'email')

    rerender(<Input inputMode="tel" data-testid="tel-input" />)
    expect(screen.getByTestId('tel-input')).toHaveAttribute('inputMode', 'tel')
  })

  it('無効状態が正しく適用される', () => {
    render(<Input disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:opacity-50')
  })

  it('アクセシビリティ属性が正しく設定される', () => {
    render(
      <Input
        aria-label="テスト入力"
        aria-required
        aria-invalid
        aria-describedby="error-message"
      />
    )
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-label', 'テスト入力')
    expect(input).toHaveAttribute('aria-required', 'true')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby', 'error-message')
  })

  it('フォーカス管理が正しく動作する', () => {
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />)
    const input = screen.getByRole('textbox')
    
    fireEvent.focus(input)
    expect(handleFocus).toHaveBeenCalled()
    
    fireEvent.blur(input)
    expect(handleBlur).toHaveBeenCalled()
  })

  it('アクセシビリティ要件を満たす', async () => {
    const { container } = render(<Input aria-label="テスト入力" />)
    await testAccessibility(container)
  })
})
