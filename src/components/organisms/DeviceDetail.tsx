import { useDeviceDetail } from '../../hooks/useDeviceDetail';
import { useDeviceComparison } from '../../hooks/useDeviceComparison';
import { useIsMobile } from '../../hooks/use-mobile';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageGallery } from '../molecules/ImageGallery';
import { ColorSelector } from '../molecules/ColorSelector';
import { SpecsTable } from '../molecules/SpecsTable';

interface DeviceDetailProps {
  deviceId: string;
  onBack: () => void;
  onShowComparison: () => void;
}

export function DeviceDetail({ deviceId, onBack, onShowComparison }: DeviceDetailProps) {
  const {
    device,
    inventory,
    loading,
    error,
    selectedColor,
    selectedStorage,
    setSelectedColor,
    setSelectedStorage
  } = useDeviceDetail(deviceId);

  const { addDevice, canAddMore } = useDeviceComparison();
  const isMobile = useIsMobile();

  const handleAddToComparison = async () => {
    if (device) {
      await addDevice(device.id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error || 'デバイスが見つかりません'}</p>
        <Button onClick={onBack}>戻る</Button>
      </div>
    );
  }

  const currentInventory = inventory?.find(inv => inv.color === selectedColor);
  const currentStorageInventory = currentInventory?.storageOptions.find(
    opt => opt.storage === selectedStorage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack}>
          ← 戻る
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleAddToComparison}
            disabled={!canAddMore}
          >
            比較に追加
          </Button>
          <Button variant="outline" onClick={onShowComparison}>
            比較を見る
          </Button>
        </div>
      </div>

      {isMobile ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{device.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{device.brand}</Badge>
                <Badge variant="outline">{device.category}</Badge>
                {!device.inStock && <Badge variant="secondary">在庫切れ</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-4">
                ¥{device.price.toLocaleString()}
              </div>
              <ImageGallery
                images={device.galleryImages || [device.imageUrl].filter(Boolean) as string[]}
                deviceName={device.name}
                selectedColor={selectedColor}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>カラー・ストレージ選択</CardTitle>
            </CardHeader>
            <CardContent>
              <ColorSelector
                colors={device.colors || []}
                inventory={inventory || []}
                selectedColor={selectedColor}
                selectedStorage={selectedStorage}
                onColorChange={setSelectedColor}
                onStorageChange={setSelectedStorage}
              />
              {currentStorageInventory && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">
                    在庫状況: {currentStorageInventory.inStock ? '在庫あり' : '在庫切れ'}
                  </p>
                  {currentStorageInventory.inStock && currentStorageInventory.quantity <= 3 && (
                    <p className="text-sm text-orange-600">
                      残り{currentStorageInventory.quantity}台
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <SpecsTable
                specifications={device.specifications || ''}
                deviceName={device.name}
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">{device.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{device.brand}</Badge>
                  <Badge variant="outline">{device.category}</Badge>
                  {!device.inStock && <Badge variant="secondary">在庫切れ</Badge>}
                </div>
                <div className="text-4xl font-bold text-blue-600">
                  ¥{device.price.toLocaleString()}
                </div>
              </CardHeader>
              <CardContent>
                <ImageGallery
                  images={device.galleryImages || [device.imageUrl].filter(Boolean) as string[]}
                  deviceName={device.name}
                  selectedColor={selectedColor}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>カラー・ストレージ選択</CardTitle>
              </CardHeader>
              <CardContent>
                <ColorSelector
                  colors={device.colors || []}
                  inventory={inventory || []}
                  selectedColor={selectedColor}
                  selectedStorage={selectedStorage}
                  onColorChange={setSelectedColor}
                  onStorageChange={setSelectedStorage}
                />
                {currentStorageInventory && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium">
                      在庫状況: {currentStorageInventory.inStock ? '在庫あり' : '在庫切れ'}
                    </p>
                    {currentStorageInventory.inStock && currentStorageInventory.quantity <= 3 && (
                      <p className="text-sm text-orange-600">
                        残り{currentStorageInventory.quantity}台
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <SpecsTable
                  specifications={device.specifications || ''}
                  deviceName={device.name}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
