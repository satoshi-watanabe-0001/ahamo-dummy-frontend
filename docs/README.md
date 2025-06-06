# Ahamo UIコンポーネントライブラリ設計書

React + TypeScript + Tailwind CSSを使用したアトミックデザイン手法による再利用可能なUIコンポーネントライブラリの包括的な設計書です。

## 📚 ドキュメント構成

### [🎨 デザイントークン](./design-tokens/)
- [カラーパレット](./design-tokens/colors.md) - プライマリ、セカンダリ、セマンティックカラー
- [タイポグラフィ](./design-tokens/typography.md) - フォント、サイズ、ウェイト定義
- [スペーシング](./design-tokens/spacing.md) - マージン、パディング、ボーダー半径
- [ブレークポイント](./design-tokens/breakpoints.md) - レスポンシブデザイン定義

### [⚛️ Atoms - 基本コンポーネント](./components/atoms/)
最小単位のUIコンポーネント
- [Button](./components/atoms/button.md) - ボタンコンポーネント
- [Input](./components/atoms/input.md) - 入力フィールド
- [Badge](./components/atoms/badge.md) - バッジ・ラベル
- [Switch](./components/atoms/switch.md) - スイッチ・トグル
- [Checkbox](./components/atoms/checkbox.md) - チェックボックス
- [Avatar](./components/atoms/avatar.md) - アバター画像
- [Skeleton](./components/atoms/skeleton.md) - ローディング表示
- [Progress](./components/atoms/progress.md) - プログレスバー
- [Slider](./components/atoms/slider.md) - スライダー

### [🧬 Molecules - 複合コンポーネント](./components/molecules/)
複数のatomsを組み合わせたコンポーネント
- [Card](./components/molecules/card.md) - カードコンポーネント
- [Form](./components/molecules/form.md) - フォーム関連
- [Tabs](./components/molecules/tabs.md) - タブコンポーネント
- [Select](./components/molecules/select.md) - セレクトボックス
- [Accordion](./components/molecules/accordion.md) - アコーディオン
- [Breadcrumb](./components/molecules/breadcrumb.md) - パンくずリスト

### [🏗️ Organisms - 複雑なコンポーネント](./components/organisms/)
複数のmoleculesを組み合わせた複雑なコンポーネント
- [NavigationMenu](./components/organisms/navigation-menu.md) - ナビゲーションメニュー
- [Dialog](./components/organisms/dialog.md) - ダイアログ・モーダル
- [Table](./components/organisms/table.md) - テーブル
- [Sidebar](./components/organisms/sidebar.md) - サイドバー
- [Command](./components/organisms/command.md) - コマンドパレット

### [🚨 エラーハンドリングポリシー](./error-policy.md)
- [統一エラーハンドリングシステム](./error-policy.md) - エラー分類、表示、リトライポリシー

### [📖 使用例とベストプラクティス](./examples/)
- [基本的な使用方法](./examples/basic-usage.md)
- [コンポーネント組み合わせパターン](./examples/composition-patterns.md)
- [レスポンシブデザイン](./examples/responsive-design.md)
- [アクセシビリティガイドライン](./examples/accessibility.md)

## 🚀 クイックスタート

### インストール
```bash
npm install
```

### 開発サーバー起動
```bash
npm run dev
```

### ビルド
```bash
npm run build
```

## 💡 基本的な使用方法

```typescript
import { Button, Card, Input } from '@/components/atoms';
import { Form } from '@/components/molecules';

// ボタンの使用
<Button variant="primary" size="medium">
  申し込み
</Button>

// カードの使用
<Card>
  <CardHeader>
    <CardTitle>ahamoベーシック</CardTitle>
  </CardHeader>
  <CardContent>
    20GB + 5分かけ放題
  </CardContent>
</Card>
```

## 🎯 設計原則

### アトミックデザイン
- **Atoms**: 最小単位のUIコンポーネント（Button、Input等）
- **Molecules**: 複数のAtomsを組み合わせた機能的なコンポーネント（Card、Form等）
- **Organisms**: 複数のMoleculesを組み合わせた複雑なコンポーネント（Navigation、Dialog等）
- **Templates**: ページレイアウトの構造定義

### デザイントークン
- **一貫性**: 全コンポーネントで統一されたデザイン値
- **保守性**: 中央集約されたデザイン定義
- **拡張性**: 新しいテーマやバリアントの追加が容易

### TypeScript
- **型安全性**: 全コンポーネントに型定義
- **開発体験**: IntelliSenseによる自動補完
- **エラー防止**: コンパイル時の型チェック

## 🛠️ 技術仕様

- **フレームワーク**: React 18 + TypeScript
- **スタイリング**: Tailwind CSS + shadcn/ui
- **コンポーネント**: Radix UI primitives
- **アイコン**: Lucide React
- **ビルドツール**: Vite
- **アクセシビリティ**: WCAG 2.1 AA準拠

## 📁 プロジェクト構造

```
src/
├── components/
│   ├── atoms/          # 基本コンポーネント
│   ├── molecules/      # 複合コンポーネント
│   ├── organisms/      # 複雑なコンポーネント
│   └── ui/             # shadcn/ui実装
├── tokens/             # デザイントークン
├── utils/              # ユーティリティ関数
├── hooks/              # カスタムフック
└── types/              # TypeScript型定義
```

## 🤝 コントリビューション

新しいコンポーネントを追加する際は、以下のガイドラインに従ってください：

1. **アトミックデザイン原則**に従った適切な分類
2. **TypeScript型定義**の追加
3. **アクセシビリティ**の考慮
4. **レスポンシブデザイン**の実装
5. **ドキュメント**の更新

## 📞 サポート

質問や問題がある場合は、GitHubのIssueまたはPull Requestでお知らせください。
