# Tabs - タブコンポーネント

コンテンツを切り替えて表示するためのタブコンポーネントです。

## 📋 概要

- **ファイルパス**: `src/components/ui/tabs.tsx`
- **エクスポート**: `src/components/molecules/index.ts`
- **ベース**: Radix UI Tabs

## 🏗️ 構成要素

### Tabs（メインコンテナ）
タブ全体のコンテナ要素です。

### TabsList
タブのトリガーボタンを配置するリスト要素です。

### TabsTrigger
個別のタブボタンです。

### TabsContent
タブに対応するコンテンツ領域です。

## 🔧 プロパティ

```typescript
interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  className?: string;
}

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  value: string;
  className?: string;
}

interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
  value: string;
  className?: string;
}
```

## 💡 使用例

### 基本的な使用方法

```typescript
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/molecules';

function BasicTabs() {
  return (
    <Tabs defaultValue="plan">
      <TabsList>
        <TabsTrigger value="plan">プラン</TabsTrigger>
        <TabsTrigger value="device">端末</TabsTrigger>
        <TabsTrigger value="option">オプション</TabsTrigger>
      </TabsList>
      <TabsContent value="plan">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">プラン選択</h3>
          <p>お客様に最適なプランをお選びください。</p>
        </div>
      </TabsContent>
      <TabsContent value="device">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">端末選択</h3>
          <p>最新のスマートフォンからお選びください。</p>
        </div>
      </TabsContent>
      <TabsContent value="option">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">オプション</h3>
          <p>追加オプションをご確認ください。</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
```

### プラン比較タブ

```typescript
function PlanComparisonTabs() {
  return (
    <Tabs defaultValue="basic">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="basic">ahamoベーシック</TabsTrigger>
        <TabsTrigger value="large">ahamo大盛り</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>ahamoベーシック</CardTitle>
            <CardDescription>日常使いに最適な基本プラン</CardDescription>
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
              <div className="flex justify-between">
                <span>月額料金</span>
                <span className="text-2xl font-bold">¥2,970</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="large" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>ahamo大盛り</CardTitle>
            <CardDescription>たくさん使いたい方向けの大容量プラン</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>データ容量</span>
                <span className="font-semibold">100GB</span>
              </div>
              <div className="flex justify-between">
                <span>通話</span>
                <span className="font-semibold">5分かけ放題</span>
              </div>
              <div className="flex justify-between">
                <span>月額料金</span>
                <span className="text-2xl font-bold">¥4,950</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
```

### 制御されたタブ

```typescript
function ControlledTabs() {
  const [activeTab, setActiveTab] = useState('info');
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="info">基本情報</TabsTrigger>
        <TabsTrigger value="specs">仕様</TabsTrigger>
        <TabsTrigger value="reviews">レビュー</TabsTrigger>
      </TabsList>
      
      <TabsContent value="info">
        <div className="space-y-4">
          <h3>基本情報</h3>
          <p>製品の基本的な情報をご確認ください。</p>
        </div>
      </TabsContent>
      
      <TabsContent value="specs">
        <div className="space-y-4">
          <h3>詳細仕様</h3>
          <p>技術的な仕様の詳細です。</p>
        </div>
      </TabsContent>
      
      <TabsContent value="reviews">
        <div className="space-y-4">
          <h3>ユーザーレビュー</h3>
          <p>実際のユーザーからのレビューです。</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
```

### 縦向きタブ

```typescript
function VerticalTabs() {
  return (
    <Tabs defaultValue="account" orientation="vertical" className="flex space-x-4">
      <TabsList className="flex-col h-fit">
        <TabsTrigger value="account" className="w-full">アカウント</TabsTrigger>
        <TabsTrigger value="security" className="w-full">セキュリティ</TabsTrigger>
        <TabsTrigger value="notifications" className="w-full">通知</TabsTrigger>
        <TabsTrigger value="billing" className="w-full">請求</TabsTrigger>
      </TabsList>
      
      <div className="flex-1">
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>アカウント設定</CardTitle>
              <CardDescription>
                アカウント情報を管理します
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>アカウント設定の内容</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>セキュリティ設定</CardTitle>
              <CardDescription>
                パスワードとセキュリティオプション
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>セキュリティ設定の内容</p>
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
}
```

## 🎨 スタイルカスタマイズ

### カスタムスタイル

```typescript
// フルワイドタブ
<TabsList className="grid w-full grid-cols-3">
  <TabsTrigger value="tab1">タブ1</TabsTrigger>
  <TabsTrigger value="tab2">タブ2</TabsTrigger>
  <TabsTrigger value="tab3">タブ3</TabsTrigger>
</TabsList>

// 中央揃えタブ
<TabsList className="mx-auto">
  <TabsTrigger value="tab1">タブ1</TabsTrigger>
  <TabsTrigger value="tab2">タブ2</TabsTrigger>
</TabsList>

// カスタム背景
<TabsList className="bg-gray-100 dark:bg-gray-800">
  <TabsTrigger value="tab1">タブ1</TabsTrigger>
  <TabsTrigger value="tab2">タブ2</TabsTrigger>
</TabsList>
```

### アイコン付きタブ

```typescript
import { User, Settings, Bell, CreditCard } from 'lucide-react';

function IconTabs() {
  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile" className="flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span>プロフィール</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center space-x-2">
          <Settings className="w-4 h-4" />
          <span>設定</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center space-x-2">
          <Bell className="w-4 h-4" />
          <span>通知</span>
        </TabsTrigger>
        <TabsTrigger value="billing" className="flex items-center space-x-2">
          <CreditCard className="w-4 h-4" />
          <span>請求</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        プロフィール設定
      </TabsContent>
    </Tabs>
  );
}
```

## 📱 レスポンシブ対応

### モバイル最適化

```typescript
function ResponsiveTabs() {
  return (
    <Tabs defaultValue="tab1">
      <TabsList className="mobile:grid mobile:grid-cols-3 mobile:w-full tablet:inline-flex desktop:inline-flex">
        <TabsTrigger 
          value="tab1" 
          className="mobile:text-sm tablet:text-base"
        >
          タブ1
        </TabsTrigger>
        <TabsTrigger 
          value="tab2" 
          className="mobile:text-sm tablet:text-base"
        >
          タブ2
        </TabsTrigger>
        <TabsTrigger 
          value="tab3" 
          className="mobile:text-sm tablet:text-base"
        >
          タブ3
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="tab1" className="mobile:p-4 tablet:p-6">
        モバイル最適化コンテンツ1
      </TabsContent>
    </Tabs>
  );
}
```

### スクロール可能なタブ

```typescript
function ScrollableTabs() {
  return (
    <Tabs defaultValue="tab1">
      <div className="overflow-x-auto">
        <TabsList className="inline-flex min-w-max">
          <TabsTrigger value="tab1">タブ1</TabsTrigger>
          <TabsTrigger value="tab2">タブ2</TabsTrigger>
          <TabsTrigger value="tab3">タブ3</TabsTrigger>
          <TabsTrigger value="tab4">タブ4</TabsTrigger>
          <TabsTrigger value="tab5">タブ5</TabsTrigger>
          <TabsTrigger value="tab6">タブ6</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="tab1">
        スクロール可能なタブのコンテンツ
      </TabsContent>
    </Tabs>
  );
}
```

## ♿ アクセシビリティ

### キーボードナビゲーション

- **Tab**: タブリストにフォーカス
- **Arrow Keys**: タブ間の移動
- **Enter/Space**: タブの選択
- **Home**: 最初のタブに移動
- **End**: 最後のタブに移動

### ARIA属性

```typescript
function AccessibleTabs() {
  return (
    <Tabs defaultValue="tab1">
      <TabsList role="tablist" aria-label="設定メニュー">
        <TabsTrigger 
          value="tab1" 
          role="tab"
          aria-controls="tab1-content"
          aria-selected={activeTab === 'tab1'}
        >
          基本設定
        </TabsTrigger>
        <TabsTrigger 
          value="tab2" 
          role="tab"
          aria-controls="tab2-content"
          aria-selected={activeTab === 'tab2'}
        >
          詳細設定
        </TabsTrigger>
      </TabsList>
      
      <TabsContent 
        value="tab1" 
        role="tabpanel"
        id="tab1-content"
        aria-labelledby="tab1"
      >
        基本設定の内容
      </TabsContent>
      
      <TabsContent 
        value="tab2" 
        role="tabpanel"
        id="tab2-content"
        aria-labelledby="tab2"
      >
        詳細設定の内容
      </TabsContent>
    </Tabs>
  );
}
```

## 🧪 テスト例

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
  
  test('キーボードナビゲーションが動作する', () => {
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
    
    const tab1 = screen.getByText('タブ1');
    const tab2 = screen.getByText('タブ2');
    
    tab1.focus();
    fireEvent.keyDown(tab1, { key: 'ArrowRight' });
    
    expect(tab2).toHaveFocus();
  });
});
```

## 🎯 ベストプラクティス

### 適切なタブ数

```typescript
// 良い例：適切な数のタブ
<TabsList>
  <TabsTrigger value="overview">概要</TabsTrigger>
  <TabsTrigger value="details">詳細</TabsTrigger>
  <TabsTrigger value="reviews">レビュー</TabsTrigger>
</TabsList>

// 避けるべき例：多すぎるタブ
<TabsList>
  <TabsTrigger value="tab1">タブ1</TabsTrigger>
  <TabsTrigger value="tab2">タブ2</TabsTrigger>
  <TabsTrigger value="tab3">タブ3</TabsTrigger>
  <TabsTrigger value="tab4">タブ4</TabsTrigger>
  <TabsTrigger value="tab5">タブ5</TabsTrigger>
  <TabsTrigger value="tab6">タブ6</TabsTrigger>
  <TabsTrigger value="tab7">タブ7</TabsTrigger>
</TabsList>
```

### 明確なラベル

```typescript
// 良い例：分かりやすいラベル
<TabsTrigger value="personal">個人情報</TabsTrigger>
<TabsTrigger value="contact">連絡先</TabsTrigger>
<TabsTrigger value="preferences">設定</TabsTrigger>

// 避けるべき例：曖昧なラベル
<TabsTrigger value="tab1">その他</TabsTrigger>
<TabsTrigger value="tab2">詳細</TabsTrigger>
```

### パフォーマンス最適化

```typescript
// 遅延読み込み
const LazyTabContent = lazy(() => import('./HeavyTabContent'));

<TabsContent value="heavy">
  <Suspense fallback={<Skeleton className="h-32" />}>
    <LazyTabContent />
  </Suspense>
</TabsContent>
```

## 🔗 関連コンポーネント

- [Card](./card.md) - タブコンテンツの構造化
- [Button](../atoms/button.md) - タブ内のアクション
- [Accordion](./accordion.md) - 代替的な情報整理方法
- [NavigationMenu](../organisms/navigation-menu.md) - サイト全体のナビゲーション
