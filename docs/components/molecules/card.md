# Card - カードコンポーネント

関連する情報をグループ化して表示するためのカードコンポーネントです。

## 📋 概要

- **ファイルパス**: `src/components/ui/card.tsx`
- **エクスポート**: `src/components/molecules/index.ts`
- **ベース**: HTML div要素

## 🏗️ 構成要素

### Card（メインコンテナ）
カード全体のコンテナ要素です。

### CardHeader
カードの上部に配置されるヘッダー部分です。

### CardTitle
カードのタイトルを表示します。

### CardDescription
カードの説明文を表示します。

### CardContent
カードのメインコンテンツを表示します。

### CardFooter
カードの下部に配置されるフッター部分です。

## 🔧 プロパティ

```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
```

## 💡 使用例

### 基本的な使用方法

```typescript
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/molecules';
import { Button } from '@/components/atoms';

function BasicCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ahamoベーシック</CardTitle>
        <CardDescription>
          スマートフォン向けの基本プラン
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>データ容量: 20GB</p>
          <p>通話: 5分かけ放題</p>
          <p className="text-2xl font-bold">¥2,970/月</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="primary" className="w-full">
          申し込み
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### プラン比較カード

```typescript
function PlanCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
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
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>データ容量</span>
              <span className="font-semibold">20GB</span>
            </div>
            <div className="flex justify-between">
              <span>通話</span>
              <span className="font-semibold">5分かけ放題</span>
            </div>
            <div className="flex justify-between">
              <span>海外ローミング</span>
              <span className="font-semibold">20GBまで無料</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg">月額料金</span>
                <span className="text-2xl font-bold">¥2,970</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="primary" className="w-full">
            このプランを選択
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>ahamo大盛り</CardTitle>
            <Badge variant="secondary">大容量</Badge>
          </div>
          <CardDescription>
            たくさん使いたい方向けの大容量プラン
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>データ容量</span>
              <span className="font-semibold">100GB</span>
            </div>
            <div className="flex justify-between">
              <span>通話</span>
              <span className="font-semibold">5分かけ放題</span>
            </div>
            <div className="flex justify-between">
              <span>海外ローミング</span>
              <span className="font-semibold">20GBまで無料</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg">月額料金</span>
                <span className="text-2xl font-bold">¥4,950</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            このプランを選択
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
```

### 端末情報カード

```typescript
function DeviceCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>iPhone 15 Pro</CardTitle>
        <CardDescription>
          最新のプロモデル
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <img 
            src="/iphone-15-pro.jpg" 
            alt="iPhone 15 Pro"
            className="w-full h-48 object-cover rounded-md"
          />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>容量</span>
              <span>128GB</span>
            </div>
            <div className="flex justify-between">
              <span>カラー</span>
              <span>ナチュラルチタニウム</span>
            </div>
            <div className="flex justify-between">
              <span>分割支払金</span>
              <span className="font-semibold">¥6,625/月</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>端末価格</span>
              <span className="font-bold">¥159,027</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="space-x-2">
        <Button variant="outline" className="flex-1">
          詳細を見る
        </Button>
        <Button variant="primary" className="flex-1">
          選択
        </Button>
      </CardFooter>
    </Card>
  );
}
```

### シンプルなカード

```typescript
function SimpleCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <CheckIcon className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold">申し込み完了</h3>
            <p className="text-gray-600">
              お申し込みが正常に完了しました
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

## 🎨 スタイルカスタマイズ

### カスタムスタイル

```typescript
// 影を強調
<Card className="shadow-lg hover:shadow-xl transition-shadow">
  <CardContent>強調されたカード</CardContent>
</Card>

// 境界線を強調
<Card className="border-2 border-primary-200">
  <CardContent>境界線強調カード</CardContent>
</Card>

// 背景色変更
<Card className="bg-gradient-to-r from-blue-50 to-purple-50">
  <CardContent>グラデーション背景</CardContent>
</Card>
```

### インタラクティブカード

```typescript
function InteractiveCard() {
  const [selected, setSelected] = useState(false);
  
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        selected ? 'border-primary-500 bg-primary-50' : ''
      }`}
      onClick={() => setSelected(!selected)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span>選択可能なカード</span>
          {selected && <CheckIcon className="w-5 h-5 text-primary-600" />}
        </div>
      </CardContent>
    </Card>
  );
}
```

## 📱 レスポンシブ対応

### レスポンシブレイアウト

```typescript
function ResponsiveCards() {
  return (
    <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
      <Card className="mobile:p-4 tablet:p-6">
        <CardHeader className="mobile:pb-2 tablet:pb-4">
          <CardTitle className="mobile:text-lg tablet:text-xl">
            レスポンシブタイトル
          </CardTitle>
        </CardHeader>
        <CardContent className="mobile:space-y-2 tablet:space-y-4">
          <p>レスポンシブコンテンツ</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

## ♿ アクセシビリティ

### セマンティックHTML

```typescript
function AccessibleCard() {
  return (
    <Card role="article" aria-labelledby="card-title">
      <CardHeader>
        <CardTitle id="card-title">
          アクセシブルなカード
        </CardTitle>
        <CardDescription>
          スクリーンリーダーに対応したカード
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>カードの内容</p>
      </CardContent>
      <CardFooter>
        <Button aria-describedby="card-title">
          アクション
        </Button>
      </CardFooter>
    </Card>
  );
}
```

## 🧪 テスト例

```typescript
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/molecules';

describe('Card', () => {
  test('カードの内容が正しく表示される', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>テストタイトル</CardTitle>
        </CardHeader>
        <CardContent>
          テストコンテンツ
        </CardContent>
      </Card>
    );
    
    expect(screen.getByText('テストタイトル')).toBeInTheDocument();
    expect(screen.getByText('テストコンテンツ')).toBeInTheDocument();
  });
  
  test('カスタムクラスが適用される', () => {
    render(
      <Card className="custom-class">
        <CardContent>テスト</CardContent>
      </Card>
    );
    
    const card = screen.getByText('テスト').closest('div');
    expect(card).toHaveClass('custom-class');
  });
});
```

## 🎯 ベストプラクティス

### 適切な構成

```typescript
// 良い例：論理的な順序
<Card>
  <CardHeader>
    <CardTitle>タイトル</CardTitle>
    <CardDescription>説明</CardDescription>
  </CardHeader>
  <CardContent>
    メインコンテンツ
  </CardContent>
  <CardFooter>
    アクション
  </CardFooter>
</Card>

// 避けるべき例：不適切な順序
<Card>
  <CardFooter>アクション</CardFooter>
  <CardHeader>タイトル</CardHeader>
  <CardContent>コンテンツ</CardContent>
</Card>
```

### 適切なコンテンツ

```typescript
// 良い例：関連する情報をグループ化
<Card>
  <CardHeader>
    <CardTitle>プラン名</CardTitle>
  </CardHeader>
  <CardContent>
    <p>データ容量: 20GB</p>
    <p>通話: 5分かけ放題</p>
    <p>料金: ¥2,970/月</p>
  </CardContent>
</Card>

// 避けるべき例：無関係な情報の混在
<Card>
  <CardContent>
    <p>プラン情報</p>
    <p>天気予報</p>
    <p>ニュース</p>
  </CardContent>
</Card>
```

## 🔗 関連コンポーネント

- [Button](../atoms/button.md) - カード内のアクション
- [Badge](../atoms/badge.md) - ステータス表示
- [Tabs](./tabs.md) - カード内のコンテンツ切り替え
- [Dialog](../organisms/dialog.md) - カードの詳細表示
