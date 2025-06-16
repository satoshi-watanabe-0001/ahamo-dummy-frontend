import { useState } from 'react';
import { ProgressIndicator } from '../ui/progress-indicator';
import { DeviceCatalog } from '../device/DeviceCatalog';
import { mockDevices } from '../../data/mockData';
import { Device } from '../../types';

interface DeviceSelectionFlowProps {
  onSubmit: (device: Device) => void;
  onBack?: () => void;
  selectedDevice?: Device | null;
}

export const DeviceSelectionFlow = ({ onSubmit, onBack, selectedDevice }: DeviceSelectionFlowProps) => {
  const [currentView, setCurrentView] = useState<'catalog' | 'detail'>('catalog');
  const [selectedDeviceData, setSelectedDeviceData] = useState<Device | null>(selectedDevice || null);



  const handleDeviceConfirm = (device: Device) => {
    onSubmit(device);
  };

  const handleBackToCatalog = () => {
    setCurrentView('catalog');
  };

  const handleBack = () => {
    if (currentView === 'detail') {
      setCurrentView('catalog');
    } else {
      onBack?.();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <ProgressIndicator 
        currentStep={4}
        totalSteps={10}
        steps={['契約タイプ', '利用状況', 'プラン選択', '端末選択', '料金確認', '個人情報', '本人確認', '決済', '契約確認', '完了']}
        showCompletionStatus={true}
        completedSteps={['contract-type', 'usage-profile', 'plan-selection']}
      />

      {currentView === 'catalog' && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">端末を選択してください</h2>
            <p className="text-gray-600">ご希望の端末を選択してください。</p>
          </div>
          <DeviceCatalog
            onDeviceSelect={(deviceId: string) => {
              console.log('Device selected:', deviceId);
              const actualDevice = mockDevices.find(d => d.id === deviceId);
              if (actualDevice) {
                setSelectedDeviceData(actualDevice);
                setCurrentView('detail');
              } else {
                console.error('Device not found:', deviceId);
                const fallbackDevice: Device = {
                  id: deviceId,
                  name: 'Selected Device',
                  price: 100000,
                  brand: 'Unknown',
                  category: 'iPhone',
                  priceRange: 'mid',
                  colors: ['ブラック', 'ホワイト', 'ブルー'],
                  storageOptions: ['128GB', '256GB', '512GB'],
                  inStock: true,
                  releaseDate: '2024-01-01',
                  popularity: 85
                };
                setSelectedDeviceData(fallbackDevice);
                setCurrentView('detail');
              }
            }}
          />
          <div className="flex justify-between pt-6 border-t mt-8">
            <button 
              onClick={handleBack}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              戻る
            </button>
          </div>
        </div>
      )}

      {currentView === 'detail' && selectedDeviceData && (
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">端末詳細確認</h3>
          <div className="bg-white border rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                📱
              </div>
              <div>
                <h4 className="text-lg font-medium">{selectedDeviceData.name}</h4>
                <p className="text-gray-600">¥{selectedDeviceData.price?.toLocaleString()}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• 高性能プロセッサー搭載</p>
              <p>• 長時間バッテリー</p>
              <p>• 高画質カメラ</p>
            </div>
          </div>
          <div className="flex justify-between">
            <button 
              onClick={handleBackToCatalog}
              className="px-6 py-2 border rounded hover:bg-gray-50"
            >
              端末を変更
            </button>
            <button 
              onClick={() => handleDeviceConfirm(selectedDeviceData)}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              この端末で進む
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
