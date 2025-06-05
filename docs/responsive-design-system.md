# レスポンシブデザインシステム

オンライン契約システムのレスポンシブデザイン基盤の設計書です。スマホファーストで設計され、タブレット・PC画面にも対応する一貫したユーザー体験を提供します。

## 📱 ブレークポイント仕様

### カスタムスクリーン定義

ahamoプロジェクト専用のレスポンシブ定義（`src/tokens/breakpoints.ts`および`tailwind.config.js`に実装済み）：

```typescript
screens: {
  mobile: { max: '767px' },           // スマホ専用
  tablet: { min: '768px', max: '1023px' }, // タブレット専用  
  desktop: { min: '1024px' }          // PC以上
}
```

### デバイス分類

#### スマホ（320px〜767px）
- **対象デバイス**: スマートフォン
- **画面幅**: 320px〜767px
- **特徴**: 
  - 縦向き表示が主
  - タッチ操作
  - 限られた画面領域
  - スマホファーストの基準

#### タブレット（768px〜1023px）
- **対象デバイス**: タブレット、小型ノートPC
- **画面幅**: 768px〜1023px
- **特徴**:
  - 横向き・縦向き両対応
  - タッチ操作とマウス操作
  - 中程度の画面領域

#### PC（1024px以上）
- **対象デバイス**: デスクトップPC、ノートPC
- **画面幅**: 1024px以上
- **特徴**:
  - 横向き表示
  - マウス・キーボード操作
  - 広い画面領域

## 🎨 グリッドシステム設計

### Flexbox/CSS Gridの使用例

既存の実装（`docs/design-tokens/breakpoints.md`参照）を活用したレスポンシブレイアウト：

```html
<!-- カードレイアウト: スマホ1列、タブレット2列、PC3列 -->
<div class="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
  <div class="card">カード1</div>
  <div class="card">カード2</div>
  <div class="card">カード3</div>
</div>

<!-- ナビゲーション: レスポンシブメニュー -->
<nav class="mobile:block tablet:hidden desktop:flex">
  <div class="mobile:space-y-2 desktop:space-x-4">
    <a href="#">メニュー1</a>
    <a href="#">メニュー2</a>
    <a href="#">メニュー3</a>
  </div>
</nav>

<!-- フォームレイアウト: スマホ縦並び、PC横並び -->
<form class="space-y-4">
  <div class="mobile:space-y-4 desktop:flex desktop:space-x-4 desktop:space-y-0">
    <input class="mobile:w-full desktop:flex-1" placeholder="姓">
    <input class="mobile:w-full desktop:flex-1" placeholder="名">
  </div>
</form>
```

### コンテナシステム

```html
<!-- 中央揃えコンテナ -->
<div class="container mx-auto px-4">
  <!-- 自動的にブレークポイントに応じてmax-widthが設定される -->
</div>

<!-- カスタムコンテナ -->
<div class="max-w-sm mx-auto mobile:max-w-full tablet:max-w-md desktop:max-w-lg">
  レスポンシブコンテナ
</div>
```

## 📝 タイポグラフィスケール

### フォントサイズと行間

`src/tokens/typography.ts`に定義されたタイポグラフィシステム：

```typescript
fontSize: {
  xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px - キャプション
  sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px - 小テキスト
  base: ['1rem', { lineHeight: '1.5rem' }],     // 16px - 本文（ベース）
  lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px - 強調テキスト
  xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px - 小見出し
  '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px - 見出し
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px - 大見出し
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px - 特大見出し
  '5xl': ['3rem', { lineHeight: '1' }],           // 48px - ヒーロータイトル
  '6xl': ['3.75rem', { lineHeight: '1' }]         // 60px - 超大タイトル
}
```

### デバイス別最適化

```html
<!-- レスポンシブタイポグラフィ -->
<h1 class="text-2xl tablet:text-3xl desktop:text-4xl font-bold">
  レスポンシブタイトル
</h1>

<p class="text-base tablet:text-lg desktop:text-xl leading-relaxed">
  デバイスサイズに応じて最適化されたテキスト
</p>
```

### フォントファミリー

```typescript
fontFamily: {
  sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'], // メインフォント
  mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'] // コードフォント
}
```

## 📏 スペーシングシステム

### 基本スペーシング

`docs/design-tokens/spacing.md`に詳細定義されたスペーシングシステム：

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

### デバイス毎の余白・マージン最適化

```html
<!-- レスポンシブパディング -->
<div class="p-4 tablet:p-6 desktop:p-8">
  デバイスサイズに応じたパディング
</div>

<!-- セクション間隔 -->
<section class="mb-8 tablet:mb-12 desktop:mb-16">
  セクション内容
</section>

<!-- コンポーネント内スペーシング -->
<div class="space-y-4 tablet:space-y-6 desktop:space-y-8">
  <div>要素1</div>
  <div>要素2</div>
  <div>要素3</div>
</div>
```

## 👆 タッチ対応UI

### 最小タップ領域44px

`docs/design-tokens/spacing.md`で定義されたタッチターゲット要件：

```html
<!-- タッチ対応ボタン -->
<Button 
  variant="primary"
  className="mobile:w-full mobile:min-h-[44px] desktop:w-auto"
>
  申し込み
</Button>

<!-- タッチターゲットの確保 -->
<button class="mobile:min-h-[44px] mobile:min-w-[44px] desktop:min-h-[32px] p-2">
  <Icon name="menu" />
</button>

<!-- リンクのタッチ領域 -->
<a href="#" class="mobile:py-3 mobile:px-4 desktop:py-1 desktop:px-2 inline-block">
  ナビゲーションリンク
</a>
```

### タッチ操作最適化

```html
<!-- スワイプ対応カルーセル -->
<div class="mobile:overflow-x-auto mobile:snap-x mobile:snap-mandatory desktop:grid desktop:grid-cols-3">
  <div class="mobile:snap-start mobile:flex-shrink-0 mobile:w-80">カード1</div>
  <div class="mobile:snap-start mobile:flex-shrink-0 mobile:w-80">カード2</div>
  <div class="mobile:snap-start mobile:flex-shrink-0 mobile:w-80">カード3</div>
</div>

<!-- タッチフレンドリーなフォーム -->
<input 
  type="text" 
  class="mobile:text-base mobile:py-3 desktop:text-sm desktop:py-2 w-full"
  placeholder="入力してください"
>
```

## 🖼️ 画像・メディア対応

### レスポンシブ画像のsrcset実装

`docs/design-tokens/breakpoints.md`の画像最適化例：

```html
<!-- レスポンシブ画像 -->
<img 
  src="mobile-image.jpg"
  srcset="mobile-image.jpg 480w, tablet-image.jpg 768w, desktop-image.jpg 1200w"
  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
  alt="レスポンシブ画像"
  class="w-full h-auto"
>

<!-- アスペクト比固定 -->
<div class="aspect-video mobile:aspect-square tablet:aspect-video desktop:aspect-[4/3]">
  <img src="hero-image.jpg" alt="ヒーロー画像" class="w-full h-full object-cover">
</div>

<!-- 背景画像のレスポンシブ対応 -->
<div class="bg-cover bg-center mobile:h-48 tablet:h-64 desktop:h-80"
     style="background-image: url('hero-bg.jpg')">
  <div class="flex items-center justify-center h-full">
    <h1 class="text-white text-center">ヒーローセクション</h1>
  </div>
</div>
```

### メディアクエリ対応

```html
<!-- 動画のレスポンシブ対応 -->
<div class="relative mobile:aspect-video tablet:aspect-[16/10] desktop:aspect-[21/9]">
  <video 
    class="absolute inset-0 w-full h-full object-cover"
    autoplay 
    muted 
    loop
  >
    <source src="mobile-video.mp4" media="(max-width: 767px)">
    <source src="tablet-video.mp4" media="(min-width: 768px) and (max-width: 1023px)">
    <source src="desktop-video.mp4" media="(min-width: 1024px)">
  </video>
</div>
```

## 🎯 ベストプラクティス

### モバイルファースト設計

```html
<!-- 良い例: モバイルから始めて大きな画面に拡張 -->
<div class="text-sm tablet:text-base desktop:text-lg">
  モバイルファーストテキスト
</div>

<div class="flex-col tablet:flex-row">
  <div class="w-full tablet:w-1/2">コンテンツ1</div>
  <div class="w-full tablet:w-1/2">コンテンツ2</div>
</div>
```

### パフォーマンス最適化

```html
<!-- 遅延読み込み -->
<img 
  src="placeholder.jpg" 
  data-src="actual-image.jpg"
  loading="lazy"
  class="mobile:w-full tablet:w-1/2 desktop:w-1/3"
>

<!-- 条件付きコンテンツ読み込み -->
<div class="mobile:hidden tablet:block">
  <!-- タブレット以上でのみ表示される重いコンテンツ -->
</div>
```

### アクセシビリティ

```html
<!-- フォーカス表示の最適化 -->
<button class="focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 mobile:focus:ring-offset-4">
  アクセシブルボタン
</button>

<!-- スクリーンリーダー対応 -->
<nav aria-label="メインナビゲーション">
  <ul class="mobile:space-y-2 desktop:flex desktop:space-x-4">
    <li><a href="#" class="mobile:block desktop:inline">ホーム</a></li>
    <li><a href="#" class="mobile:block desktop:inline">サービス</a></li>
  </ul>
</nav>
```

## 🔧 実装ガイドライン

### CSS Custom Properties

`src/index.css`でデザイントークンが定義済み：

```css
:root {
  --radius: 0.5rem;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 84% 4.9%;
  /* その他のカスタムプロパティ */
}
```

### Tailwind CSS設定

`tailwind.config.js`でカスタムスクリーンが設定済み：

```javascript
theme: {
  extend: {
    screens: {
      mobile: { max: '767px' },
      tablet: { min: '768px', max: '1023px' },
      desktop: { min: '1024px' }
    }
  }
}
```

### TypeScriptトークン

```typescript
// src/tokens/breakpoints.ts
import { screens } from '@/tokens/breakpoints';

// src/tokens/typography.ts  
import { typography } from '@/tokens/typography';

// src/tokens/spacing.ts
import { spacing } from '@/tokens/spacing';
```

## 📋 チェックリスト

レスポンシブデザイン実装時の確認項目：

### デザイン
- [ ] スマホファーストで設計されているか
- [ ] 3つのブレークポイント（mobile/tablet/desktop）で適切に表示されるか
- [ ] タッチターゲットが44px以上確保されているか
- [ ] フォントサイズが各デバイスで読みやすいか

### 実装
- [ ] カスタムスクリーン（mobile/tablet/desktop）を使用しているか
- [ ] 既存のデザイントークンを活用しているか
- [ ] レスポンシブ画像でsrcsetを使用しているか
- [ ] パフォーマンスを考慮した実装になっているか

### アクセシビリティ
- [ ] キーボードナビゲーションが適切に動作するか
- [ ] フォーカス表示が明確に見えるか
- [ ] スクリーンリーダーで適切に読み上げられるか
- [ ] 色のコントラスト比が十分確保されているか

この設計書は既存のレスポンシブデザイン基盤（`src/tokens/`、`tailwind.config.js`、`docs/design-tokens/`）を基に作成されており、実装済みの機能を活用してスマホファーストの一貫したユーザー体験を提供します。
