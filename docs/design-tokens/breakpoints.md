# ブレークポイント

UIコンポーネントライブラリで使用するレスポンシブデザインのブレークポイント定義です。

## 📱 標準ブレークポイント

Tailwind CSSの標準ブレークポイントです。

```typescript
breakpoints: {
  sm: '640px',   // 小型タブレット以上
  md: '768px',   // タブレット以上
  lg: '1024px',  // 小型デスクトップ以上
  xl: '1280px',  // デスクトップ以上
  '2xl': '1536px' // 大型デスクトップ以上
}
```

## 🎯 カスタムスクリーン定義

ahamoプロジェクト専用のレスポンシブ定義です。

```typescript
screens: {
  mobile: { max: '767px' },           // モバイル専用
  tablet: { min: '768px', max: '1023px' }, // タブレット専用
  desktop: { min: '1024px' }          // デスクトップ以上
}
```

## 📐 デバイス分類

### モバイル（〜767px）
- **対象デバイス**: スマートフォン
- **画面幅**: 320px〜767px
- **特徴**: 
  - 縦向き表示が主
  - タッチ操作
  - 限られた画面領域

### タブレット（768px〜1023px）
- **対象デバイス**: タブレット、小型ノートPC
- **画面幅**: 768px〜1023px
- **特徴**:
  - 横向き・縦向き両対応
  - タッチ操作とマウス操作
  - 中程度の画面領域

### デスクトップ（1024px〜）
- **対象デバイス**: デスクトップPC、ノートPC
- **画面幅**: 1024px以上
- **特徴**:
  - 横向き表示
  - マウス・キーボード操作
  - 広い画面領域

## 💡 使用方法

### 標準ブレークポイント
```html
<!-- 基本的なレスポンシブ -->
<div class="text-sm md:text-base lg:text-lg">
  レスポンシブテキスト
</div>

<!-- グリッドレイアウト -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <div>アイテム1</div>
  <div>アイテム2</div>
  <div>アイテム3</div>
</div>

<!-- パディング調整 -->
<div class="p-4 md:p-6 lg:p-8">
  レスポンシブパディング
</div>
```

### カスタムスクリーン
```html
<!-- モバイル専用表示 -->
<div class="mobile:block tablet:hidden desktop:hidden">
  モバイルのみ表示
</div>

<!-- タブレット専用表示 -->
<div class="mobile:hidden tablet:block desktop:hidden">
  タブレットのみ表示
</div>

<!-- デスクトップ以上で表示 -->
<div class="mobile:hidden tablet:hidden desktop:block">
  デスクトップ以上で表示
</div>
```

## 🎨 レスポンシブデザインパターン

### ナビゲーション
```html
<!-- モバイル: ハンバーガーメニュー -->
<!-- デスクトップ: 水平メニュー -->
<nav class="mobile:block tablet:hidden desktop:flex">
  <div class="mobile:space-y-2 desktop:space-x-4">
    <a href="#">メニュー1</a>
    <a href="#">メニュー2</a>
    <a href="#">メニュー3</a>
  </div>
</nav>
```

### カードレイアウト
```html
<!-- モバイル: 1列 -->
<!-- タブレット: 2列 -->
<!-- デスクトップ: 3列 -->
<div class="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
  <div class="card">カード1</div>
  <div class="card">カード2</div>
  <div class="card">カード3</div>
</div>
```

### フォームレイアウト
```html
<form class="space-y-4">
  <!-- モバイル: 縦並び -->
  <!-- デスクトップ: 横並び -->
  <div class="mobile:space-y-4 desktop:flex desktop:space-x-4 desktop:space-y-0">
    <input class="mobile:w-full desktop:flex-1" placeholder="姓">
    <input class="mobile:w-full desktop:flex-1" placeholder="名">
  </div>
</form>
```

## 📊 コンテナサイズ

各ブレークポイントでの推奨コンテナ幅：

```html
<!-- 中央揃えコンテナ -->
<div class="container mx-auto px-4">
  <!-- 自動的にブレークポイントに応じてmax-widthが設定される -->
  <!-- sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px -->
</div>

<!-- カスタムコンテナ -->
<div class="max-w-sm mx-auto mobile:max-w-full tablet:max-w-md desktop:max-w-lg">
  レスポンシブコンテナ
</div>
```

## 🎯 ベストプラクティス

### モバイルファースト
```html
<!-- 良い例: モバイルから始めて大きな画面に拡張 -->
<div class="text-sm md:text-base lg:text-lg">
  モバイルファーストテキスト
</div>

<!-- 避けるべき: デスクトップから始める -->
<div class="text-lg md:text-sm">
  非推奨パターン
</div>
```

### パフォーマンス考慮
```html
<!-- 画像の最適化 -->
<img 
  src="mobile-image.jpg"
  srcset="mobile-image.jpg 480w, tablet-image.jpg 768w, desktop-image.jpg 1200w"
  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
  alt="レスポンシブ画像"
>
```

### タッチ対応
```html
<!-- モバイルでのタッチターゲット -->
<button class="mobile:min-h-[44px] mobile:min-w-[44px] desktop:min-h-[32px]">
  タッチ対応ボタン
</button>
```

## 🔧 カスタマイズ

新しいブレークポイントを追加する場合：

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      screens: {
        'xs': '480px',        // 極小デバイス
        '3xl': '1920px',      // 超大型画面
        'portrait': { 'raw': '(orientation: portrait)' }, // 縦向き
        'landscape': { 'raw': '(orientation: landscape)' } // 横向き
      }
    }
  }
}
```

## 📱 テスト推奨サイズ

開発時にテストすべき画面サイズ：

| デバイス | 幅 | 高さ | 備考 |
|----------|-----|------|------|
| iPhone SE | 375px | 667px | 小型スマートフォン |
| iPhone 12 | 390px | 844px | 標準スマートフォン |
| iPad | 768px | 1024px | タブレット縦向き |
| iPad Pro | 1024px | 1366px | 大型タブレット |
| MacBook Air | 1280px | 800px | 小型ノートPC |
| Desktop | 1920px | 1080px | 標準デスクトップ |

## 🌐 国際化対応

日本語コンテンツでの考慮事項：

- **文字サイズ**: 日本語は英語より大きく見えるため、適切なサイズ調整
- **行間**: 日本語に適した行間（1.5〜1.7）の設定
- **文字数**: 1行あたりの適切な文字数（25〜35文字）の維持
