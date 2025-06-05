# Button - ボタンコンポーネント

ユーザーのアクションを実行するためのクリック可能なボタンコンポーネントです。

## 📋 概要

- **ファイルパス**: `src/components/ui/button.tsx`
- **エクスポート**: `src/components/atoms/index.ts`
- **ベース**: Radix UI Slot + class-variance-authority

## 🎨 バリアント

### variant（外観）

| バリアント | 説明 | 使用場面 |
|-----------|------|----------|
| `default` | 標準ボタン（黒背景） | 主要なアクション |
| `destructive` | 危険なアクション（赤背景） | 削除、キャンセル |
| `outline` | 枠線ボタン | 副次的なアクション |
| `secondary` | セカンダリボタン（グレー背景） | 補助的なアクション |
| `ghost` | 背景なしボタン | 軽微なアクション |
| `link` | リンクスタイル | ナビゲーション |

### size（サイズ）

| サイズ | 説明 | 高さ | パディング |
|--------|------|------|----------|
| `default` | 標準サイズ | 36px | 16px 水平 |
| `sm` | 小サイズ | 32px | 12px 水平 |
| `lg` | 大サイズ | 40px | 32px 水平 |
| `icon` | アイコン専用 | 36px × 36px | - |

## 🔧 プロパティ

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  className?: string;
}
```

### 主要プロパティ

- **variant**: ボタンの外観スタイル
- **size**: ボタンのサイズ
- **asChild**: 子要素をボタンとして扱う（Radix UI Slot機能）
- **className**: 追加のCSSクラス
- **disabled**: 無効状態
- **onClick**: クリックイベントハンドラー

## 💡 使用例

### 基本的な使用方法

```typescript
import { Button } from '@/components/atoms';

function BasicButtons() {
  return (
    <div className="space-x-2">
      {/* 標準ボタン */}
      <Button variant="default">
        申し込み
      </Button>
      
      {/* セカンダリボタン */}
      <Button variant="secondary">
        キャンセル
      </Button>
      
      {/* 危険なアクション */}
      <Button variant="destructive">
        削除
      </Button>
    </div>
  );
}
```

### サイズバリエーション

```typescript
function SizeVariations() {
  return (
    <div className="space-x-2">
      <Button size="sm">小ボタン</Button>
      <Button size="default">標準ボタン</Button>
      <Button size="lg">大ボタン</Button>
    </div>
  );
}
```

### アイコンボタン

```typescript
import { Search, Plus, X } from 'lucide-react';

function IconButtons() {
  return (
    <div className="space-x-2">
      {/* アイコンのみ */}
      <Button variant="outline" size="icon">
        <Search className="h-4 w-4" />
      </Button>
      
      {/* アイコン + テキスト */}
      <Button variant="default">
        <Plus className="h-4 w-4 mr-2" />
        追加
      </Button>
    </div>
  );
}
```

### 状態管理

```typescript
import { useState } from 'react';

function StatefulButton() {
  const [loading, setLoading] = useState(false);
  
  const handleClick = async () => {
    setLoading(true);
    try {
      await someAsyncAction();
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? '処理中...' : '送信'}
    </Button>
  );
}
```

### asChild の使用

```typescript
import Link from 'next/link';

function LinkButton() {
  return (
    <Button asChild variant="outline">
      <Link href="/about">
        詳細を見る
      </Link>
    </Button>
  );
}
```

## 🎨 スタイルカスタマイズ

### カスタムクラスの追加

```typescript
<Button 
  variant="primary" 
  className="w-full shadow-lg hover:shadow-xl transition-shadow"
>
  フルワイドボタン
</Button>
```

### レスポンシブサイズ

```typescript
<Button 
  size="sm"
  className="mobile:w-full tablet:w-auto desktop:w-auto"
>
  レスポンシブボタン
</Button>
```

## 📱 レスポンシブ対応

### モバイル最適化

```typescript
function MobileOptimizedButtons() {
  return (
    <div className="mobile:space-y-2 desktop:space-x-2 desktop:flex">
      <Button 
        variant="primary"
        className="mobile:w-full mobile:min-h-[44px] desktop:w-auto"
      >
        申し込み
      </Button>
      <Button 
        variant="secondary"
        className="mobile:w-full mobile:min-h-[44px] desktop:w-auto"
      >
        詳細を見る
      </Button>
    </div>
  );
}
```

## ♿ アクセシビリティ

### ARIA属性

```typescript
function AccessibleButtons() {
  return (
    <>
      {/* 説明的なラベル */}
      <Button aria-label="メニューを開く">
        <MenuIcon />
      </Button>
      
      {/* 状態の表示 */}
      <Button 
        aria-expanded={isOpen}
        aria-controls="menu-content"
      >
        メニュー
      </Button>
      
      {/* 読み込み状態 */}
      <Button 
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? '送信中...' : '送信'}
      </Button>
    </>
  );
}
```

### キーボードナビゲーション

- **Tab**: フォーカス移動
- **Enter/Space**: ボタン実行
- **Escape**: フォーカス解除（モーダル内など）

## 🧪 テスト例

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/atoms';

describe('Button', () => {
  test('クリックイベントが正常に発火する', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick}>
        テストボタン
      </Button>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  test('disabled状態でクリックできない', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        無効ボタン
      </Button>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
  
  test('適切なバリアントクラスが適用される', () => {
    render(<Button variant="destructive">削除</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-500');
  });
});
```

## 🎯 ベストプラクティス

### 適切なバリアント選択

```typescript
// 良い例
<Button variant="destructive">削除</Button>  // 危険なアクション
<Button variant="outline">キャンセル</Button>  // 副次的なアクション
<Button variant="default">保存</Button>      // 主要なアクション

// 避けるべき例
<Button variant="destructive">保存</Button>  // 危険でないのに destructive
```

### 適切なサイズ使用

```typescript
// コンテキストに応じたサイズ選択
<Button size="lg">重要なCTA</Button>        // ヒーローセクション
<Button size="default">一般的なアクション</Button>  // 通常の操作
<Button size="sm">補助的なアクション</Button>      // テーブル内など
```

### アクセシビリティの確保

```typescript
// アイコンボタンには必ずラベルを
<Button variant="outline" size="icon" aria-label="検索">
  <Search className="h-4 w-4" />
</Button>

// 状態変化を適切に伝える
<Button aria-busy={loading} disabled={loading}>
  {loading ? '処理中...' : '送信'}
</Button>
```

## 🔗 関連コンポーネント

- [Badge](./badge.md) - 情報表示用
- [Link](./link.md) - ナビゲーション用
- [IconButton](./icon-button.md) - アイコン専用ボタン
