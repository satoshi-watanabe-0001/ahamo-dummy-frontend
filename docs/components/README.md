# コンポーネント

UIコンポーネントライブラリの全コンポーネントドキュメントです。アトミックデザイン手法に基づいて階層的に整理されています。

## 🏗️ アーキテクチャ

### アトミックデザイン階層

```
Templates (テンプレート)
    ↑
Organisms (オーガニズム) - 複雑なコンポーネント
    ↑
Molecules (モレキュール) - 複合コンポーネント
    ↑
Atoms (アトム) - 基本コンポーネント
```

## ⚛️ [Atoms - 基本コンポーネント](./atoms/)

最小単位のUIコンポーネント。他のコンポーネントの構成要素となります。

| コンポーネント | 説明 | 主な用途 |
|---------------|------|----------|
| [Button](./atoms/button.md) | ボタン | アクション実行 |
| [Input](./atoms/input.md) | 入力フィールド | データ入力 |
| [Badge](./atoms/badge.md) | バッジ・ラベル | ステータス表示 |
| [Switch](./atoms/switch.md) | スイッチ・トグル | ON/OFF切り替え |
| [Checkbox](./atoms/checkbox.md) | チェックボックス | 複数選択 |
| [Avatar](./atoms/avatar.md) | アバター画像 | ユーザー表示 |
| [Skeleton](./atoms/skeleton.md) | ローディング表示 | 読み込み中 |
| [Progress](./atoms/progress.md) | プログレスバー | 進捗表示 |
| [Slider](./atoms/slider.md) | スライダー | 値選択 |

## 🧬 [Molecules - 複合コンポーネント](./molecules/)

複数のAtomsを組み合わせた機能的なコンポーネント。

| コンポーネント | 説明 | 主な用途 |
|---------------|------|----------|
| [Card](./molecules/card.md) | カード | 情報グループ化 |
| [Form](./molecules/form.md) | フォーム | データ入力フォーム |
| [Tabs](./molecules/tabs.md) | タブ | コンテンツ切り替え |
| [Select](./molecules/select.md) | セレクトボックス | 選択肢から選択 |
| [Accordion](./molecules/accordion.md) | アコーディオン | 折りたたみ表示 |
| [Breadcrumb](./molecules/breadcrumb.md) | パンくずリスト | ナビゲーション |

## 🏗️ [Organisms - 複雑なコンポーネント](./organisms/)

複数のMoleculesを組み合わせた複雑なコンポーネント。

| コンポーネント | 説明 | 主な用途 |
|---------------|------|----------|
| [NavigationMenu](./organisms/navigation-menu.md) | ナビゲーションメニュー | サイトナビゲーション |
| [Dialog](./organisms/dialog.md) | ダイアログ・モーダル | 重要な操作・情報 |
| [Table](./organisms/table.md) | テーブル | データ表示 |
| [Sidebar](./organisms/sidebar.md) | サイドバー | サイドナビゲーション |
| [Command](./organisms/command.md) | コマンドパレット | 検索・コマンド実行 |

## 🎨 デザイン原則

### 一貫性
- 全コンポーネントで統一されたデザイントークンを使用
- 同じ機能には同じUIパターンを適用
- 予測可能なインタラクション

### 再利用性
- 汎用的な設計で様々な場面で使用可能
- プロパティによるカスタマイズ対応
- 組み合わせによる拡張性

### アクセシビリティ
- WCAG 2.1 AA準拠
- キーボードナビゲーション対応
- スクリーンリーダー対応

### レスポンシブ
- モバイル、タブレット、デスクトップ対応
- タッチ操作とマウス操作の両対応
- 適切なタッチターゲットサイズ

## 💡 使用方法

### 基本的なインポート
```typescript
// Atoms
import { Button, Input, Badge } from '@/components/atoms';

// Molecules
import { Card, CardHeader, CardContent } from '@/components/molecules';

// Organisms
import { NavigationMenu, Dialog } from '@/components/organisms';
```

### 組み合わせ例
```typescript
import { Button, Input } from '@/components/atoms';
import { Card, CardHeader, CardContent, Form } from '@/components/molecules';

function LoginCard() {
  return (
    <Card>
      <CardHeader>
        <h2>ログイン</h2>
      </CardHeader>
      <CardContent>
        <Form>
          <Input type="email" placeholder="メールアドレス" />
          <Input type="password" placeholder="パスワード" />
          <Button variant="primary" size="medium">
            ログイン
          </Button>
        </Form>
      </CardContent>
    </Card>
  );
}
```

## 🔧 カスタマイズ

### テーマのカスタマイズ
```typescript
// デザイントークンの上書き
const customTheme = {
  colors: {
    primary: {
      500: '#custom-color'
    }
  }
};
```

### 新しいバリアントの追加
```typescript
// Button コンポーネントの拡張例
const customButtonVariants = cva(
  // ベースクラス
  "...",
  {
    variants: {
      variant: {
        // 既存のバリアント...
        custom: "bg-custom text-white hover:bg-custom/90"
      }
    }
  }
);
```

## 📚 関連ドキュメント

- [デザイントークン](../design-tokens/) - 色、タイポグラフィ、スペーシング
- [使用例](../examples/) - 実践的な使用方法
- [アクセシビリティガイド](../examples/accessibility.md) - アクセシビリティ対応
- [レスポンシブデザイン](../examples/responsive-design.md) - レスポンシブ対応
