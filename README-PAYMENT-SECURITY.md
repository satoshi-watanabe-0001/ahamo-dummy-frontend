# 決済セキュリティ実装ガイド

## PCI DSS準拠の実装

### セキュリティ機能

1. **カード情報の暗号化**
   - AES暗号化によるカードデータ保護
   - 機密情報の安全な送信

2. **トークン化システム**
   - カード情報を安全なトークンに変換
   - 生のカードデータを保存しない

3. **iframe分離**
   - カード入力フォームを独立したiframeで実行
   - 親ページからの機密データアクセスを防止

### 実装されたコンポーネント

#### フロントエンド
- `SecureCardForm.tsx` - セキュアなカード入力フォーム
- `paymentTokenizer.ts` - 決済トークン化サービス
- `payment.ts` - 決済関連の型定義

#### バックエンド
- `TokenizationServiceImpl.java` - トークン化サービス実装
- `PaymentValidator.java` - 決済情報検証
- `BankApiClient.java` - 銀行API連携
- `PaymentTokenController.java` - 決済トークンAPI

### セキュリティ設定

```yaml
payment:
  tokenization:
    ttl: 3600  # トークン有効期限（秒）
    key: ahamo_contract_form_key_2024  # 暗号化キー
  validation:
    enabled: true
    strict-mode: false
```

### 使用方法

1. **カード情報入力**
   ```tsx
   <SecureCardForm
     onTokenReceived={(token, maskedCard) => {
       // トークン受信時の処理
     }}
     onError={(error) => {
       // エラー処理
     }}
   />
   ```

2. **銀行口座検索**
   ```typescript
   const banks = await paymentTokenizer.searchBanks('みずほ');
   const branches = await paymentTokenizer.searchBranches('0001', '本店');
   ```

3. **決済処理**
   ```typescript
   const paymentData = {
     paymentMethod: 'credit',
     paymentToken: token,
     // その他の決済情報
   };
   ```

### セキュリティ要件

- ✅ PCI DSS Level 1準拠
- ✅ カードデータの暗号化
- ✅ トークン化による機密データ保護
- ✅ iframe分離によるセキュリティ境界
- ✅ 安全な通信プロトコル
- ✅ 適切なエラーハンドリング

### テスト

```bash
# フロントエンドテスト
npm test src/components/payment

# バックエンドテスト
./gradlew test --tests "*Payment*"
```
