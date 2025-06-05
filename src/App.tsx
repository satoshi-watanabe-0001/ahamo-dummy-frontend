import { useState } from 'react';
import DemoLayout from './components/templates/DemoLayout';
import ComponentShowcase from './components/templates/ComponentShowcase';
import { Button } from './components/atoms';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './components/molecules';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/organisms';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Badge } from './components/ui/badge';
import { Switch } from './components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from './components/ui/navigation-menu';

function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);

  return (
    <DemoLayout 
      title="Ahamo UI Component Library" 
      description="React + TypeScript + Tailwind CSS コンポーネントライブラリのデモ"
    >
      <div className="space-y-12">
        <ComponentShowcase 
          title="Atoms - 基本コンポーネント"
          description="最小単位のUIコンポーネント"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Button バリエーション</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Button サイズ</h3>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">🔍</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Input フィールド</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input id="email" type="email" placeholder="example@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">パスワード</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Badge バリエーション</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Switch</h3>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="notifications" 
                  checked={switchValue}
                  onCheckedChange={setSwitchValue}
                />
                <Label htmlFor="notifications">通知を有効にする</Label>
              </div>
            </div>
          </div>
        </ComponentShowcase>

        <ComponentShowcase 
          title="Molecules - 複合コンポーネント"
          description="複数のatomsを組み合わせたコンポーネント"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Card コンポーネント</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>ahamoベーシック</CardTitle>
                    <CardDescription>20GB + 5分かけ放題</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">¥2,970</div>
                    <p className="text-sm text-muted-foreground">月額料金（税込）</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>ahamo大盛り</CardTitle>
                    <CardDescription>100GB + 5分かけ放題</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">¥4,950</div>
                    <p className="text-sm text-muted-foreground">月額料金（税込）</p>
                    <Badge className="mt-2">人気</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>デバイス</CardTitle>
                    <CardDescription>iPhone 15 Pro</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">¥159,027</div>
                    <p className="text-sm text-muted-foreground">一括払い（税込）</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Tabs コンポーネント</h3>
              <Tabs defaultValue="plans" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="plans">料金プラン</TabsTrigger>
                  <TabsTrigger value="devices">デバイス</TabsTrigger>
                  <TabsTrigger value="options">オプション</TabsTrigger>
                </TabsList>
                <TabsContent value="plans" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>料金プラン選択</CardTitle>
                      <CardDescription>お客様に最適なプランをお選びください</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>ahamoベーシック、ahamo大盛りからお選びいただけます。</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="devices" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>デバイス選択</CardTitle>
                      <CardDescription>最新のスマートフォンをご用意しています</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>iPhone、Android端末を豊富に取り揃えています。</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="options" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>オプションサービス</CardTitle>
                      <CardDescription>便利なオプションサービス</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>かけ放題オプション、ケータイ補償サービスなど。</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </ComponentShowcase>

        <ComponentShowcase 
          title="Organisms - 複雑なコンポーネント"
          description="複数のmoleculesを組み合わせた複雑なコンポーネント"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Navigation Menu</h3>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>料金・サービス</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">ahamoベーシック</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            20GB + 5分かけ放題で月額2,970円
                          </p>
                        </NavigationMenuLink>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">ahamo大盛り</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            100GB + 5分かけ放題で月額4,950円
                          </p>
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>デバイス</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">iPhone</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            最新のiPhoneシリーズ
                          </p>
                        </NavigationMenuLink>
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Android</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            豊富なAndroid端末
                          </p>
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Dialog モーダル</h3>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>契約内容を確認</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>契約内容確認</DialogTitle>
                    <DialogDescription>
                      以下の内容で契約を進めてよろしいですか？
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>選択プラン</Label>
                      <p className="text-sm">ahamoベーシック（20GB）</p>
                    </div>
                    <div className="space-y-2">
                      <Label>月額料金</Label>
                      <p className="text-sm font-semibold">¥2,970（税込）</p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      キャンセル
                    </Button>
                    <Button onClick={() => setIsDialogOpen(false)}>
                      契約を進める
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </ComponentShowcase>

        <ComponentShowcase 
          title="レスポンシブデザイン"
          description="モバイル、タブレット、デスクトップ対応"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="mobile:col-span-1 tablet:col-span-1 desktop:col-span-1">
                <CardHeader>
                  <CardTitle className="text-sm">モバイル</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs">~767px</p>
                </CardContent>
              </Card>
              <Card className="mobile:col-span-1 tablet:col-span-1 desktop:col-span-1">
                <CardHeader>
                  <CardTitle className="text-sm">タブレット</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs">768px~1023px</p>
                </CardContent>
              </Card>
              <Card className="mobile:col-span-1 tablet:col-span-2 desktop:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm">デスクトップ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs">1024px~</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </ComponentShowcase>

        <ComponentShowcase 
          title="デザイントークン"
          description="カラーパレット、タイポグラフィ、スペーシング"
        >
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">カラーパレット</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-16 bg-primary rounded-md"></div>
                  <p className="text-sm font-medium">Primary</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-secondary rounded-md"></div>
                  <p className="text-sm font-medium">Secondary</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-semantic-success rounded-md"></div>
                  <p className="text-sm font-medium">Success</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-semantic-error rounded-md"></div>
                  <p className="text-sm font-medium">Error</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">タイポグラフィ</h3>
              <div className="space-y-2">
                <p className="text-6xl font-bold">見出し1</p>
                <p className="text-4xl font-semibold">見出し2</p>
                <p className="text-2xl font-medium">見出し3</p>
                <p className="text-lg">本文（大）</p>
                <p className="text-base">本文（標準）</p>
                <p className="text-sm">本文（小）</p>
              </div>
            </div>
          </div>
        </ComponentShowcase>
      </div>
    </DemoLayout>
  );
}

export default App;
