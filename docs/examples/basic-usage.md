# 基本的な使用方法

UIコンポーネントライブラリの基本的な使用方法を説明します。

## 📦 インストールと設定

### 前提条件
- Node.js 18以上
- React 18以上
- TypeScript 4.9以上

### プロジェクトセットアップ
```bash
# プロジェクトのクローン
git clone https://github.com/satoshi-watanabe-0001/ahamo-dummy-frontend.git
cd ahamo-dummy-frontend

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 🔧 基本的なインポート

### Atomsのインポート
```typescript
import { Button, Input, Badge, Switch, Checkbox } from '@/components/atoms';
```

### Moleculesのインポート
```typescript
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '@/components/molecules';

import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/molecules';
```

### Organismsのインポート
```typescript
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent
} from '@/components/organisms';
```

## 💡 基本的な使用例

### ボタンの使用

```typescript
import { Button } from '@/components/atoms';

function ButtonExample() {
  return (
    <div className="space-x-2">
      {/* 基本的なボタン */}
      <Button variant="primary">
        申し込み
      </Button>
      
      {/* セカンダリボタン */}
      <Button variant="secondary">
        詳細を見る
      </Button>
      
      {/* アウトラインボタン */}
      <Button variant="outline">
        キャンセル
      </Button>
      
      {/* 危険なアクション */}
      <Button variant="destructive">
        削除
      </Button>
      
      {/* 無効状態 */}
      <Button disabled>
        無効
      </Button>
    </div>
  );
}
```

### 入力フィールドの使用

```typescript
import { Input, Label } from '@/components/atoms';
import { useState } from 'react';

function InputExample() {
  const [value, setValue] = useState('');
  
  return (
    <div className="space-y-4">
      {/* 基本的な入力 */}
      <div>
        <Label htmlFor="name">お名前</Label>
        <Input
          id="name"
          type="text"
          placeholder="山田太郎"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      
      {/* メールアドレス */}
      <div>
        <Label htmlFor="email">メールアドレス</Label>
        <Input
          id="email"
          type="email"
          placeholder="example@email.com"
        />
      </div>
      
      {/* パスワード */}
      <div>
        <Label htmlFor="password">パスワード</Label>
        <Input
          id="password"
          type="password"
          placeholder="パスワードを入力"
        />
      </div>
    </div>
  );
}
```

### カードの使用

```typescript
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent, 
  CardFooter 
} from '@/components/molecules';
import { Button, Badge } from '@/components/atoms';

function CardExample() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>ahamoベーシック</CardTitle>
          <Badge variant="default">人気</Badge>
        </div>
        <CardDescription>
          日常使いに最適な基本プラン
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>データ容量</span>
            <span className="font-semibold">20GB</span>
          </div>
          <div className="flex justify-between">
            <span>通話</span>
            <span className="font-semibold">5分かけ放題</span>
          </div>
          <div className="flex justify-between text-lg">
            <span>月額料金</span>
            <span className="font-bold">¥2,970</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="primary" className="w-full">
          このプランを選択
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### タブの使用

```typescript
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@/components/molecules';

function TabsExample() {
  return (
    <Tabs defaultValue="plan" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="plan">プラン</TabsTrigger>
        <TabsTrigger value="device">端末</TabsTrigger>
        <TabsTrigger value="option">オプション</TabsTrigger>
      </TabsList>
      
      <TabsContent value="plan" className="space-y-4">
        <h3 className="text-lg font-semibold">プラン選択</h3>
        <p>お客様に最適なプランをお選びください。</p>
      </TabsContent>
      
      <TabsContent value="device" className="space-y-4">
        <h3 className="text-lg font-semibold">端末選択</h3>
        <p>最新のスマートフォンからお選びください。</p>
      </TabsContent>
      
      <TabsContent value="option" className="space-y-4">
        <h3 className="text-lg font-semibold">オプション</h3>
        <p>追加オプションをご確認ください。</p>
      </TabsContent>
    </Tabs>
  );
}
```

## 🎨 スタイリング

### Tailwind CSSクラスの使用

```typescript
// 基本的なスタイリング
<Button className="w-full shadow-lg">
  フルワイドボタン
</Button>

// レスポンシブスタイリング
<Card className="mobile:p-4 tablet:p-6 desktop:p-8">
  レスポンシブカード
</Card>

// 状態に応じたスタイリング
<Button 
  className={`
    ${isActive ? 'bg-primary-600' : 'bg-gray-200'}
    transition-colors duration-200
  `}
>
  状態変化ボタン
</Button>
```

### カスタムスタイルの適用

```typescript
// カスタムカラー
<Badge className="bg-green-500 text-white">
  カスタムバッジ
</Badge>

// カスタムサイズ
<Input className="h-12 text-lg">
  大きな入力フィールド
</Input>

// カスタムレイアウト
<Card className="flex flex-row items-center space-x-4">
  <div className="flex-shrink-0">
    <img src="..." className="w-16 h-16 rounded-full" />
  </div>
  <div className="flex-1">
    <CardContent>
      横並びカード
    </CardContent>
  </div>
</Card>
```

## 🔄 状態管理

### useState との組み合わせ

```typescript
import { useState } from 'react';
import { Button, Input, Switch } from '@/components/atoms';

function StateExample() {
  const [text, setText] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitData(text);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="テキストを入力"
      />
      
      <Switch
        checked={isEnabled}
        onCheckedChange={setIsEnabled}
      />
      
      <Button
        onClick={handleSubmit}
        disabled={loading || !text}
      >
        {loading ? '送信中...' : '送信'}
      </Button>
    </div>
  );
}
```

## 🎯 イベントハンドリング

### クリックイベント

```typescript
function EventExample() {
  const handleClick = () => {
    console.log('ボタンがクリックされました');
  };
  
  const handleCardClick = (planId: string) => {
    console.log(`プラン ${planId} が選択されました`);
  };
  
  return (
    <div className="space-y-4">
      <Button onClick={handleClick}>
        クリックイベント
      </Button>
      
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => handleCardClick('basic')}
      >
        <CardContent>
          クリック可能なカード
        </CardContent>
      </Card>
    </div>
  );
}
```

### フォームイベント

```typescript
function FormExample() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    console.log('フォームデータ:', Object.fromEntries(formData));
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="name" placeholder="お名前" required />
      <Input name="email" type="email" placeholder="メールアドレス" required />
      <Button type="submit">送信</Button>
    </form>
  );
}
```

## 🔧 TypeScript の活用

### 型安全なプロパティ

```typescript
interface PlanCardProps {
  title: string;
  description: string;
  price: number;
  popular?: boolean;
  onSelect: (planId: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  description,
  price,
  popular = false,
  onSelect
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {popular && <Badge variant="default">人気</Badge>}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">¥{price.toLocaleString()}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onSelect(title)} className="w-full">
          選択
        </Button>
      </CardFooter>
    </Card>
  );
};
```

## 🧪 基本的なテスト

### コンポーネントテスト

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/atoms';

test('ボタンクリックが正常に動作する', () => {
  const handleClick = jest.fn();
  
  render(
    <Button onClick={handleClick}>
      テストボタン
    </Button>
  );
  
  fireEvent.click(screen.getByText('テストボタン'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('入力値が正しく表示される', () => {
  render(<Input placeholder="テスト入力" />);
  
  const input = screen.getByPlaceholderText('テスト入力');
  fireEvent.change(input, { target: { value: 'テスト値' } });
  
  expect(input).toHaveValue('テスト値');
});
```

## 📚 次のステップ

基本的な使用方法を理解したら、以下のガイドも参照してください：

- [コンポーネント組み合わせパターン](./composition-patterns.md)
- [レスポンシブデザイン](./responsive-design.md)
- [アクセシビリティガイドライン](./accessibility.md)
