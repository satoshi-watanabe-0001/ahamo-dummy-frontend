import { Device } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  const specs = device.specifications ? JSON.parse(device.specifications) : {};
  
  return (
    <Card className={`transition-all duration-200 ${!device.inStock ? 'opacity-60 grayscale' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">{device.name}</CardTitle>
          {!device.inStock && <Badge variant="secondary">在庫切れ</Badge>}
        </div>
        <p className="text-sm text-gray-600">{device.brand}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {device.imageUrl && (
            <img 
              src={device.imageUrl} 
              alt={device.name}
              className="w-full h-48 object-cover rounded-md"
              loading="lazy"
            />
          )}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">カテゴリ</span>
              <span className="font-semibold">{device.category}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">画面サイズ</span>
              <span className="font-semibold">{specs.display || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">価格</span>
              <span className="text-2xl font-bold text-blue-600">¥{device.price.toLocaleString()}</span>
            </div>
            {device.colors && device.colors.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">カラー</span>
                <div className="flex gap-1">
                  {device.colors.slice(0, 3).map((color, index) => (
                    <div key={index} className="w-4 h-4 rounded-full border border-gray-300" 
                         style={{ backgroundColor: color.toLowerCase() }} />
                  ))}
                  {device.colors.length > 3 && <span className="text-xs text-gray-500">+{device.colors.length - 3}</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
