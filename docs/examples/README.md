# 使用例とベストプラクティス

UIコンポーネントライブラリの実践的な使用方法とベストプラクティスガイドです。

## 📚 ガイド一覧

### [基本的な使用方法](./basic-usage.md)
- コンポーネントのインポート方法
- 基本的な使用パターン
- プロパティの設定方法

### [コンポーネント組み合わせパターン](./composition-patterns.md)
- Atomsの組み合わせ方
- Moleculesの活用方法
- Organismsの実装パターン

### [レスポンシブデザイン](./responsive-design.md)
- ブレークポイントの活用
- モバイルファーストアプローチ
- デバイス別最適化

### [アクセシビリティガイドライン](./accessibility.md)
- WCAG 2.1 AA準拠
- キーボードナビゲーション
- スクリーンリーダー対応

## 🎯 実践例

### ahamoプラン選択画面

```typescript
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/molecules';
import { Button, Badge } from '@/components/atoms';

function PlanSelection() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        プランを選択してください
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="relative">
          <Badge 
            variant="default" 
            className="absolute -top-2 left-4 z-10"
          >
            人気
          </Badge>
          <CardHeader>
            <CardTitle>ahamoベーシック</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>データ容量</span>
                <span className="font-semibold">20GB</span>
              </div>
              <div className="flex justify-between">
                <span>通話</span>
                <span className="font-semibold">5分かけ放題</span>
              </div>
              <div className="flex justify-between">
                <span>海外ローミング</span>
                <span className="font-semibold">20GBまで無料</span>
              </div>
              <div className="border-t pt-3">
                <div className="text-center">
                  <span className="text-3xl font-bold">¥2,970</span>
                  <span className="text-gray-600">/月</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="primary" className="w-full">
              このプランを選択
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>ahamo大盛り</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>データ容量</span>
                <span className="font-semibold">100GB</span>
              </div>
              <div className="flex justify-between">
                <span>通話</span>
                <span className="font-semibold">5分かけ放題</span>
              </div>
              <div className="flex justify-between">
                <span>海外ローミング</span>
                <span className="font-semibold">20GBまで無料</span>
              </div>
              <div className="border-t pt-3">
                <div className="text-center">
                  <span className="text-3xl font-bold">¥4,950</span>
                  <span className="text-gray-600">/月</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              このプランを選択
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
```

### 申し込みフォーム

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/molecules';
import { Button, Input, Label } from '@/components/atoms';
import { useState } from 'react';

function ApplicationForm() {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: ''
  });
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>お申し込み情報入力</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lastName">姓</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    lastName: e.target.value
                  }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="firstName">名</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    firstName: e.target.value
                  }))}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">電話番号</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  phone: e.target.value
                }))}
                required
              />
            </div>
            
            <div className="flex space-x-4">
              <Button variant="outline" className="flex-1">
                戻る
              </Button>
              <Button variant="primary" className="flex-1">
                次へ
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

## 🎨 デザインパターン

### カラーの使い方

```typescript
// プライマリアクション
<Button variant="primary">申し込み</Button>

// セカンダリアクション
<Button variant="secondary">詳細を見る</Button>

// 危険なアクション
<Button variant="destructive">削除</Button>

// ステータス表示
<Badge variant="default">処理中</Badge>
<Badge variant="secondary">下書き</Badge>
<Badge variant="destructive">エラー</Badge>
```

### スペーシングの使い方

```typescript
// セクション間の間隔
<div className="space-y-8">
  <section>セクション1</section>
  <section>セクション2</section>
</div>

// 要素間の間隔
<div className="space-y-4">
  <div>要素1</div>
  <div>要素2</div>
</div>

// ボタン間の間隔
<div className="space-x-2">
  <Button>ボタン1</Button>
  <Button>ボタン2</Button>
</div>
```

## 📱 レスポンシブパターン

### グリッドレイアウト

```typescript
// カードグリッド
<div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6">
  <Card>カード1</Card>
  <Card>カード2</Card>
  <Card>カード3</Card>
</div>

// フォームレイアウト
<div className="grid grid-cols-1 desktop:grid-cols-2 gap-4">
  <Input placeholder="姓" />
  <Input placeholder="名" />
</div>
```

### モバイル最適化

```typescript
// モバイルでフルワイド、デスクトップで制限
<Button className="mobile:w-full desktop:w-auto">
  レスポンシブボタン
</Button>

// モバイルで縦並び、デスクトップで横並び
<div className="mobile:space-y-2 desktop:flex desktop:space-x-2 desktop:space-y-0">
  <Button>ボタン1</Button>
  <Button>ボタン2</Button>
</div>
```

## ♿ アクセシビリティパターン

### フォームのアクセシビリティ

```typescript
<div>
  <Label htmlFor="email">メールアドレス</Label>
  <Input
    id="email"
    type="email"
    aria-describedby="email-help"
    aria-required="true"
  />
  <p id="email-help" className="text-sm text-gray-600">
    ログインに使用するメールアドレスを入力してください
  </p>
</div>
```

### ボタンのアクセシビリティ

```typescript
// アイコンボタン
<Button variant="outline" size="icon" aria-label="メニューを開く">
  <MenuIcon className="h-4 w-4" />
</Button>

// 状態を伝えるボタン
<Button 
  aria-busy={loading}
  disabled={loading}
>
  {loading ? '送信中...' : '送信'}
</Button>
```

## 🧪 テストパターン

### コンポーネントテスト

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

test('プラン選択が正常に動作する', () => {
  render(<PlanSelection />);
  
  const basicPlanButton = screen.getByText('このプランを選択');
  fireEvent.click(basicPlanButton);
  
  expect(mockOnPlanSelect).toHaveBeenCalledWith('basic');
});
```

## 📚 関連ドキュメント

- [デザイントークン](../design-tokens/) - 色・スペーシング・タイポグラフィ
- [コンポーネント](../components/) - 個別コンポーネントの詳細
- [アクセシビリティガイド](./accessibility.md) - アクセシビリティ対応
