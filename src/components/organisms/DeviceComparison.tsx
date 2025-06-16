import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
;
import { Device } from '../../types';

interface DeviceComparisonProps {
  devices: Device[];
  onRemoveDevice: (deviceId: string) => void;
  onClearComparison: () => void;
}

export function DeviceComparison({ devices, onRemoveDevice, onClearComparison }: DeviceComparisonProps) {
  if (devices.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">比較するデバイスがありません</p>
          <p className="text-sm text-gray-400 mt-2">デバイス詳細ページから「比較に追加」を選択してください</p>
        </CardContent>
      </Card>
    );
  }

  const getAllSpecs = () => {
    const allSpecs = new Set<string>();
    devices.forEach(device => {
      if (device.specifications) {
        try {
          const specs = JSON.parse(device.specifications);
          Object.keys(specs).forEach(key => allSpecs.add(key));
        } catch (error) {
          console.error('Failed to parse specifications:', error);
        }
      }
    });
    return Array.from(allSpecs);
  };

  const getDeviceSpec = (device: Device, specKey: string): string => {
    if (!device.specifications) return 'N/A';
    try {
      const specs = JSON.parse(device.specifications);
      return specs[specKey] || 'N/A';
    } catch (error) {
      return 'N/A';
    }
  };

  const allSpecs = getAllSpecs();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">デバイス比較</h2>
        <Button variant="outline" onClick={onClearComparison}>
          比較をクリア
        </Button>
      </div>

      <div className="md:hidden space-y-4">
        {devices.map((device) => (
          <Card key={device.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{device.name}</CardTitle>
                  <p className="text-sm text-gray-600">{device.brand}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveDevice(device.id)}
                >
                  削除
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">価格</span>
                  <span className="text-blue-600 font-bold">¥{device.price.toLocaleString()}</span>
                </div>
                {allSpecs.map(specKey => (
                  <div key={specKey} className="flex justify-between">
                    <span className="text-sm text-gray-600">{specKey}</span>
                    <span className="text-sm">{getDeviceSpec(device, specKey)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-4 font-semibold border-b border-gray-200">項目</th>
              {devices.map((device) => (
                <th key={device.id} className="text-left p-4 font-semibold border-b border-gray-200 min-w-48">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold">{device.name}</div>
                        <div className="text-sm text-gray-600">{device.brand}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveDevice(device.id)}
                      >
                        ×
                      </Button>
                    </div>
                    {device.imageUrl && (
                      <img
                        src={device.imageUrl}
                        alt={device.name}
                        className="w-full h-32 object-cover rounded"
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="p-4 font-medium">価格</td>
              {devices.map((device) => (
                <td key={device.id} className="p-4">
                  <span className="text-blue-600 font-bold text-lg">
                    ¥{device.price.toLocaleString()}
                  </span>
                </td>
              ))}
            </tr>
            {allSpecs.map(specKey => (
              <tr key={specKey} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4 font-medium">{specKey}</td>
                {devices.map((device) => (
                  <td key={device.id} className="p-4">
                    {getDeviceSpec(device, specKey)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
