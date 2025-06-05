# Badge - バッジコンポーネント

ステータスや情報を表示するための小さなラベルコンポーネントです。

## 📋 概要

- **ファイルパス**: `src/components/ui/badge.tsx`
- **エクスポート**: `src/components/atoms/index.ts`
- **ベース**: class-variance-authority

## 🎨 バリアント

### variant（外観）

| バリアント | 説明 | 背景色 | 使用場面 |
|-----------|------|--------|----------|
| `default` | 標準バッジ（黒背景） | 黒 | 一般的な情報表示 |
| `secondary` | セカンダリバッジ（グレー背景） | グレー | 補助的な情報 |
| `destructive` | 危険・エラーバッジ（赤背景） | 赤 | エラー、警告 |
| `outline` | 枠線バッジ | 透明 | 軽微な情報 |

## 🔧 プロパティ

```typescript
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}
```

### 主要プロパティ

- **variant**: バッジの外観スタイル
- **className**: 追加のCSSクラス
- **children**: バッジ内に表示するコンテンツ

## 💡 使用例

### 基本的な使用方法

```typescript
import { Badge } from '@/components/atoms';

function BasicBadges() {
  return (
    <div className="space-x-2">
      <Badge variant="default">人気</Badge>
      <Badge variant="secondary">新着</Badge>
      <Badge variant="destructive">売り切れ</Badge>
      <Badge variant="outline">限定</Badge>
    </div>
  );
}
```

### ステータス表示

```typescript
function StatusBadges() {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <span>注文状況:</span>
        <Badge variant="default">処理中</Badge>
      </div>
      
      <div className="flex items-center space-x-2">
        <span>配送状況:</span>
        <Badge variant="secondary">準備中</Badge>
      </div>
      
      <div className="flex items-center space-x-2">
        <span>在庫状況:</span>
        <Badge variant="destructive">在庫切れ</Badge>
      </div>
    </div>
  );
}
```

### 数値バッジ

```typescript
function CountBadges() {
  return (
    <div className="space-x-4">
      <div className="relative inline-block">
        <button className="p-2">
          通知
        </button>
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          3
        </Badge>
      </div>
      
      <div className="relative inline-block">
        <button className="p-2">
          メッセージ
        </button>
        <Badge 
          variant="default" 
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          12
        </Badge>
      </div>
    </div>
  );
}
```

### プラン表示での使用

```typescript
function PlanBadges() {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">ahamoベーシック</h3>
          <Badge variant="default">人気</Badge>
        </div>
        <p className="text-gray-600">20GB + 5分かけ放題</p>
        <p className="text-2xl font-bold">¥2,970/月</p>
      </div>
      
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">ahamo大盛り</h3>
          <Badge variant="secondary">大容量</Badge>
        </div>
        <p className="text-gray-600">100GB + 5分かけ放題</p>
        <p className="text-2xl font-bold">¥4,950/月</p>
      </div>
    </div>
  );
}
```

## 🎨 スタイルカスタマイズ

### カスタムサイズ

```typescript
// 小さなバッジ
<Badge className="text-xs px-1.5 py-0.5">
  小
</Badge>

// 大きなバッジ
<Badge className="text-sm px-3 py-1">
  大
</Badge>

// 円形バッジ
<Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
  1
</Badge>
```

### カスタムカラー

```typescript
// 成功バッジ
<Badge className="bg-green-500 text-white hover:bg-green-600">
  成功
</Badge>

// 警告バッジ
<Badge className="bg-yellow-500 text-black hover:bg-yellow-600">
  警告
</Badge>

// 情報バッジ
<Badge className="bg-blue-500 text-white hover:bg-blue-600">
  情報
</Badge>
```

## 📱 レスポンシブ対応

### モバイル最適化

```typescript
function ResponsiveBadges() {
  return (
    <div className="space-x-2">
      <Badge 
        variant="default"
        className="mobile:text-xs mobile:px-1.5 tablet:text-sm desktop:text-sm"
      >
        レスポンシブバッジ
      </Badge>
    </div>
  );
}
```

## ♿ アクセシビリティ

### スクリーンリーダー対応

```typescript
function AccessibleBadges() {
  return (
    <div className="space-x-2">
      {/* 装飾的なバッジ */}
      <Badge variant="default" aria-hidden="true">
        人気
      </Badge>
      
      {/* 重要な情報を含むバッジ */}
      <Badge 
        variant="destructive"
        role="status"
        aria-label="在庫切れ"
      >
        売り切れ
      </Badge>
      
      {/* 数値バッジ */}
      <Badge 
        variant="default"
        aria-label="3件の新しい通知"
      >
        3
      </Badge>
    </div>
  );
}
```

## 🧪 テスト例

```typescript
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/atoms';

describe('Badge', () => {
  test('テキストが正しく表示される', () => {
    render(<Badge>テストバッジ</Badge>);
    expect(screen.getByText('テストバッジ')).toBeInTheDocument();
  });
  
  test('適切なバリアントクラスが適用される', () => {
    render(<Badge variant="destructive">エラー</Badge>);
    const badge = screen.getByText('エラー');
    expect(badge).toHaveClass('bg-red-500');
  });
  
  test('カスタムクラスが適用される', () => {
    render(
      <Badge className="custom-class">カスタム</Badge>
    );
    const badge = screen.getByText('カスタム');
    expect(badge).toHaveClass('custom-class');
  });
});
```

## 🎯 ベストプラクティス

### 適切なバリアント選択

```typescript
// 良い例
<Badge variant="destructive">エラー</Badge>     // 危険・エラー状態
<Badge variant="secondary">下書き</Badge>       // 中性的な状態
<Badge variant="default">アクティブ</Badge>     // 重要な状態

// 避けるべき例
<Badge variant="destructive">成功</Badge>       // 成功なのに危険色
```

### 適切なコンテンツ

```typescript
// 良い例：簡潔で分かりやすい
<Badge>人気</Badge>
<Badge>新着</Badge>
<Badge>限定</Badge>

// 避けるべき例：長すぎる
<Badge>とても人気のある商品です</Badge>
```

### アクセシビリティの確保

```typescript
// 装飾的なバッジ
<Badge aria-hidden="true">人気</Badge>

// 重要な情報
<Badge role="status" aria-label="処理中">
  処理中
</Badge>

// 数値情報
<Badge aria-label="5件の未読メッセージ">
  5
</Badge>
```

## 🔗 関連コンポーネント

- [Button](./button.md) - アクション実行用
- [Chip](../molecules/chip.md) - 削除可能なタグ
- [Status](../molecules/status.md) - より詳細なステータス表示
