# アクセシビリティガイドライン

UIコンポーネントライブラリのアクセシビリティ対応ガイドです。WCAG 2.1 AAレベルに準拠した実装方法を説明します。

## 🎯 アクセシビリティ原則

### 知覚可能（Perceivable）
- 十分なコントラスト比の確保
- 代替テキストの提供
- 色だけに依存しない情報伝達

### 操作可能（Operable）
- キーボードナビゲーション対応
- 適切なフォーカス管理
- 十分なタッチターゲットサイズ

### 理解可能（Understandable）
- 明確なラベルと説明
- 一貫したナビゲーション
- エラーメッセージの提供

### 堅牢（Robust）
- セマンティックHTML の使用
- ARIA属性の適切な使用
- スクリーンリーダー対応

## 🔧 コンポーネント別ガイドライン

### Button - ボタン

```typescript
// 基本的なアクセシブルボタン
<Button onClick={handleClick}>
  申し込み
</Button>

// アイコンボタンには必ずラベルを
<Button variant="outline" size="icon" aria-label="メニューを開く">
  <MenuIcon className="h-4 w-4" />
</Button>

// 状態を適切に伝える
<Button 
  aria-busy={loading}
  disabled={loading}
  aria-describedby={loading ? 'loading-message' : undefined}
>
  {loading ? '送信中...' : '送信'}
</Button>
{loading && (
  <p id="loading-message" className="sr-only">
    データを送信しています。しばらくお待ちください。
  </p>
)}

// トグルボタン
<Button 
  aria-pressed={isPressed}
  onClick={() => setIsPressed(!isPressed)}
>
  {isPressed ? 'オン' : 'オフ'}
</Button>
```

### Input - 入力フィールド

```typescript
// ラベルとの関連付け
<div>
  <Label htmlFor="email">メールアドレス</Label>
  <Input
    id="email"
    type="email"
    aria-describedby="email-help email-error"
    aria-required="true"
    aria-invalid={hasError}
  />
  <p id="email-help" className="text-sm text-gray-600">
    ログインに使用するメールアドレスを入力してください
  </p>
  {hasError && (
    <p id="email-error" className="text-sm text-red-600" role="alert">
      有効なメールアドレスを入力してください
    </p>
  )}
</div>

// 必須フィールドの表示
<div>
  <Label htmlFor="name">
    お名前 <span className="text-red-500" aria-label="必須">*</span>
  </Label>
  <Input
    id="name"
    type="text"
    required
    aria-required="true"
  />
</div>

// パスワード表示切り替え
function PasswordInput() {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="relative">
      <Label htmlFor="password">パスワード</Label>
      <Input
        id="password"
        type={showPassword ? 'text' : 'password'}
        aria-describedby="password-toggle"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-2 top-8"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
        aria-describedby="password-toggle"
      >
        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
      </Button>
      <p id="password-toggle" className="sr-only">
        パスワードの表示・非表示を切り替えます
      </p>
    </div>
  );
}
```

### Card - カード

```typescript
// セマンティックなカード構造
<Card role="article" aria-labelledby="plan-title">
  <CardHeader>
    <CardTitle id="plan-title">ahamoベーシック</CardTitle>
    <CardDescription>
      日常使いに最適な基本プラン
    </CardDescription>
  </CardHeader>
  <CardContent>
    <dl className="space-y-2">
      <div className="flex justify-between">
        <dt>データ容量</dt>
        <dd>20GB</dd>
      </div>
      <div className="flex justify-between">
        <dt>月額料金</dt>
        <dd>¥2,970</dd>
      </div>
    </dl>
  </CardContent>
  <CardFooter>
    <Button aria-describedby="plan-title">
      このプランを選択
    </Button>
  </CardFooter>
</Card>

// クリック可能なカード
<Card 
  role="button"
  tabIndex={0}
  className="cursor-pointer hover:shadow-md focus:ring-2 focus:ring-primary-500"
  onClick={() => handleSelect('basic')}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect('basic');
    }
  }}
  aria-label="ahamoベーシックプランを選択"
>
  <CardContent>
    プラン内容
  </CardContent>
</Card>
```

### Tabs - タブ

```typescript
// アクセシブルなタブ実装
<Tabs defaultValue="plan">
  <TabsList role="tablist" aria-label="申し込み手順">
    <TabsTrigger 
      value="plan" 
      role="tab"
      aria-controls="plan-panel"
      aria-selected={activeTab === 'plan'}
    >
      プラン選択
    </TabsTrigger>
    <TabsTrigger 
      value="device" 
      role="tab"
      aria-controls="device-panel"
      aria-selected={activeTab === 'device'}
    >
      端末選択
    </TabsTrigger>
    <TabsTrigger 
      value="options" 
      role="tab"
      aria-controls="options-panel"
      aria-selected={activeTab === 'options'}
    >
      オプション
    </TabsTrigger>
  </TabsList>
  
  <TabsContent 
    value="plan" 
    role="tabpanel"
    id="plan-panel"
    aria-labelledby="plan-tab"
    tabIndex={0}
  >
    <h3>プラン選択</h3>
    <p>お客様に最適なプランをお選びください。</p>
  </TabsContent>
  
  <TabsContent 
    value="device" 
    role="tabpanel"
    id="device-panel"
    aria-labelledby="device-tab"
    tabIndex={0}
  >
    <h3>端末選択</h3>
    <p>最新のスマートフォンからお選びください。</p>
  </TabsContent>
</Tabs>
```

### NavigationMenu - ナビゲーションメニュー

```typescript
// アクセシブルなナビゲーション
<NavigationMenu>
  <NavigationMenuList role="menubar" aria-label="メインナビゲーション">
    <NavigationMenuItem>
      <NavigationMenuTrigger
        role="menuitem"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="plans-menu"
      >
        プラン・料金
      </NavigationMenuTrigger>
      <NavigationMenuContent
        role="menu"
        id="plans-menu"
        aria-label="プラン・料金メニュー"
      >
        <div className="grid gap-3 p-6">
          <NavigationMenuLink
            href="/plans/basic"
            role="menuitem"
            className="block p-2 hover:bg-gray-50 rounded focus:bg-gray-50"
          >
            <div className="font-medium">ahamoベーシック</div>
            <div className="text-sm text-gray-600">20GB ¥2,970/月</div>
          </NavigationMenuLink>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

## ⌨️ キーボードナビゲーション

### 基本的なキーボード操作

| キー | 動作 |
|------|------|
| Tab | 次の要素にフォーカス移動 |
| Shift + Tab | 前の要素にフォーカス移動 |
| Enter | ボタン・リンクの実行 |
| Space | ボタンの実行、チェックボックスの切り替え |
| Escape | ダイアログ・メニューを閉じる |
| Arrow Keys | メニュー・タブ内の移動 |

### フォーカス管理

```typescript
// フォーカストラップの実装
function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;
      
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        }
      };
      
      document.addEventListener('keydown', handleTabKey);
      firstElement?.focus();
      
      return () => {
        document.removeEventListener('keydown', handleTabKey);
      };
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-white p-6 rounded-lg">
        {children}
      </div>
    </div>
  );
}
```

## 🎨 視覚的アクセシビリティ

### コントラスト比

```typescript
// 十分なコントラスト比を確保
<Button className="bg-blue-600 text-white hover:bg-blue-700">
  高コントラストボタン
</Button>

// エラー状態での視認性
<Input 
  className={`
    ${hasError 
      ? 'border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:ring-blue-500'
    }
  `}
  aria-invalid={hasError}
/>
```

### フォーカス表示

```typescript
// 明確なフォーカス表示
<Button className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  フォーカス表示ボタン
</Button>

// カスタムフォーカススタイル
<Card className="focus-within:ring-2 focus-within:ring-blue-500">
  <CardContent>
    <Input placeholder="フォーカス時にカード全体がハイライト" />
  </CardContent>
</Card>
```

## 📱 モバイルアクセシビリティ

### タッチターゲット

```typescript
// 最小44pxのタッチターゲット
<Button 
  size="sm"
  className="mobile:min-h-[44px] mobile:min-w-[44px] mobile:text-base"
>
  モバイル最適化ボタン
</Button>

// アイコンボタンのタッチターゲット
<Button 
  variant="ghost" 
  size="icon"
  className="mobile:h-12 mobile:w-12 desktop:h-8 desktop:w-8"
  aria-label="メニューを開く"
>
  <MenuIcon className="h-4 w-4" />
</Button>
```

### 画面読み上げ対応

```typescript
// スクリーンリーダー専用テキスト
<div>
  <span className="sr-only">現在のページ: </span>
  <span>プラン選択</span>
</div>

// 装飾的な要素を隠す
<div aria-hidden="true" className="text-gray-400">
  ※装飾的なアイコン
</div>

// 動的コンテンツの通知
<div role="status" aria-live="polite">
  {message && <p>{message}</p>}
</div>

<div role="alert" aria-live="assertive">
  {error && <p className="text-red-600">{error}</p>}
</div>
```

## 🧪 アクセシビリティテスト

### 自動テスト

```typescript
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('コンポーネントにアクセシビリティ違反がない', async () => {
  const { container } = render(
    <Button>テストボタン</Button>
  );
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('適切なARIA属性が設定されている', () => {
  render(
    <Button aria-label="メニューを開く">
      <MenuIcon />
    </Button>
  );
  
  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-label', 'メニューを開く');
});
```

### 手動テスト

#### キーボードテスト
1. Tabキーですべての要素にアクセス可能か
2. Enterキー・Spaceキーで操作可能か
3. Escapeキーでダイアログが閉じるか
4. Arrow Keysでメニュー内を移動できるか

#### スクリーンリーダーテスト
1. 要素の役割が適切に読み上げられるか
2. 状態変化が通知されるか
3. エラーメッセージが読み上げられるか
4. フォームラベルが関連付けられているか

## 📋 チェックリスト

### 基本チェック
- [ ] すべてのインタラクティブ要素がキーボードでアクセス可能
- [ ] フォーカス表示が明確
- [ ] 色だけでなく形状やテキストでも情報を伝達
- [ ] 十分なコントラスト比（4.5:1以上）
- [ ] タッチターゲットが44px以上

### フォームチェック
- [ ] すべての入力フィールドにラベルが関連付けられている
- [ ] 必須フィールドが明示されている
- [ ] エラーメッセージが具体的で建設的
- [ ] バリデーションがリアルタイムで実行される

### ナビゲーションチェック
- [ ] 現在位置が明確
- [ ] スキップリンクが提供されている
- [ ] パンくずリストが適切
- [ ] メニューの階層が理解しやすい

### コンテンツチェック
- [ ] 見出しが階層的に構造化されている
- [ ] 画像に適切な代替テキスト
- [ ] リンクテキストが説明的
- [ ] 略語や専門用語に説明がある

## 🔗 参考リソース

- [WCAG 2.1 ガイドライン](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
