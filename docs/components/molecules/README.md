# Molecules - 複合コンポーネント

複数のAtomsを組み合わせた機能的なコンポーネントです。特定の目的を持った再利用可能なUIパーツを提供します。

## 📋 コンポーネント一覧

| コンポーネント | 説明 | 構成要素 | 主な用途 |
|---------------|------|----------|----------|
| [Card](./card.md) | カード | Header, Content, Footer | 情報グループ化 |
| [Form](./form.md) | フォーム | Label, Input, Button | データ入力 |
| [Tabs](./tabs.md) | タブ | TabsList, TabsTrigger, TabsContent | コンテンツ切り替え |
| [Select](./select.md) | セレクトボックス | Trigger, Content, Item | 選択肢から選択 |
| [Accordion](./accordion.md) | アコーディオン | Item, Trigger, Content | 折りたたみ表示 |
| [Breadcrumb](./breadcrumb.md) | パンくずリスト | List, Item, Link | ナビゲーション |

## 🎯 設計原則

### 機能的結合
各Moleculeは特定の機能を持つ完結したコンポーネントです。
- Card: 関連情報のグループ化
- Form: データ入力とバリデーション
- Tabs: コンテンツの整理と切り替え

### 構成可能性
Atomsを組み合わせて柔軟にカスタマイズできます。
- 必要な部分のみを使用可能
- プロパティによる動作制御
- スタイルのカスタマイズ対応

### 一貫性
全てのMoleculeで統一されたAPI設計です。
- 共通のプロパティ命名規則
- 統一されたイベントハンドリング
- 一貫したスタイリング手法

## 💡 基本的な使用方法

### インポート
```typescript
import { 
  Card, 
  CardHeader, 
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

### 基本的な使用例
```typescript
function MoleculeExample() {
  return (
    <div className="space-y-6">
      {/* カードコンポーネント */}
      <Card>
        <CardHeader>
          <h3>ahamoベーシック</h3>
        </CardHeader>
        <CardContent>
          <p>20GB + 5分かけ放題</p>
          <p className="text-2xl font-bold">¥2,970/月</p>
        </CardContent>
        <CardFooter>
          <Button variant="primary">申し込み</Button>
        </CardFooter>
      </Card>
      
      {/* タブコンポーネント */}
      <Tabs defaultValue="plan">
        <TabsList>
          <TabsTrigger value="plan">プラン</TabsTrigger>
          <TabsTrigger value="device">端末</TabsTrigger>
          <TabsTrigger value="option">オプション</TabsTrigger>
        </TabsList>
        <TabsContent value="plan">
          プラン選択画面
        </TabsContent>
        <TabsContent value="device">
          端末選択画面
        </TabsContent>
        <TabsContent value="option">
          オプション選択画面
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

## 🎨 スタイリング

### デザイントークンの活用
```typescript
// 統一されたスペーシング
<Card className="p-6 space-y-4">
  <CardHeader className="pb-2">
    <h3>タイトル</h3>
  </CardHeader>
  <CardContent className="space-y-2">
    <p>内容</p>
  </CardContent>
</Card>
```

### レスポンシブ対応
```typescript
<Card className="mobile:p-4 tablet:p-6 desktop:p-8">
  <CardContent className="mobile:space-y-2 desktop:space-y-4">
    レスポンシブコンテンツ
  </CardContent>
</Card>
```

## 🔧 カスタマイズ

### 新しいバリアントの追加
```typescript
// Card コンポーネントの拡張例
const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "",
        elevated: "shadow-lg",
        outlined: "border-2",
        filled: "bg-primary text-primary-foreground"
      }
    }
  }
);
```

### 複合コンポーネントの作成
```typescript
// プラン選択カードの作成
interface PlanCardProps {
  title: string;
  description: string;
  price: string;
  popular?: boolean;
  onSelect: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  description,
  price,
  popular,
  onSelect
}) => {
  return (
    <Card className={popular ? "border-primary" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          {popular && <Badge variant="default">人気</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
        <p className="text-2xl font-bold mt-2">{price}</p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="primary" 
          className="w-full"
          onClick={onSelect}
        >
          選択
        </Button>
      </CardFooter>
    </Card>
  );
};
```

## 📱 レスポンシブ対応

### グリッドレイアウト
```typescript
function ResponsiveCards() {
  return (
    <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
      <Card>カード1</Card>
      <Card>カード2</Card>
      <Card>カード3</Card>
    </div>
  );
}
```

### モバイル最適化
```typescript
function MobileOptimizedTabs() {
  return (
    <Tabs defaultValue="tab1">
      <TabsList className="mobile:w-full mobile:grid mobile:grid-cols-3">
        <TabsTrigger value="tab1">タブ1</TabsTrigger>
        <TabsTrigger value="tab2">タブ2</TabsTrigger>
        <TabsTrigger value="tab3">タブ3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1" className="mobile:p-4">
        モバイル最適化コンテンツ1
      </TabsContent>
    </Tabs>
  );
}
```

## ♿ アクセシビリティ

### キーボードナビゲーション
```typescript
// タブのキーボード操作
<Tabs defaultValue="tab1">
  <TabsList role="tablist">
    <TabsTrigger 
      value="tab1" 
      role="tab"
      aria-selected={activeTab === 'tab1'}
    >
      タブ1
    </TabsTrigger>
  </TabsList>
  <TabsContent 
    value="tab1" 
    role="tabpanel"
    aria-labelledby="tab1"
  >
    コンテンツ1
  </TabsContent>
</Tabs>
```

### スクリーンリーダー対応
```typescript
// フォームのアクセシビリティ
<form>
  <div>
    <Label htmlFor="email">メールアドレス</Label>
    <Input
      id="email"
      type="email"
      aria-describedby="email-help"
      aria-required="true"
    />
    <p id="email-help" className="text-sm text-gray-600">
      ログインに使用するメールアドレスを入力してください
    </p>
  </div>
</form>
```

## 🧪 テスト

### 統合テスト例
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/molecules';

describe('Tabs', () => {
  test('タブの切り替えが正常に動作する', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">タブ1</TabsTrigger>
          <TabsTrigger value="tab2">タブ2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">コンテンツ1</TabsContent>
        <TabsContent value="tab2">コンテンツ2</TabsContent>
      </Tabs>
    );
    
    expect(screen.getByText('コンテンツ1')).toBeVisible();
    expect(screen.queryByText('コンテンツ2')).not.toBeVisible();
    
    fireEvent.click(screen.getByText('タブ2'));
    
    expect(screen.queryByText('コンテンツ1')).not.toBeVisible();
    expect(screen.getByText('コンテンツ2')).toBeVisible();
  });
});
```

## 🎯 ベストプラクティス

### 適切な構成
```typescript
// 良い例：論理的な構成
<Card>
  <CardHeader>
    <CardTitle>タイトル</CardTitle>
    <CardDescription>説明</CardDescription>
  </CardHeader>
  <CardContent>
    メインコンテンツ
  </CardContent>
  <CardFooter>
    <Button>アクション</Button>
  </CardFooter>
</Card>

// 避けるべき例：不適切な構成
<Card>
  <CardFooter>
    <Button>アクション</Button>
  </CardFooter>
  <CardHeader>
    <CardTitle>タイトル</CardTitle>
  </CardHeader>
</Card>
```

### パフォーマンス最適化
```typescript
// 遅延読み込み
const LazyTabContent = lazy(() => import('./HeavyTabContent'));

<TabsContent value="heavy">
  <Suspense fallback={<Skeleton />}>
    <LazyTabContent />
  </Suspense>
</TabsContent>
```

## 📚 関連ドキュメント

- [Atoms](../atoms/) - 構成要素となる基本コンポーネント
- [Organisms](../organisms/) - より複雑なコンポーネント
- [デザイントークン](../../design-tokens/) - スタイリングの基盤
- [使用例](../../examples/) - 実践的な使用方法
