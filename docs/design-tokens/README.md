# デザイントークン

UIコンポーネントライブラリの基盤となるデザイントークンの定義です。一貫性のあるデザインシステムを構築するための中央集約された値を提供します。

## 📋 トークン一覧

### [🎨 カラーパレット](./colors.md)
- プライマリカラー（ブルー系）
- セカンダリカラー（グレー系）
- セマンティックカラー（成功、警告、エラー、情報）
- ニュートラルカラー（背景、テキスト）

### [📝 タイポグラフィ](./typography.md)
- フォントファミリー（Inter、JetBrains Mono）
- フォントサイズ（xs〜6xl）
- フォントウェイト（thin〜black）
- 行間・文字間隔

### [📏 スペーシング](./spacing.md)
- マージン・パディング値（0〜96）
- ボーダー半径（none〜full）

### [📱 ブレークポイント](./breakpoints.md)
- レスポンシブデザイン定義
- モバイル、タブレット、デスクトップ

## 🎯 使用方法

デザイントークンは`src/tokens/`ディレクトリで定義され、Tailwind CSSの設定に統合されています。

```typescript
import { colors, typography, spacing, breakpoints } from '@/tokens';

// TypeScriptでの型安全な使用
const primaryColor: string = colors.primary[500];
const headingFont: string = typography.fontFamily.sans[0];
```

## 🔧 カスタマイズ

新しいトークンを追加する場合は、以下の手順に従ってください：

1. `src/tokens/`の該当ファイルに値を追加
2. `tailwind.config.js`の設定を更新
3. TypeScript型定義を更新
4. ドキュメントを更新

## 📐 設計原則

- **一貫性**: 全コンポーネントで統一された値の使用
- **スケーラビリティ**: 新しい値の追加が容易
- **保守性**: 中央集約による管理の簡素化
- **型安全性**: TypeScriptによる型チェック
