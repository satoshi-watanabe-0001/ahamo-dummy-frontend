import { useState } from 'react';
import { ShippingFormDemo } from './components/forms/ShippingFormDemo';
import { PaymentDemoPage } from './components/pages/PaymentDemoPage';
import { ContractCompletionPage } from './components/pages/ContractCompletionPage';
import { ContractConfirmationPage } from './components/pages/ContractConfirmationPage';
import { TrackingPage } from './components/shipping/TrackingPage';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [currentView, setCurrentView] = useState<'demo' | 'device-detail' | 'device-comparison' | 'contract-confirmation' | 'contract-completion' | 'shipping-demo' | 'payment-demo' | 'tracking'>('demo');
  const [contractData, setContractData] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Ahamo Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
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
              onChangeDevice={() => console.log('デバイス変更')}
              onChangePersonalInfo={() => console.log('個人情報変更')}
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

        {currentView === 'tracking' && (
          <div className="mt-8">
            <TrackingPage trackingNumber="YMT123456789" />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
