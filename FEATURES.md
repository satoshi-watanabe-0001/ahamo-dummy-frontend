# ahamo-dummy-frontend 実装済み機能一覧

## 概要
このドキュメントでは、ahamo-dummy-frontendプロジェクトで実装済みの機能とデモ確認可能な機能を一覧化しています。

## デモ確認可能な機能

### 1. UIコンポーネントライブラリ
**説明**: アトミックデザインに基づいたUIコンポーネントのショーケース
**対応コンポーネント**: `ComponentShowcase.tsx`, `DemoLayout.tsx`
**API依存**: なし
**デモ内容**:
- Atomsコンポーネント（Button、Input、Label、Badge、Switch）
- Moleculesコンポーネント（Card、Tabs）
- Organismsコンポーネント（PlanComparison、Dialog）

### 2. プラン比較機能
**説明**: ahamoの料金プランを比較表示する機能
**対応コンポーネント**: `PlanComparison.tsx`, `PlanCard.tsx`, `PlanComparisonTable.tsx`
**API依存**: `planApi.getPlans()`
**デモ内容**:
- プランカードの表示（月額料金、データ容量、通話、SMS）
- プラン選択機能
- 料金比較表
- レスポンシブデザイン（モバイル・タブレット・デスクトップ対応）

### 3. デバイス管理機能（管理者向け）
**説明**: デバイス情報のCRUD操作とCSVインポート/エクスポート
**対応コンポーネント**: `AdminDeviceApp.tsx`, `DeviceManagement.tsx`
**API依存**: `adminDeviceApi.*`
**デモ内容**:
- デバイス一覧表示
- デバイス新規作成・編集・削除
- CSVファイルのインポート/エクスポート
- デバイス検索・フィルタリング

### 4. アクセシビリティ機能
**説明**: WCAG 2.1 AA準拠のアクセシビリティ機能
**対応コンポーネント**: `HighContrastToggle.tsx`, アクセシビリティフック群
**API依存**: なし
**デモ内容**:
- ハイコントラストモード切り替え
- キーボードナビゲーション
- フォーカス管理
- ライブリージョン（スクリーンリーダー対応）

### 5. エラーハンドリング・トースト通知
**説明**: ユーザーフレンドリーなエラー表示とフィードバック
**対応コンポーネント**: `ErrorBoundary.tsx`, `useToast.ts`, `Toast.tsx`
**API依存**: 全API呼び出し
**デモ内容**:
- API エラーの適切な表示
- 成功・警告・エラーのトースト通知
- エラー境界による例外処理

## 技術仕様

### フロントエンド技術スタック
- **フレームワーク**: React 18 + TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **状態管理**: React Hooks (useState, useEffect, useCallback)
- **HTTP クライアント**: Fetch API (カスタムApiClientクラス)

### API エンドポイント
- `/api/v1/plans` - プラン情報取得
- `/api/contracts` - 契約情報CRUD
- `/api/devices` - デバイス情報取得
- `/api/v1/admin/devices` - デバイス管理CRUD
- `/api/v1/admin/devices/export` - CSVエクスポート
- `/api/v1/admin/devices/import` - CSVインポート

### データ型
- **Plan**: 料金プラン情報（月額料金、データ容量、通話、SMS、特徴）
- **Device**: デバイス情報（名前、ブランド、カテゴリ、価格、仕様）
- **Contract**: 契約情報
- **AdminDeviceRequest**: デバイス作成・更新用リクエスト

## モック機能

### モック化対象
全てのAPI通信がモック化されており、フロントエンド単体で動作します：
- プラン情報の取得・表示
- デバイス情報のCRUD操作
- CSVインポート/エクスポート機能
- エラーハンドリングとローディング状態

### 環境変数による切り替え
```bash
# モックAPIを使用（開発時デフォルト）
VITE_USE_MOCK_API=true

# 実際のバックエンドAPIを使用
VITE_USE_MOCK_API=false
VITE_API_URL=http://localhost:8080
```

### データ永続化
ローカルストレージを使用してブラウザセッション間でのデータ永続化を実現。

## デモ実行方法

1. **依存関係のインストール**
   ```bash
   npm install
   ```

2. **モックモードでの起動**
   ```bash
   npm run dev
   ```

3. **アクセス**
   - ブラウザで `http://localhost:5173` にアクセス
   - 画面上部のトグルボタンで「デモモード」と「管理モード」を切り替え

4. **機能確認**
   - デモモード: UIコンポーネントとプラン比較機能
   - 管理モード: デバイス管理機能（CRUD、CSV操作）

## 今後の拡張予定
- ユーザー認証機能
- 契約管理機能のUI実装
- 多言語対応
- PWA対応
- テストカバレッジの向上
