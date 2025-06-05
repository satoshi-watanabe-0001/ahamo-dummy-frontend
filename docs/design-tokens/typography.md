# タイポグラフィ

UIコンポーネントライブラリで使用するタイポグラフィシステムの定義です。

## 📝 フォントファミリー

### Sans-serif（メインフォント）
```typescript
sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
```
- **Inter**: モダンで読みやすいWebフォント
- **フォールバック**: システムフォントで確実な表示

### Monospace（コードフォント）
```typescript
mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
```
- **JetBrains Mono**: コード表示に最適化されたフォント
- **フォールバック**: システムの等幅フォント

## 📏 フォントサイズ

階層的なフォントサイズシステムです。

```typescript
fontSize: {
  xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
  sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
  base: ['1rem', { lineHeight: '1.5rem' }],     // 16px (ベース)
  lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
  xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
  '5xl': ['3rem', { lineHeight: '1' }],           // 48px
  '6xl': ['3.75rem', { lineHeight: '1' }]         // 60px
}
```

### 使用ガイドライン

| サイズ | 用途 | 例 |
|--------|------|-----|
| `xs` | キャプション、補助テキスト | バッジ内テキスト |
| `sm` | 小さなテキスト | フォームラベル |
| `base` | 本文テキスト | 段落、説明文 |
| `lg` | 強調テキスト | カードタイトル |
| `xl` | 小見出し | セクション見出し |
| `2xl` | 見出し | ページタイトル |
| `3xl`〜`6xl` | 大見出し | ヒーロータイトル |

## ⚖️ フォントウェイト

```typescript
fontWeight: {
  thin: '100',        // 極細
  extralight: '200',  // 超軽量
  light: '300',       // 軽量
  normal: '400',      // 標準
  medium: '500',      // 中程度
  semibold: '600',    // 半太字
  bold: '700',        // 太字
  extrabold: '800',   // 超太字
  black: '900'        // 極太
}
```

### 使用ガイドライン

| ウェイト | 用途 |
|----------|------|
| `light` (300) | 大きな見出し、軽やかな印象 |
| `normal` (400) | 本文テキスト |
| `medium` (500) | 強調テキスト、ボタンラベル |
| `semibold` (600) | 小見出し、カードタイトル |
| `bold` (700) | 重要な見出し |

## 📐 行間（Line Height）

```typescript
lineHeight: {
  none: '1',      // 1.0 - タイトル用
  tight: '1.25',  // 1.25 - 見出し用
  snug: '1.375',  // 1.375 - 小見出し用
  normal: '1.5',  // 1.5 - 本文用（推奨）
  relaxed: '1.625', // 1.625 - ゆったりした本文
  loose: '2'      // 2.0 - 特別な用途
}
```

## 🔤 文字間隔（Letter Spacing）

```typescript
letterSpacing: {
  tighter: '-0.05em',  // より密
  tight: '-0.025em',   // 密
  normal: '0em',       // 標準
  wide: '0.025em',     // 広
  wider: '0.05em',     // より広
  widest: '0.1em'      // 最も広
}
```

## 💡 使用方法

### Tailwind CSSクラス
```html
<!-- 見出し -->
<h1 class="text-3xl font-bold text-gray-900">メインタイトル</h1>
<h2 class="text-xl font-semibold text-gray-800">セクションタイトル</h2>

<!-- 本文 -->
<p class="text-base font-normal leading-relaxed text-gray-700">
  本文テキストです。読みやすい行間で設定されています。
</p>

<!-- 強調テキスト -->
<span class="text-lg font-medium text-primary-600">重要な情報</span>

<!-- コード -->
<code class="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
  const example = 'code';
</code>
```

### TypeScript
```typescript
import { typography } from '@/tokens/typography';

const headingFont = typography.fontFamily.sans.join(', ');
const codeFont = typography.fontFamily.mono.join(', ');
```

## 🎯 アクセシビリティ

### 読みやすさの確保
- **最小フォントサイズ**: 14px（`text-sm`）以上を推奨
- **行間**: 本文は1.5以上（`leading-normal`）を使用
- **コントラスト**: 背景色との十分なコントラスト比を確保

### レスポンシブタイポグラフィ
```html
<!-- モバイルで小さく、デスクトップで大きく -->
<h1 class="text-2xl md:text-4xl lg:text-5xl font-bold">
  レスポンシブタイトル
</h1>
```

## 📱 レスポンシブ対応

デバイスサイズに応じてフォントサイズを調整：

```html
<!-- モバイル: text-base, タブレット: text-lg, デスクトップ: text-xl -->
<p class="text-base tablet:text-lg desktop:text-xl">
  レスポンシブテキスト
</p>
```

## 🌐 多言語対応

日本語テキストに最適化された設定：

- **Inter**: 日本語文字の表示品質が高い
- **行間**: 日本語に適した1.5〜1.625の行間
- **文字間隔**: 日本語では通常`normal`を使用
