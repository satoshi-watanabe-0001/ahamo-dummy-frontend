import { render, screen, fireEvent } from '../../test/utils'
import { testAccessibility, createMockPlan } from '../../test/utils'
import { PlanCard } from './PlanCard'

describe('PlanCard', () => {
  const mockPlan = createMockPlan()
  const mockOnSelect = vi.fn()

  beforeEach(() => {
    mockOnSelect.mockClear()
  })

  it('プラン情報が正しく表示される', () => {
    render(<PlanCard plan={mockPlan} isSelected={false} onSelect={mockOnSelect} />)
    
    expect(screen.getByText('テストプラン')).toBeInTheDocument()
    expect(screen.getByText('テスト用のプラン説明')).toBeInTheDocument()
    expect(screen.getByText('20GB')).toBeInTheDocument()
    expect(screen.getByText('5分以内無料')).toBeInTheDocument()
    expect(screen.getByText('無料')).toBeInTheDocument()
    expect(screen.getByText('¥2,970')).toBeInTheDocument()
  })

  it('人気プランバッジが表示される', () => {
    const popularPlan = createMockPlan({ isPopular: true })
    render(<PlanCard plan={popularPlan} isSelected={false} onSelect={mockOnSelect} />)
    expect(screen.getByText('おすすめ')).toBeInTheDocument()
  })

  it('人気プランでない場合バッジが表示されない', () => {
    render(<PlanCard plan={mockPlan} isSelected={false} onSelect={mockOnSelect} />)
    expect(screen.queryByText('おすすめ')).not.toBeInTheDocument()
  })

  it('選択状態が正しく表示される', () => {
    const { container } = render(<PlanCard plan={mockPlan} isSelected={true} onSelect={mockOnSelect} />)
    const card = container.querySelector('.border-blue-600')
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('ring-2', 'ring-blue-200')
  })

  it('非選択状態が正しく表示される', () => {
    const { container } = render(<PlanCard plan={mockPlan} isSelected={false} onSelect={mockOnSelect} />)
    const card = container.querySelector('.border-gray-200')
    expect(card).toBeInTheDocument()
    expect(card).not.toHaveClass('border-blue-600')
  })

  it('プラン選択ラジオボタンが正しく動作する', () => {
    render(<PlanCard plan={mockPlan} isSelected={false} onSelect={mockOnSelect} />)
    const radio = screen.getByRole('radio')
    expect(radio).not.toBeChecked()
    
    fireEvent.click(radio)
    expect(mockOnSelect).toHaveBeenCalledWith('test-plan-1')
  })

  it('選択済みプランのラジオボタンがチェック状態になる', () => {
    render(<PlanCard plan={mockPlan} isSelected={true} onSelect={mockOnSelect} />)
    const radio = screen.getByRole('radio')
    expect(radio).toBeChecked()
  })

  it('詳細表示の展開・折りたたみが動作する', () => {
    render(<PlanCard plan={mockPlan} isSelected={false} onSelect={mockOnSelect} />)
    
    expect(screen.queryByText('プラン詳細')).not.toBeInTheDocument()
    expect(screen.queryByText('テスト機能1')).not.toBeInTheDocument()
    
    const toggleButton = screen.getByText('詳細を見る')
    fireEvent.click(toggleButton)
    
    expect(screen.getByText('詳細を閉じる')).toBeInTheDocument()
    expect(screen.getByText('プラン詳細')).toBeInTheDocument()
    expect(screen.getByText('テスト機能1')).toBeInTheDocument()
    expect(screen.getByText('テスト機能2')).toBeInTheDocument()
    
    fireEvent.click(screen.getByText('詳細を閉じる'))
    expect(screen.getByText('詳細を見る')).toBeInTheDocument()
    expect(screen.queryByText('プラン詳細')).not.toBeInTheDocument()
  })

  it('プラン機能リストが正しく表示される', () => {
    render(<PlanCard plan={mockPlan} isSelected={false} onSelect={mockOnSelect} />)
    
    const toggleButton = screen.getByText('詳細を見る')
    fireEvent.click(toggleButton)
    
    const featureList = screen.getByRole('list')
    expect(featureList).toBeInTheDocument()
    
    const featureItems = screen.getAllByRole('listitem')
    expect(featureItems).toHaveLength(2)
    expect(featureItems[0]).toHaveTextContent('テスト機能1')
    expect(featureItems[1]).toHaveTextContent('テスト機能2')
  })

  it('料金が正しくフォーマットされて表示される', () => {
    const expensivePlan = createMockPlan({ monthlyFee: 12345 })
    render(<PlanCard plan={expensivePlan} isSelected={false} onSelect={mockOnSelect} />)
    expect(screen.getByText('¥12,345')).toBeInTheDocument()
  })

  it('プランの各項目ラベルが正しく表示される', () => {
    render(<PlanCard plan={mockPlan} isSelected={false} onSelect={mockOnSelect} />)
    
    expect(screen.getByText('データ容量')).toBeInTheDocument()
    expect(screen.getByText('通話')).toBeInTheDocument()
    expect(screen.getByText('SMS')).toBeInTheDocument()
    expect(screen.getByText('月額料金')).toBeInTheDocument()
  })

  it('プラン選択ラベルが表示される', () => {
    render(<PlanCard plan={mockPlan} isSelected={false} onSelect={mockOnSelect} />)
    expect(screen.getByText('このプランを選択')).toBeInTheDocument()
  })

  it('アクセシビリティ要件を満たす', async () => {
    const { container } = render(
      <PlanCard plan={mockPlan} isSelected={false} onSelect={mockOnSelect} />
    )
    await testAccessibility(container)
  })

  it('展開状態でもアクセシビリティ要件を満たす', async () => {
    const { container } = render(
      <PlanCard plan={mockPlan} isSelected={false} onSelect={mockOnSelect} />
    )
    
    const toggleButton = screen.getByText('詳細を見る')
    fireEvent.click(toggleButton)
    
    await testAccessibility(container)
  })
})
