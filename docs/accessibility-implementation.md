# アクセシビリティ実装ガイド

## 概要
SCRUM-33チケットに対応したWCAG 2.1 AA準拠のアクセシビリティ基盤実装。

## 実装内容

### 1. アクセシビリティユーティリティ
- `src/utils/accessibility/focusTrap.ts` - フォーカストラップ機能
- `src/utils/accessibility/ariaHelpers.ts` - ARIA属性管理
- `src/utils/accessibility/contrastHelpers.ts` - コントラスト比計算
- `src/utils/accessibility/keyboardHelpers.ts` - キーボード操作支援

### 2. カスタムフック
- `src/hooks/useKeyboardNavigation.ts` - キーボードナビゲーション
- `src/hooks/useFocusManagement.ts` - フォーカス管理
- `src/hooks/useLiveRegion.ts` - スクリーンリーダー対応
- `src/hooks/useHighContrast.ts` - ハイコントラストモード

### 3. ハイコントラストモード
- CSS変数による色の切り替え
- localStorage連携による設定永続化
- システム設定の自動検出

### 4. コンポーネント強化
- Button, Input, Label, Badge, Switch, Tabs等にARIA属性追加
- キーボードナビゲーション対応
- フォーカス管理機能

## 使用方法

### ハイコントラストトグル
```tsx
import { HighContrastToggle } from '@/components/ui/high-contrast-toggle';

<HighContrastToggle showLabel={true} />
```

### キーボードナビゲーション
```tsx
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

const { keyboardProps } = useKeyboardNavigation({
  onEnter: () => console.log('Enter pressed'),
  onEscape: () => console.log('Escape pressed'),
});

<div {...keyboardProps}>Content</div>
```

### フォーカス管理
```tsx
import { useFocusManagement } from '@/hooks/useFocusManagement';

const { containerRef, activateTrap, deactivateTrap } = useFocusManagement({
  autoFocus: true,
  restoreFocus: true,
});
```

### ライブリージョン
```tsx
import { useLiveRegion } from '@/hooks/useLiveRegion';

const { liveRegionRef, announce } = useLiveRegion({ politeness: 'polite' });

announce('メッセージをスクリーンリーダーに通知');
```

## WCAG 2.1 AA準拠項目

### キーボード操作
- すべての機能がキーボードのみで操作可能
- Tab、Enter、Space、Escape、矢印キーによるナビゲーション
- フォーカストラップによるモーダル内フォーカス制御

### スクリーンリーダー対応
- 適切なARIA属性の設定
- ライブリージョンによる動的コンテンツ通知
- セマンティックなHTML構造

### コントラスト比
- WCAG AA準拠の4.5:1以上のコントラスト比
- ハイコントラストモードによる視認性向上
- コントラスト比計算ユーティリティ

### レスポンシブ対応
- 200%ズーム時のレイアウト維持
- モバイル・タブレット・デスクトップ対応

### フォーカス表示
- 明確なフォーカスインジケーター
- focus-visible疑似クラスによる適切な表示制御

## テスト方法

### キーボードナビゲーション
1. Tabキーですべての要素にフォーカス可能
2. Enter/Spaceキーでボタン・リンクが動作
3. Escapeキーでモーダル・ドロップダウンが閉じる
4. 矢印キーでメニュー・タブ間移動

### スクリーンリーダー
1. NVDA/JAWSでコンテンツが適切に読み上げられる
2. 動的コンテンツ変更が通知される
3. フォーム要素のラベル・エラーが読み上げられる

### コントラスト比
1. ブラウザ開発者ツールでコントラスト比確認
2. ハイコントラストモード切り替え動作確認

### ズーム対応
1. ブラウザズーム200%でレイアウト確認
2. 横スクロールが発生しないことを確認
