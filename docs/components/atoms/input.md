# Input - 入力フィールドコンポーネント

ユーザーからのテキスト入力を受け付けるための入力フィールドコンポーネントです。

## 📋 概要

- **ファイルパス**: `src/components/ui/input.tsx`
- **エクスポート**: `src/components/atoms/index.ts`
- **ベース**: HTML input要素

## 🔧 プロパティ

```typescript
interface InputProps extends React.ComponentProps<"input"> {
  className?: string;
  type?: string;
}
```

### 主要プロパティ

- **type**: 入力タイプ（text, email, password, tel, number等）
- **placeholder**: プレースホルダーテキスト
- **value**: 入力値
- **onChange**: 値変更イベントハンドラー
- **disabled**: 無効状態
- **required**: 必須入力
- **className**: 追加のCSSクラス

## 💡 使用例

### 基本的な使用方法

```typescript
import { Input } from '@/components/atoms';

function BasicInput() {
  const [value, setValue] = useState('');
  
  return (
    <Input
      type="text"
      placeholder="お名前を入力してください"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

### 入力タイプ別の使用例

```typescript
function InputTypes() {
  return (
    <div className="space-y-4">
      {/* テキスト入力 */}
      <Input
        type="text"
        placeholder="お名前"
      />
      
      {/* メールアドレス */}
      <Input
        type="email"
        placeholder="example@email.com"
      />
      
      {/* パスワード */}
      <Input
        type="password"
        placeholder="パスワード"
      />
      
      {/* 電話番号 */}
      <Input
        type="tel"
        placeholder="090-1234-5678"
      />
      
      {/* 数値 */}
      <Input
        type="number"
        placeholder="年齢"
        min="0"
        max="120"
      />
      
      {/* 日付 */}
      <Input
        type="date"
      />
    </div>
  );
}
```

### フォームでの使用

```typescript
import { useState } from 'react';
import { Input } from '@/components/atoms';
import { Label } from '@/components/atoms';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };
  
  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="name">お名前</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={handleChange('name')}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">メールアドレス</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="phone">電話番号</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange('phone')}
        />
      </div>
    </form>
  );
}
```

### バリデーション付きの使用

```typescript
import { useState } from 'react';

function ValidatedInput() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setError('メールアドレスは必須です');
    } else if (!emailRegex.test(value)) {
      setError('有効なメールアドレスを入力してください');
    } else {
      setError('');
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };
  
  return (
    <div>
      <Input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={handleChange}
        className={error ? 'border-red-500' : ''}
        aria-invalid={!!error}
        aria-describedby={error ? 'email-error' : undefined}
      />
      {error && (
        <p id="email-error" className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
```

## 🎨 スタイルカスタマイズ

### カスタムスタイル

```typescript
// サイズ調整
<Input 
  className="h-12 text-lg" 
  placeholder="大きな入力フィールド"
/>

// 幅調整
<Input 
  className="w-full max-w-md" 
  placeholder="幅制限付き"
/>

// エラー状態
<Input 
  className="border-red-500 focus:ring-red-500" 
  placeholder="エラー状態"
/>

// 成功状態
<Input 
  className="border-green-500 focus:ring-green-500" 
  placeholder="成功状態"
/>
```

### アイコン付き入力

```typescript
import { Search, Mail, Lock } from 'lucide-react';

function IconInputs() {
  return (
    <div className="space-y-4">
      {/* 左アイコン */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="検索..."
          className="pl-10"
        />
      </div>
      
      {/* 右アイコン */}
      <div className="relative">
        <Input
          type="email"
          placeholder="メールアドレス"
          className="pr-10"
        />
        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
}
```

## 📱 レスポンシブ対応

### モバイル最適化

```typescript
function ResponsiveInputs() {
  return (
    <div className="space-y-4">
      {/* モバイルで大きなタッチターゲット */}
      <Input
        type="text"
        placeholder="モバイル最適化"
        className="mobile:h-12 mobile:text-base tablet:h-10 desktop:h-9"
      />
      
      {/* レスポンシブ幅 */}
      <Input
        type="email"
        placeholder="レスポンシブ幅"
        className="mobile:w-full tablet:w-80 desktop:w-96"
      />
    </div>
  );
}
```

### 仮想キーボード対応

```typescript
// モバイルで適切なキーボードを表示
<Input
  type="email"
  inputMode="email"
  autoComplete="email"
  placeholder="メールアドレス"
/>

<Input
  type="tel"
  inputMode="tel"
  autoComplete="tel"
  placeholder="電話番号"
/>

<Input
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  placeholder="数値のみ"
/>
```

## ♿ アクセシビリティ

### ラベルとの関連付け

```typescript
function AccessibleInputs() {
  return (
    <div className="space-y-4">
      {/* Label要素との関連付け */}
      <div>
        <Label htmlFor="username">ユーザー名</Label>
        <Input
          id="username"
          type="text"
          aria-describedby="username-help"
        />
        <p id="username-help" className="text-sm text-gray-600">
          3文字以上で入力してください
        </p>
      </div>
      
      {/* aria-label の使用 */}
      <Input
        type="search"
        aria-label="サイト内検索"
        placeholder="検索キーワード"
      />
      
      {/* エラー状態の伝達 */}
      <Input
        type="email"
        aria-invalid={hasError}
        aria-describedby={hasError ? 'email-error' : undefined}
      />
    </div>
  );
}
```

### キーボードナビゲーション

- **Tab**: フォーカス移動
- **Shift + Tab**: 逆方向フォーカス移動
- **Enter**: フォーム送信（form内の場合）
- **Escape**: フォーカス解除

## 🧪 テスト例

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/atoms';

describe('Input', () => {
  test('値の入力と変更が正常に動作する', () => {
    const handleChange = jest.fn();
    render(
      <Input
        placeholder="テスト入力"
        onChange={handleChange}
      />
    );
    
    const input = screen.getByPlaceholderText('テスト入力');
    fireEvent.change(input, { target: { value: 'テスト値' } });
    
    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('テスト値');
  });
  
  test('disabled状態で入力できない', () => {
    render(
      <Input
        placeholder="無効入力"
        disabled
      />
    );
    
    const input = screen.getByPlaceholderText('無効入力');
    expect(input).toBeDisabled();
  });
  
  test('適切なtype属性が設定される', () => {
    render(<Input type="email" placeholder="メール" />);
    const input = screen.getByPlaceholderText('メール');
    expect(input).toHaveAttribute('type', 'email');
  });
});
```

## 🎯 ベストプラクティス

### 適切なtype属性の使用

```typescript
// 良い例
<Input type="email" placeholder="メールアドレス" />
<Input type="tel" placeholder="電話番号" />
<Input type="password" placeholder="パスワード" />

// 避けるべき例
<Input type="text" placeholder="メールアドレス" />  // emailを使うべき
```

### プレースホルダーの適切な使用

```typescript
// 良い例：具体的で分かりやすい
<Input placeholder="例: yamada@example.com" />
<Input placeholder="090-1234-5678" />

// 避けるべき例：曖昧
<Input placeholder="入力してください" />
```

### バリデーションメッセージ

```typescript
// 良い例：具体的で建設的
{error && (
  <p className="text-red-500 text-sm">
    有効なメールアドレスを入力してください（例: user@example.com）
  </p>
)}

// 避けるべき例：曖昧
{error && <p className="text-red-500">エラーです</p>}
```

## 🔗 関連コンポーネント

- [Label](./label.md) - 入力フィールドのラベル
- [Textarea](../molecules/textarea.md) - 複数行テキスト入力
- [Select](../molecules/select.md) - 選択肢から選択
- [Form](../molecules/form.md) - フォーム全体の管理
