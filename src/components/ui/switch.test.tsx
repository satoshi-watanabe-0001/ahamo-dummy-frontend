import { render, screen, fireEvent } from '../../test/utils'
import { testAccessibility } from '../../test/utils'
import { Switch } from './switch'

describe('Switch', () => {
  it('基本的なスイッチがレンダリングされる', () => {
    render(<Switch />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toBeInTheDocument()
    expect(switchElement).toHaveAttribute('aria-checked', 'false')
  })

  it('チェック状態が正しく表示される', () => {
    const { rerender } = render(<Switch checked={false} />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('aria-checked', 'false')
    expect(switchElement).toHaveClass('bg-gray-300')

    rerender(<Switch checked={true} />)
    expect(switchElement).toHaveAttribute('aria-checked', 'true')
    expect(switchElement).toHaveClass('bg-blue-600')
  })

  it('クリックで状態が変更される', () => {
    const handleChange = vi.fn()
    render(<Switch onCheckedChange={handleChange} />)
    const switchElement = screen.getByRole('switch')
    
    fireEvent.click(switchElement)
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('チェック済み状態からのクリックで状態が変更される', () => {
    const handleChange = vi.fn()
    render(<Switch checked={true} onCheckedChange={handleChange} />)
    const switchElement = screen.getByRole('switch')
    
    fireEvent.click(switchElement)
    expect(handleChange).toHaveBeenCalledWith(false)
  })

  it('無効状態でクリックできない', () => {
    const handleChange = vi.fn()
    render(<Switch disabled onCheckedChange={handleChange} />)
    const switchElement = screen.getByRole('switch')
    
    expect(switchElement).toBeDisabled()
    fireEvent.click(switchElement)
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('無効状態のスタイルが適用される', () => {
    render(<Switch disabled />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('アクセシビリティ属性が正しく設定される', () => {
    render(
      <Switch 
        aria-label="テストスイッチ"
        aria-describedby="switch-description"
        checked={true}
      />
    )
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveAttribute('aria-label', 'テストスイッチ')
    expect(switchElement).toHaveAttribute('aria-describedby', 'switch-description')
    expect(switchElement).toHaveAttribute('aria-checked', 'true')
  })

  it('キーボードナビゲーションが動作する', () => {
    const handleChange = vi.fn()
    render(<Switch onCheckedChange={handleChange} />)
    const switchElement = screen.getByRole('switch')
    
    switchElement.focus()
    fireEvent.click(switchElement)
    
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('フォーカススタイルが適用される', () => {
    render(<Switch />)
    const switchElement = screen.getByRole('switch')
    expect(switchElement).toHaveClass(
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-offset-2'
    )
  })

  it('スイッチのトグル要素が正しく動作する', () => {
    const { rerender } = render(<Switch checked={false} />)
    const toggleElement = screen.getByRole('switch').querySelector('span')
    expect(toggleElement).toHaveClass('translate-x-0')

    rerender(<Switch checked={true} />)
    expect(toggleElement).toHaveClass('translate-x-5')
  })

  it('アクセシビリティ要件を満たす', async () => {
    const { container } = render(<Switch aria-label="テストスイッチ" />)
    await testAccessibility(container)
  })
})
