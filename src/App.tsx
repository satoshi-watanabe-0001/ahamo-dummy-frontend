import { useState } from 'react';
import { AdminDeviceApp } from './components/admin/AdminDeviceApp';
import DemoLayout from './components/templates/DemoLayout';
import ComponentShowcase from './components/templates/ComponentShowcase';
import { OptionManager } from './components/organisms/OptionManager';
import { Button } from './components/atoms';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './components/molecules';
import { Badge } from './components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { HighContrastToggle } from './components/ui/high-contrast-toggle';
import { PlanComparison } from './components/organisms/PlanComparison';
import { FeeSimulator } from './components/organisms/FeeSimulator';
import { DeviceCatalog } from './components/device/DeviceCatalog';
import { DeviceDetail } from './components/organisms/DeviceDetail';
import { DeviceComparisonPage } from './components/pages/DeviceComparisonPage';
import { PersonalInfoForm } from './components/forms/PersonalInfoForm';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [currentView, setCurrentView] = useState<'demo' | 'device-detail' | 'device-comparison'>('demo');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setCurrentView('device-detail');
  };

  const handleBackToDemo = () => {
    setCurrentView('demo');
    setSelectedDeviceId(null);
  };

  const handleShowComparison = () => {
    setCurrentView('device-comparison');
  };

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
      ) : currentView === 'device-detail' && selectedDeviceId ? (
        <DeviceDetail
          deviceId={selectedDeviceId}
          onBack={handleBackToDemo}
          onShowComparison={handleShowComparison}
        />
      ) : currentView === 'device-comparison' ? (
        <DeviceComparisonPage onBack={handleBackToDemo} />
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
              title="Organisms - プラン比較機能"
              description="プラン一覧表示・比較機能のデモ"
            >
              <PlanComparison />
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
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="plans">料金プラン</TabsTrigger>
                      <TabsTrigger value="simulator">料金シミュレーション</TabsTrigger>
                      <TabsTrigger value="devices">デバイス</TabsTrigger>
                      <TabsTrigger value="options">オプション</TabsTrigger>
                      <TabsTrigger value="personal-info">個人情報</TabsTrigger>
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
                    <TabsContent value="simulator" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>料金シミュレーション</CardTitle>
                          <CardDescription>使用量に基づいてリアルタイムで料金を計算します</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <FeeSimulator selectedPlanId="1" />
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="devices" className="space-y-4">
                      <DeviceCatalog onDeviceSelect={handleDeviceSelect} />
                    </TabsContent>
                    <TabsContent value="options" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>オプションサービス</CardTitle>
                          <CardDescription>便利なオプションサービスを選択してください</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <OptionManager 
                            selectedPlanId="1"
                            baseUsage={{
                              dataUsage: 15,
                              callMinutes: 120,
                              smsCount: 20
                            }}
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="personal-info" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>個人情報入力フォーム</CardTitle>
                          <CardDescription>SCRUM-53: リアルタイムバリデーション・住所自動補完機能付き</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <PersonalInfoForm 
                            onSubmit={(data) => {
                              console.log('Form submitted:', data);
                              alert('フォーム送信完了: ' + JSON.stringify(data, null, 2));
                            }}
                            onSave={(data) => {
                              console.log('Form auto-saved:', data);
                            }}
                          />
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
