import { useState } from 'react';
import { ShippingFormDemo } from './components/forms/ShippingFormDemo';
import { PaymentDemoPage } from './components/pages/PaymentDemoPage';
import { ContractCompletionPage } from './components/pages/ContractCompletionPage';
import { ContractConfirmationPage } from './components/pages/ContractConfirmationPage';
import { TrackingPage } from './components/shipping/TrackingPage';
import { MyPage } from './components/pages/MyPage';
import { DeviceCatalog } from './components/device/DeviceCatalog';
import { DeviceDetail } from './components/organisms/DeviceDetail';
import { DeviceComparisonPage } from './components/pages/DeviceComparisonPage';
import { PurchaseFlowContainer } from './components/containers/PurchaseFlowContainer';
import { Device } from './types';
import { deviceApi } from './utils/api';

function App() {

  const [currentView, setCurrentView] = useState<'demo' | 'unified-flow' | 'device-catalog' | 'device-detail' | 'device-comparison' | 'contract-confirmation' | 'contract-completion' | 'shipping-demo' | 'payment-demo' | 'tracking' | 'mypage'>('demo');
  const [contractData, setContractData] = useState<any>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [selectedDeviceData, setSelectedDeviceData] = useState<Device | null>(null);
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">ahamo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium">マイページ</span>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Contract Confirmation Feature</h2>
        <p className="mb-4">Current view: {currentView}</p>
        <div className="space-x-4">
          <button 
            onClick={() => setCurrentView('demo')}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Demo
          </button>
          <button 
            onClick={() => setCurrentView('unified-flow')}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            統合購入フロー (10ステップ)
          </button>
          <button 
            onClick={() => setCurrentView('contract-confirmation')}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Contract Confirmation
          </button>
          <button 
            onClick={() => setCurrentView('contract-completion')}
            className="px-4 py-2 bg-green-700 text-white rounded"
          >
            Contract Completion
          </button>
          <button 
            onClick={() => setCurrentView('shipping-demo')}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            配送設定デモ
          </button>
          <button 
            onClick={() => setCurrentView('payment-demo')}
            className="px-4 py-2 bg-orange-600 text-white rounded"
          >
            決済結果デモ
          </button>
          <button 
            onClick={() => setCurrentView('tracking')}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            配送追跡デモ
          </button>
          <button 
            onClick={() => setCurrentView('mypage')}
            className="px-4 py-2 bg-teal-600 text-white rounded"
          >
            マイページ
          </button>
        </div>
        
        {currentView === 'contract-confirmation' && (
          <div className="mt-8">
            <ContractConfirmationPage
              onSubmit={(data) => {
                console.log('Contract confirmed:', data);
                setContractData(data.contractData);
                setCurrentView('contract-completion');
              }}
              onBack={() => setCurrentView('demo')}
              onChangePlan={() => console.log('プラン変更')}
              onChangeDevice={() => setCurrentView('device-catalog')}
              onChangePersonalInfo={() => console.log('個人情報変更')}
              selectedDevice={selectedDeviceData}
            />
          </div>
        )}

        {currentView === 'shipping-demo' && (
          <div className="mt-8">
            <ShippingFormDemo />
          </div>
        )}

        {currentView === 'payment-demo' && (
          <div className="mt-8">
            <PaymentDemoPage />
          </div>
        )}

        {currentView === 'contract-completion' && (
          <div className="mt-8">
            <ContractCompletionPage
              contractData={contractData || {
                contract: {
                  id: 'demo-contract-001',
                  planId: 'ahamo-20gb',
                  deviceId: 'iphone-15',
                  customerName: '田中太郎',
                  customerEmail: 'tanaka@example.com',
                  customerPhone: '090-1234-5678',
                  status: 'completed',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  customerInfo: {
                    name: '田中太郎',
                    email: 'tanaka@example.com',
                    phoneNumber: '090-1234-5678',
                    address: '東京都渋谷区神南1-1-1'
                  }
                },
                plan: {
                  id: 'ahamo-20gb',
                  name: 'ahamo',
                  monthlyFee: 2970,
                  description: '20GBの大容量プラン。5分以内の国内通話無料。',
                  dataCapacity: '20GB',
                  voiceCalls: '5分以内無料',
                  sms: '送信3.3円/通',
                  features: ['20GBまで高速データ通信', '5分以内の国内通話無料', '海外82の国・地域でデータ通信可能'],
                  isActive: true
                },
                device: {
                  id: 'iphone-15',
                  name: 'iPhone 15',
                  brand: 'Apple',
                  price: 124800,
                  category: 'iPhone',
                  priceRange: 'premium',
                  colors: ['ブルー', 'ピンク', 'イエロー'],
                  storageOptions: ['128GB', '256GB', '512GB'],
                  inStock: true,
                  releaseDate: '2023-09-22',
                  popularity: 95
                }
              }}
              onBackToHome={() => setCurrentView('demo')}
            />
          </div>
        )}

        {currentView === 'unified-flow' && (
          <div className="mt-8">
            <PurchaseFlowContainer 
              onComplete={() => setCurrentView('demo')}
            />
          </div>
        )}

        {currentView === 'device-catalog' && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setCurrentView('contract-confirmation')}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                ← 契約確認に戻る
              </button>
              <h1 className="text-3xl font-bold">デバイス選択</h1>
              <div></div>
            </div>
            <DeviceCatalog 
              onDeviceSelect={(deviceId) => {
                setSelectedDeviceId(deviceId);
                setCurrentView('device-detail');
              }}
            />
          </div>
        )}

        {currentView === 'device-detail' && selectedDeviceId && (
          <div className="mt-8">
            <DeviceDetail 
              deviceId={selectedDeviceId}
              onBack={() => setCurrentView('device-catalog')}
              onShowComparison={() => setCurrentView('device-comparison')}
            />
            <div className="mt-6 flex justify-center">
              <button 
                onClick={async () => {
                  try {
                    const deviceResponse = await deviceApi.getDevice(selectedDeviceId);
                    const deviceData = deviceResponse.data as Device;
                    setSelectedDeviceData(deviceData);
                    setCurrentView('contract-confirmation');
                  } catch (error) {
                    console.error('Failed to load device data:', error);
                  }
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                このデバイスで契約を進める
              </button>
            </div>
          </div>
        )}

        {currentView === 'device-comparison' && (
          <div className="mt-8">
            <DeviceComparisonPage 
              onBack={() => setCurrentView('device-detail')}
            />
          </div>
        )}

        {currentView === 'tracking' && (
          <div className="mt-8">
            <TrackingPage trackingNumber="YMT123456789" />
          </div>
        )}

        {currentView === 'mypage' && (
          <div className="mt-8">
            <MyPage contractId="contract-1" />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
