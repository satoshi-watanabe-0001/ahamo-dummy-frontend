# Organisms - 複雑なコンポーネント

複数のMoleculesを組み合わせた複雑で高機能なコンポーネントです。ページレベルの機能を提供します。

## 📋 コンポーネント一覧

| コンポーネント | 説明 | 構成要素 | 主な用途 |
|---------------|------|----------|----------|
| [NavigationMenu](./navigation-menu.md) | ナビゲーションメニュー | Menu, List, Item, Trigger | サイトナビゲーション |
| [Dialog](./dialog.md) | ダイアログ・モーダル | Trigger, Content, Header, Footer | 重要な操作・情報 |
| [Table](./table.md) | テーブル | Header, Body, Row, Cell | データ表示 |
| [Sidebar](./sidebar.md) | サイドバー | Trigger, Content, Header, Footer | サイドナビゲーション |
| [Command](./command.md) | コマンドパレット | Input, List, Item, Group | 検索・コマンド実行 |

## 🎯 設計原則

### 高度な機能性
各Organismは複雑な機能を持つ完結したコンポーネントです。
- NavigationMenu: 階層的なナビゲーション
- Dialog: モーダル操作とフォーカス管理
- Table: データの表示と操作

### 状態管理
内部状態を持ち、複雑なインタラクションを管理します。
- 開閉状態の管理
- フォーカス状態の制御
- データの表示・編集状態

### アクセシビリティ
高度なアクセシビリティ機能を内蔵しています。
- キーボードナビゲーション
- スクリーンリーダー対応
- ARIA属性の適切な使用

## 💡 基本的な使用方法

### インポート
```typescript
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent
} from '@/components/organisms';

import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/organisms';
```

### 基本的な使用例
```typescript
function OrganismExample() {
  return (
    <div className="space-y-8">
      {/* ナビゲーションメニュー */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>プラン</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid gap-3 p-6 w-[400px]">
                <div className="space-y-2">
                  <h4 className="font-medium">ahamoベーシック</h4>
                  <p className="text-sm text-gray-600">
                    20GB + 5分かけ放題
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">ahamo大盛り</h4>
                  <p className="text-sm text-gray-600">
                    100GB + 5分かけ放題
                  </p>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      
      {/* ダイアログ */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">申し込み確認</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>申し込み内容の確認</DialogTitle>
            <DialogDescription>
              以下の内容で申し込みを行います。よろしいですか？
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>プラン</span>
              <span>ahamoベーシック</span>
            </div>
            <div className="flex justify-between">
              <span>月額料金</span>
              <span>¥2,970</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline">キャンセル</Button>
            <Button variant="primary">申し込み</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

## 🎨 スタイリング

### テーマ対応
```typescript
// ダークモード対応
<NavigationMenu className="dark:bg-gray-900 dark:text-white">
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger className="dark:hover:bg-gray-800">
        メニュー
      </NavigationMenuTrigger>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

### カスタムスタイル
```typescript
// カスタムダイアログ
<Dialog>
  <DialogContent className="max-w-2xl">
    <DialogHeader className="text-center">
      <DialogTitle className="text-2xl">
        特別なダイアログ
      </DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

## 🔧 高度な使用例

### 複雑なナビゲーション
```typescript
function ComplexNavigation() {
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
                  <a href="/plans/basic" className="block p-2 hover:bg-gray-50 rounded">
                    <div className="font-medium">ahamoベーシック</div>
                    <div className="text-sm text-gray-600">20GB ¥2,970/月</div>
                  </a>
                  <a href="/plans/large" className="block p-2 hover:bg-gray-50 rounded">
                    <div className="font-medium">ahamo大盛り</div>
                    <div className="text-sm text-gray-600">100GB ¥4,950/月</div>
                  </a>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-lg">オプション</h4>
                <div className="space-y-2">
                  <a href="/options/calling" className="block p-2 hover:bg-gray-50 rounded">
                    <div className="font-medium">かけ放題オプション</div>
                    <div className="text-sm text-gray-600">¥1,100/月</div>
                  </a>
                  <a href="/options/data" className="block p-2 hover:bg-gray-50 rounded">
                    <div className="font-medium">データ追加</div>
                    <div className="text-sm text-gray-600">1GB ¥550</div>
                  </a>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
```

### フォーム付きダイアログ
```typescript
function FormDialog() {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>お問い合わせ</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>お問い合わせ</DialogTitle>
          <DialogDescription>
            ご質問やご要望をお聞かせください
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <div>
            <Label htmlFor="name">お名前</Label>
            <Input id="name" placeholder="山田太郎" />
          </div>
          <div>
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" type="email" placeholder="example@email.com" />
          </div>
          <div>
            <Label htmlFor="message">お問い合わせ内容</Label>
            <Textarea id="message" placeholder="ご質問内容をご記入ください" />
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            キャンセル
          </Button>
          <Button type="submit">送信</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## 📱 レスポンシブ対応

### モバイル最適化
```typescript
function ResponsiveNavigation() {
  return (
    <NavigationMenu className="mobile:hidden tablet:flex desktop:flex">
      {/* デスクトップ用ナビゲーション */}
    </NavigationMenu>
  );
}

function MobileDialog() {
  return (
    <Dialog>
      <DialogContent className="mobile:max-w-[95vw] mobile:max-h-[90vh] tablet:max-w-lg">
        <DialogHeader>
          <DialogTitle>モバイル最適化ダイアログ</DialogTitle>
        </DialogHeader>
        <div className="mobile:max-h-[60vh] mobile:overflow-y-auto">
          コンテンツ
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

## ♿ アクセシビリティ

### フォーカス管理
```typescript
// ダイアログのフォーカス管理
<Dialog>
  <DialogTrigger asChild>
    <Button>ダイアログを開く</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>アクセシブルダイアログ</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      <Input placeholder="最初にフォーカスされる要素" autoFocus />
      <Button>アクション</Button>
    </div>
    <DialogFooter>
      <Button variant="outline">キャンセル</Button>
      <Button>確定</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### キーボードナビゲーション
- **Tab**: 要素間のフォーカス移動
- **Escape**: ダイアログ・メニューを閉じる
- **Arrow Keys**: メニュー項目間の移動
- **Enter/Space**: 項目の選択・実行

## 🧪 テスト

### 統合テスト例
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/organisms';

describe('Dialog', () => {
  test('ダイアログの開閉が正常に動作する', () => {
    render(
      <Dialog>
        <DialogTrigger>ダイアログを開く</DialogTrigger>
        <DialogContent>
          <div>ダイアログコンテンツ</div>
        </DialogContent>
      </Dialog>
    );
    
    expect(screen.queryByText('ダイアログコンテンツ')).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByText('ダイアログを開く'));
    expect(screen.getByText('ダイアログコンテンツ')).toBeInTheDocument();
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('ダイアログコンテンツ')).not.toBeInTheDocument();
  });
});
```

## 🎯 ベストプラクティス

### 適切な使用場面
```typescript
// 良い例：重要な確認ダイアログ
<Dialog>
  <DialogTrigger asChild>
    <Button variant="destructive">アカウント削除</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>アカウント削除の確認</DialogTitle>
      <DialogDescription>
        この操作は取り消せません。本当に削除しますか？
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

// 避けるべき例：軽微な操作でのダイアログ
<Dialog>
  <DialogTrigger>色を変更</DialogTrigger>
  <DialogContent>
    <div>色を選択してください</div>
  </DialogContent>
</Dialog>
```

### パフォーマンス最適化
```typescript
// 遅延読み込み
const LazyDialogContent = lazy(() => import('./HeavyDialogContent'));

<Dialog>
  <DialogContent>
    <Suspense fallback={<Skeleton className="h-32" />}>
      <LazyDialogContent />
    </Suspense>
  </DialogContent>
</Dialog>
```

## 📚 関連ドキュメント

- [Molecules](../molecules/) - 構成要素となる複合コンポーネント
- [Atoms](../atoms/) - 基本的な構成要素
- [デザイントークン](../../design-tokens/) - スタイリングの基盤
- [アクセシビリティガイド](../../examples/accessibility.md) - アクセシビリティ対応
