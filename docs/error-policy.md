# エラーハンドリングポリシー

## 概要
オンライン契約システム全体で一貫したエラー体験を提供するための統一エラーハンドリングポリシーです。技術的なエラーをユーザーフレンドリーなメッセージに変換し、適切なガイダンスを提供します。

## エラー分類システム

### 重要度による分類
- **CRITICAL（🚨）**: システム継続不可、ユーザーアクション必須
- **WARNING（⚠️）**: 操作失敗、システム継続可能
- **INFO（ℹ️）**: 非ブロッキング、改善提案

### エラーコード体系
| エラーコード | 重要度 | メッセージ | 解決方法 |
|-------------|--------|-----------|----------|
| VALIDATION_ERROR | WARNING | 入力内容に不備があります | 入力内容を確認して再度お試しください |
| INVALID_FORMAT | WARNING | フォーマットが正しくありません | 正しい形式で入力してください |
| UNAUTHORIZED | WARNING | 認証が必要です | ログインしてから再度お試しください |
| FORBIDDEN | WARNING | この操作を実行する権限がありません | 管理者にお問い合わせください |
| INTERNAL_ERROR | CRITICAL | 内部サーバーエラーが発生しました | しばらく時間をおいて再度お試しください |
| SERVICE_UNAVAILABLE | CRITICAL | サービスが一時的に利用できません | しばらく時間をおいて再度お試しください |
| NOT_FOUND | WARNING | 指定されたリソースが見つかりません | URLを確認して再度お試しください |
| CONFLICT | WARNING | データの競合が発生しました | ページをリロードして再度お試しください |

## リトライポリシー

### 自動リトライ対象
- ネットワークエラー（status: 0）
- タイムアウトエラー
- サーバーエラー（5xx応答）

### リトライ戦略
- **最大回数**: 3回
- **バックオフ**: 指数バックオフ（1秒 → 2秒 → 4秒）
- **対象外**: 4xx応答（クライアントエラー）

```typescript
// リトライロジックの実装例
const delay = Math.pow(2, retries) * 1000;
await new Promise(resolve => setTimeout(resolve, delay));
```

## 表示ポリシー

### トースト通知
- **CRITICAL**: 赤色背景、🚨アイコン、自動消去なし
- **WARNING**: 黄色背景、⚠️アイコン、5秒後自動消去
- **INFO**: 青色背景、ℹ️アイコン、3秒後自動消去

### エラーメッセージガイドライン
1. **平易な日本語**: 技術的専門用語を避ける
2. **具体的な説明**: 何が起きたかを明確に説明
3. **解決方法の提示**: 具体的なアクションを指示
4. **適切なトーン**: 重大なエラーは中立的、情報レベルは軽めのトーン

## 実装ガイドライン

### フロントエンド実装

#### 基本的なエラーハンドリング
```typescript
import { useApi } from '@/hooks/useApi';

// useApiフックが自動的にエラーハンドリングを行う
const { data, loading, error } = useApi('/api/devices');

// 手動でエラーハンドリングが必要な場合
try {
  const response = await apiCall();
  // 成功処理
} catch (error) {
  // useApiフックが自動的にトースト通知を表示
  // 追加の処理が必要な場合のみここに記述
}
```

#### エラー境界の使用
```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

#### カスタムエラーハンドリング
```typescript
import { toast } from '@/hooks/use-toast';
import { getErrorMessage, getErrorIcon } from '@/utils/errorUtils';

// カスタムエラー表示
const handleError = (error: ApiError) => {
  toast({
    title: getErrorMessage(error),
    description: error.resolution,
    variant: error.severity === 'CRITICAL' ? 'destructive' : 'default',
  });
};
```

### バックエンド実装

#### 統一エラーレスポンス形式
```json
{
  "error_code": "VALIDATION_ERROR",
  "message": "入力内容に不備があります",
  "severity": "WARNING",
  "resolution": "入力内容を確認して再度お試しください",
  "details": [...],
  "request_id": "uuid",
  "timestamp": "2024-01-01T00:00:00"
}
```

#### GlobalExceptionHandlerの使用
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(ValidationException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error_code", ErrorCode.VALIDATION_ERROR.name());
        errorResponse.put("message", ErrorCode.VALIDATION_ERROR.getDefaultMessage());
        errorResponse.put("severity", ErrorCode.VALIDATION_ERROR.getSeverity().name());
        errorResponse.put("resolution", ErrorCode.VALIDATION_ERROR.getResolution());
        // ...
        return ResponseEntity.badRequest().body(errorResponse);
    }
}
```

## ログ管理

### ログレベル
- **CRITICAL**: ERROR レベル
- **WARNING**: WARN レベル
- **INFO**: INFO レベル

### ログ形式
```json
{
  "timestamp": "2024-01-01T00:00:00Z",
  "level": "ERROR",
  "error_code": "INTERNAL_ERROR",
  "message": "内部サーバーエラーが発生しました",
  "request_id": "uuid",
  "user_id": "user123",
  "stack_trace": "..."
}
```

## 監視・アラート

### アラート条件
- **CRITICAL**エラーが発生した場合は即座にアラート
- **WARNING**エラーが閾値を超えた場合にアラート
- **INFO**エラーは統計情報として記録

### メトリクス
- エラー発生率（重要度別）
- リトライ成功率
- ユーザー体験指標（エラー解決率）

## ユーザー体験設計

### エラー表示の原則
1. **即座の通知**: エラー発生時に遅延なく表示
2. **明確な分類**: 重要度に応じた視覚的区別
3. **具体的な指示**: 次に取るべきアクションの明示
4. **一貫性**: 全画面で統一されたエラー表示

### アクセシビリティ
- スクリーンリーダー対応
- 色だけに依存しない情報伝達
- キーボードナビゲーション対応
- 適切なARIAラベル

## 受入条件

### 必須要件
- ✅ 全てのエラーが統一フォーマットで表示される
- ✅ エラーメッセージが平易な日本語で理解しやすい
- ✅ 各エラーに対して具体的な解決方法が提示される
- ✅ 致命的エラーと警告が適切に区別して表示される
- ✅ ネットワークエラー等の一時的エラーで自動リトライが動作する
- ✅ エラー発生時にログが適切に記録される

### 品質要件
- エラー表示の一貫性が保たれている
- ユーザビリティテストでエラーメッセージの理解度が80%以上
- 自動リトライによる成功率が向上している
- エラー監視・アラートが適切に機能している

## 今後の拡張

### 予定機能
- エラー通知システム（ErrorNotificationService）
- ユーザー行動分析に基づくエラーメッセージ最適化
- 多言語対応
- エラー解決ガイドの動的生成

### 技術的改善
- エラー予測機能
- 自動復旧メカニズム
- パフォーマンス最適化
- セキュリティ強化

## 関連ドキュメント

- [APIクライアント実装](../src/utils/api.ts)
- [エラーユーティリティ](../src/utils/errorUtils.ts)
- [トーストコンポーネント](../src/components/ui/toaster.tsx)
- [エラー境界コンポーネント](../src/components/ErrorBoundary.tsx)
- [useApiフック](../src/hooks/useApi.ts)

---

**更新日**: 2025-06-06  
**バージョン**: 1.0  
**担当**: 統一エラーハンドリングシステム実装チーム
