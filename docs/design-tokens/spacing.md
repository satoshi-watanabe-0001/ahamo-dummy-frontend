# スペーシング

UIコンポーネントライブラリで使用するスペーシングシステムの定義です。

## 📏 スペーシングスケール

一貫したスペーシングを提供する階層的なスケールです。

```typescript
spacing: {
  0: '0px',        // 0
  px: '1px',       // 1px
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  11: '2.75rem',   // 44px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  28: '7rem',      // 112px
  32: '8rem',      // 128px
  36: '9rem',      // 144px
  40: '10rem',     // 160px
  44: '11rem',     // 176px
  48: '12rem',     // 192px
  52: '13rem',     // 208px
  56: '14rem',     // 224px
  60: '15rem',     // 240px
  64: '16rem',     // 256px
  72: '18rem',     // 288px
  80: '20rem',     // 320px
  96: '24rem'      // 384px
}
```

## 🎯 使用ガイドライン

### 基本的なスペーシング

| 値 | サイズ | 用途 |
|----|--------|------|
| `1` | 4px | 極小間隔 |
| `2` | 8px | 小間隔、アイコンとテキスト間 |
| `3` | 12px | 標準的な小間隔 |
| `4` | 16px | 基本間隔（推奨ベース） |
| `6` | 24px | 中間隔、セクション内要素間 |
| `8` | 32px | 大間隔、セクション間 |
| `12` | 48px | 特大間隔、主要セクション間 |
| `16` | 64px | 超大間隔、ページレベル |

### コンポーネント別推奨値

#### ボタン
```html
<!-- 内部パディング -->
<button class="px-4 py-2">標準ボタン</button>
<button class="px-3 py-1">小ボタン</button>
<button class="px-6 py-3">大ボタン</button>

<!-- ボタン間の間隔 -->
<div class="space-x-2">
  <button>ボタン1</button>
  <button>ボタン2</button>
</div>
```

#### カード
```html
<div class="p-6 space-y-4">
  <h3>カードタイトル</h3>
  <p>カード内容</p>
</div>
```

#### フォーム
```html
<form class="space-y-6">
  <div class="space-y-2">
    <label>ラベル</label>
    <input class="px-3 py-2">
  </div>
</form>
```

## 🔘 ボーダー半径

角の丸みを定義するスケールです。

```typescript
borderRadius: {
  none: '0px',      // 角なし
  sm: '0.125rem',   // 2px - 小さな角丸
  DEFAULT: '0.25rem', // 4px - 標準角丸
  md: '0.375rem',   // 6px - 中程度角丸
  lg: '0.5rem',     // 8px - 大きな角丸
  xl: '0.75rem',    // 12px - 特大角丸
  '2xl': '1rem',    // 16px - 超大角丸
  '3xl': '1.5rem',  // 24px - 極大角丸
  full: '9999px'    // 完全な円形
}
```

### 使用ガイドライン

| 値 | 用途 |
|----|------|
| `sm` | バッジ、小さなボタン |
| `DEFAULT` | 標準ボタン、入力フィールド |
| `md` | カード、パネル |
| `lg` | 大きなカード、モーダル |
| `xl` | 特別な装飾要素 |
| `full` | アバター、円形ボタン |

## 💡 使用方法

### マージン・パディング
```html
<!-- パディング -->
<div class="p-4">全方向16px</div>
<div class="px-6 py-4">水平24px、垂直16px</div>
<div class="pt-8 pb-4">上32px、下16px</div>

<!-- マージン -->
<div class="m-4">全方向16px</div>
<div class="mx-auto">水平中央揃え</div>
<div class="mt-8 mb-4">上32px、下16px</div>
```

### 要素間スペース
```html
<!-- 子要素間に一定の間隔 -->
<div class="space-y-4">
  <div>要素1</div>
  <div>要素2</div>
  <div>要素3</div>
</div>

<!-- 水平方向の間隔 -->
<div class="flex space-x-2">
  <button>ボタン1</button>
  <button>ボタン2</button>
</div>
```

### ボーダー半径
```html
<!-- 標準的な角丸 -->
<div class="rounded">標準角丸</div>

<!-- 大きな角丸 -->
<div class="rounded-lg">大角丸</div>

<!-- 円形 -->
<div class="rounded-full w-12 h-12">円形</div>

<!-- 部分的な角丸 -->
<div class="rounded-t-lg">上のみ角丸</div>
```

## 📱 レスポンシブスペーシング

デバイスサイズに応じてスペーシングを調整：

```html
<!-- モバイルで小さく、デスクトップで大きく -->
<div class="p-4 md:p-6 lg:p-8">
  レスポンシブパディング
</div>

<!-- セクション間隔 -->
<section class="mb-8 md:mb-12 lg:mb-16">
  セクション内容
</section>
```

## 🎯 ベストプラクティス

### 一貫性の保持
- **4の倍数**: 基本的に4px（`1`）の倍数を使用
- **階層的**: 関連する要素は近く、無関係な要素は遠く
- **視覚的グループ化**: 関連要素をスペーシングでグループ化

### パフォーマンス
- **space-*ユーティリティ**: 子要素間の間隔に使用
- **gap**: Flexbox/Gridレイアウトで使用
- **負のマージン**: 特別な場合のみ使用

### アクセシビリティ
- **タッチターゲット**: 最小44px（`11`）のタッチ領域を確保
- **フォーカス表示**: 十分な間隔でフォーカス状態を明確に
- **読みやすさ**: テキストブロック間に適切な間隔

## 🔧 カスタマイズ

新しいスペーシング値が必要な場合：

```typescript
// tokens/spacing.ts に追加
export const spacing = {
  // 既存の値...
  18: '4.5rem',  // 72px - カスタム値
} as const;
```

```javascript
// tailwind.config.js で設定
module.exports = {
  theme: {
    extend: {
      spacing: {
        '18': '4.5rem',
      }
    }
  }
}
```
