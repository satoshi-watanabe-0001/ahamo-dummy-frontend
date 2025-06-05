# NavigationMenu - ナビゲーションメニューコンポーネント

階層的なナビゲーションメニューを提供するコンポーネントです。

## 📋 概要

- **ファイルパス**: `src/components/ui/navigation-menu.tsx`
- **エクスポート**: `src/components/organisms/index.ts`
- **ベース**: Radix UI Navigation Menu

## 🏗️ 構成要素

### NavigationMenu（メインコンテナ）
ナビゲーションメニュー全体のコンテナ要素です。

### NavigationMenuList
メニュー項目を配置するリスト要素です。

### NavigationMenuItem
個別のメニュー項目です。

### NavigationMenuTrigger
メニューを開くトリガーボタンです。

### NavigationMenuContent
メニューの内容を表示するコンテンツ領域です。

### NavigationMenuLink
メニュー内のリンク要素です。

### NavigationMenuIndicator
アクティブなメニューを示すインジケーターです。

### NavigationMenuViewport
メニューコンテンツを表示するビューポートです。

## 🔧 プロパティ

```typescript
interface NavigationMenuProps extends React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> {
  className?: string;
}

interface NavigationMenuListProps extends React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List> {
  className?: string;
}

interface NavigationMenuTriggerProps extends React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger> {
  className?: string;
}

interface NavigationMenuContentProps extends React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content> {
  className?: string;
}
```

## 💡 使用例

### 基本的な使用方法

```typescript
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink
} from '@/components/organisms';

function BasicNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>プラン・料金</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px]">
              <div className="space-y-2">
                <h4 className="font-medium">ahamoベーシック</h4>
                <p className="text-sm text-gray-600">
                  20GB + 5分かけ放題 ¥2,970/月
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">ahamo大盛り</h4>
                <p className="text-sm text-gray-600">
                  100GB + 5分かけ放題 ¥4,950/月
                </p>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuLink href="/devices">
            端末
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuLink href="/support">
            サポート
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
```

### 複雑なナビゲーション

```typescript
function ComplexNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>プラン・料金</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[500px] grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-medium text-lg">料金プラン</h4>
                <div className="space-y-2">
                  <NavigationMenuLink href="/plans/basic" className="block p-2 hover:bg-gray-50 rounded">
                    <div className="font-medium">ahamoベーシック</div>
                    <div className="text-sm text-gray-600">20GB ¥2,970/月</div>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/plans/large" className="block p-2 hover:bg-gray-50 rounded">
                    <div className="font-medium">ahamo大盛り</div>
                    <div className="text-sm text-gray-600">100GB ¥4,950/月</div>
                  </NavigationMenuLink>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-lg">オプション</h4>
                <div className="space-y-2">
                  <NavigationMenuLink href="/options/calling" className="block p-2 hover:bg-gray-50 rounded">
                    <div className="font-medium">かけ放題オプション</div>
                    <div className="text-sm text-gray-600">¥1,100/月</div>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/options/data" className="block p-2 hover:bg-gray-50 rounded">
                    <div className="font-medium">データ追加</div>
                    <div className="text-sm text-gray-600">1GB ¥550</div>
                  </NavigationMenuLink>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>端末</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[600px] grid-cols-3">
              <div className="space-y-3">
                <h4 className="font-medium">iPhone</h4>
                <div className="space-y-2">
                  <NavigationMenuLink href="/devices/iphone-15-pro" className="block p-2 hover:bg-gray-50 rounded">
                    <div className="font-medium">iPhone 15 Pro</div>
                    <div className="text-sm text-gray-600">¥159,027〜</div>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/devices/iphone-15" className="block p-2 hover:bg-gray-50 rounded">
                    <div className="font-medium">iPhone 15</div>
                    <div className="text-sm text-gray-600">¥124,465〜</div>
                  </NavigationMenuLink>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Android</h4>
                <div className="space-y-2">
                  <NavigationMenuLink href="/devices/galaxy-s24" className="block p-2 hover:bg-gray-50 rounded">
                    <div className="font-medium">Galaxy S24</div>
                    <div className="text-sm text-gray-600">¥144,000〜</div>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/devices/xperia-1-v" className="block p-2 hover:bg-gray-50 rounded">
                    <div className="font-medium">Xperia 1 V</div>
                    <div className="text-sm text-gray-600">¥218,680〜</div>
                  </NavigationMenuLink>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">アクセサリー</h4>
                <div className="space-y-2">
                  <NavigationMenuLink href="/accessories/cases" className="block p-2 hover:bg-gray-50 rounded">
                    <div className="font-medium">ケース・カバー</div>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="/accessories/chargers" className="block p-2 hover:bg-gray-50 rounded">
                    <div className="font-medium">充電器</div>
                  </NavigationMenuLink>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>サポート</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px]">
              <NavigationMenuLink href="/support/faq" className="block p-3 hover:bg-gray-50 rounded">
                <div className="font-medium">よくある質問</div>
                <div className="text-sm text-gray-600">お客様からよくいただくご質問</div>
              </NavigationMenuLink>
              <NavigationMenuLink href="/support/contact" className="block p-3 hover:bg-gray-50 rounded">
                <div className="font-medium">お問い合わせ</div>
                <div className="text-sm text-gray-600">チャット・電話でのサポート</div>
              </NavigationMenuLink>
              <NavigationMenuLink href="/support/stores" className="block p-3 hover:bg-gray-50 rounded">
                <div className="font-medium">店舗検索</div>
                <div className="text-sm text-gray-600">お近くのドコモショップを検索</div>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
```

## 🎨 スタイルカスタマイズ

### カスタムスタイル

```typescript
<NavigationMenu className="bg-white shadow-md">
  <NavigationMenuList className="space-x-6">
    <NavigationMenuItem>
      <NavigationMenuTrigger className="text-lg font-medium">
        メニュー
      </NavigationMenuTrigger>
      <NavigationMenuContent className="min-w-[500px]">
        カスタムコンテンツ
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

## 📱 レスポンシブ対応

### モバイル対応

```typescript
function ResponsiveNavigationMenu() {
  return (
    <div>
      <NavigationMenu className="mobile:hidden tablet:flex desktop:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>プラン</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-4 w-[300px] tablet:w-[400px] desktop:w-[500px]">
                レスポンシブコンテンツ
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      
      <div className="mobile:block tablet:hidden desktop:hidden">
        <Button variant="outline" size="icon">
          <MenuIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
```

## ♿ アクセシビリティ

### キーボードナビゲーション

- **Tab**: メニュー項目間のフォーカス移動
- **Arrow Keys**: メニュー内の項目移動
- **Enter/Space**: メニューの開閉・項目選択
- **Escape**: メニューを閉じる

### ARIA属性

```typescript
function AccessibleNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList role="menubar" aria-label="メインナビゲーション">
        <NavigationMenuItem>
          <NavigationMenuTrigger
            role="menuitem"
            aria-haspopup="true"
            aria-expanded={isOpen}
          >
            プラン
          </NavigationMenuTrigger>
          <NavigationMenuContent
            role="menu"
            aria-label="プランメニュー"
          >
            <NavigationMenuLink
              href="/plans/basic"
              role="menuitem"
            >
              ahamoベーシック
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
```

## 🧪 テスト例

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent } from '@/components/organisms';

describe('NavigationMenu', () => {
  test('メニューの開閉が正常に動作する', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>メニュー</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div>メニューコンテンツ</div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    
    expect(screen.queryByText('メニューコンテンツ')).not.toBeVisible();
    
    fireEvent.click(screen.getByText('メニュー'));
    expect(screen.getByText('メニューコンテンツ')).toBeVisible();
  });
  
  test('キーボードナビゲーションが動作する', () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>メニュー1</NavigationMenuTrigger>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>メニュー2</NavigationMenuTrigger>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
    
    const menu1 = screen.getByText('メニュー1');
    const menu2 = screen.getByText('メニュー2');
    
    menu1.focus();
    fireEvent.keyDown(menu1, { key: 'ArrowRight' });
    
    expect(menu2).toHaveFocus();
  });
});
```

## 🎯 ベストプラクティス

### 適切なメニュー構造

```typescript
// 良い例：論理的なグループ化
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>商品・サービス</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid grid-cols-2 gap-4 p-6">
          <div>
            <h4>料金プラン</h4>
            <NavigationMenuLink href="/plans">プラン一覧</NavigationMenuLink>
          </div>
          <div>
            <h4>端末</h4>
            <NavigationMenuLink href="/devices">端末一覧</NavigationMenuLink>
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>

// 避けるべき例：無関係な項目の混在
<NavigationMenuContent>
  <NavigationMenuLink href="/plans">プラン</NavigationMenuLink>
  <NavigationMenuLink href="/weather">天気予報</NavigationMenuLink>
  <NavigationMenuLink href="/news">ニュース</NavigationMenuLink>
</NavigationMenuContent>
```

### パフォーマンス最適化

```typescript
// 遅延読み込み
const LazyMenuContent = lazy(() => import('./HeavyMenuContent'));

<NavigationMenuContent>
  <Suspense fallback={<Skeleton className="h-32 w-64" />}>
    <LazyMenuContent />
  </Suspense>
</NavigationMenuContent>
```

## 🔗 関連コンポーネント

- [Button](../atoms/button.md) - メニュー内のアクション
- [Card](../molecules/card.md) - メニューコンテンツの構造化
- [Sidebar](./sidebar.md) - モバイル用ナビゲーション
- [Breadcrumb](../molecules/breadcrumb.md) - 現在位置の表示
