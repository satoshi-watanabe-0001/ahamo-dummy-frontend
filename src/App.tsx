import { useState } from 'react';
import { AdminDeviceApp } from './components/admin/AdminDeviceApp';
import DemoLayout from './components/templates/DemoLayout';
import ComponentShowcase from './components/templates/ComponentShowcase';
import { Button } from './components/atoms';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './components/molecules';
import { Badge } from './components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { HighContrastToggle } from './components/ui/high-contrast-toggle';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Ahamo Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <HighContrastToggle />
              <button
                onClick={() => setShowAdmin(!showAdmin)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                {showAdmin ? 'コンポーネント表示' : 'デバイス管理'}
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {showAdmin ? (
        <AdminDeviceApp />
      ) : (
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
                        <Badge className="mt-2" variant="default">人気</Badge>
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
          </div>
        </DemoLayout>
      )}
    </div>
  );
}

export default App;
