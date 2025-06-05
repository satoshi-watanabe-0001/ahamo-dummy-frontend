# Atoms - 基本コンポーネント

最小単位のUIコンポーネントです。他のコンポーネントの構成要素として使用されます。

## 📋 コンポーネント一覧

| コンポーネント | 説明 | バリアント数 | 主な用途 |
|---------------|------|-------------|----------|
| [Button](./button.md) | ボタン | 6種類 | アクション実行 |
| [Input](./input.md) | 入力フィールド | 1種類 | データ入力 |
| [Badge](./badge.md) | バッジ・ラベル | 4種類 | ステータス表示 |
| [Switch](./switch.md) | スイッチ・トグル | 1種類 | ON/OFF切り替え |
| [Checkbox](./checkbox.md) | チェックボックス | 1種類 | 複数選択 |
| [Label](./label.md) | ラベル | 1種類 | フォームラベル |
| [Separator](./separator.md) | 区切り線 | 1種類 | セクション分割 |
| [Avatar](./avatar.md) | アバター画像 | 1種類 | ユーザー表示 |
| [Skeleton](./skeleton.md) | ローディング表示 | 1種類 | 読み込み中 |
| [Progress](./progress.md) | プログレスバー | 1種類 | 進捗表示 |
| [Slider](./slider.md) | スライダー | 1種類 | 値選択 |

## 🎯 設計原則

### 単一責任
各Atomは単一の機能・目的を持ちます。
- Button: クリック可能なアクション要素
- Input: テキスト入力
- Badge: 情報表示

### 再利用性
様々な場面で使用できる汎用的な設計です。
- プロパティによるカスタマイズ
- 複数のバリアント提供
- 組み合わせ可能な設計

### 一貫性
全てのAtomで統一されたAPI設計です。
- 共通のプロパティ命名
- 統一されたバリアント名
- 一貫したスタイリング

## 💡 基本的な使用方法

### インポート
```typescript
import { 
  Button, 
  Input, 
  Badge, 
  Switch, 
  Checkbox 
} from '@/components/atoms';
```

### 基本的な使用例
```typescript
function BasicExample() {
  return (
    <div className="space-y-4">
      {/* ボタン */}
      <Button variant="primary" size="medium">
        申し込み
      </Button>
      
      {/* 入力フィールド */}
      <Input 
        type="email" 
        placeholder="メールアドレスを入力"
      />
      
      {/* バッジ */}
      <Badge variant="default">
        人気
      </Badge>
      
      {/* スイッチ */}
      <Switch 
        checked={true}
        onCheckedChange={(checked) => console.log(checked)}
      />
      
      {/* チェックボックス */}
      <Checkbox 
        checked={false}
        onCheckedChange={(checked) => console.log(checked)}
      />
    </div>
  );
}
```

## 🎨 スタイリング

### デザイントークンの使用
全てのAtomはデザイントークンを使用してスタイリングされています。

```typescript
// 色の使用例
<Button className="bg-primary-500 text-white">
  プライマリボタン
</Button>

// スペーシングの使用例
<Input className="px-3 py-2">
  入力フィールド
</Input>
```

### カスタムスタイル
```typescript
// className プロパティでカスタマイズ
<Button 
  variant="primary" 
  className="w-full shadow-lg"
>
  フルワイドボタン
</Button>
```

## 🔧 カスタマイズ

### 新しいバリアントの追加
```typescript
// Button コンポーネントの拡張例
const customButtonVariants = cva(
  // ベースクラス
  "inline-flex items-center justify-center...",
  {
    variants: {
      variant: {
        // 既存のバリアント
        default: "...",
        primary: "...",
        // 新しいバリアント
        gradient: "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
      }
    }
  }
);
```

### プロパティの拡張
```typescript
interface ExtendedButtonProps extends ButtonProps {
  loading?: boolean;
  icon?: React.ReactNode;
}

const ExtendedButton: React.FC<ExtendedButtonProps> = ({
  loading,
  icon,
  children,
  ...props
}) => {
  return (
    <Button {...props}>
      {loading && <Spinner />}
      {icon && icon}
      {children}
    </Button>
  );
};
```

## 📱 レスポンシブ対応

### ブレークポイント対応
```typescript
<Button 
  size="sm"
  className="mobile:w-full tablet:w-auto desktop:w-auto"
>
  レスポンシブボタン
</Button>
```

### タッチ対応
```typescript
// モバイルでのタッチターゲット確保
<Button 
  size="sm"
  className="mobile:min-h-[44px] mobile:min-w-[44px]"
>
  タッチ対応
</Button>
```

## ♿ アクセシビリティ

### キーボードナビゲーション
全てのAtomはキーボード操作に対応しています。
- Tab: フォーカス移動
- Enter/Space: アクション実行
- Escape: フォーカス解除

### スクリーンリーダー対応
```typescript
// aria属性の使用例
<Button 
  aria-label="メニューを開く"
  aria-expanded={isOpen}
>
  <MenuIcon />
</Button>

<Input 
  aria-describedby="email-help"
  aria-invalid={hasError}
/>
```

### フォーカス表示
```typescript
// フォーカス状態の明確な表示
<Button className="focus-visible:ring-2 focus-visible:ring-primary-500">
  フォーカス対応ボタン
</Button>
```

## 🧪 テスト

### 単体テスト例
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/atoms';

test('ボタンクリックイベントが発火する', () => {
  const handleClick = jest.fn();
  render(
    <Button onClick={handleClick}>
      テストボタン
    </Button>
  );
  
  fireEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## 📚 関連ドキュメント

- [デザイントークン](../../design-tokens/) - 使用している色・スペーシング等
- [Molecules](../molecules/) - Atomsを組み合わせたコンポーネント
- [使用例](../../examples/) - 実践的な使用方法
