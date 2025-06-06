import { useState, useEffect } from 'react';
import { Device, AdminDeviceRequest, DeviceImportResult } from '../../types';
import { adminDeviceApi } from '../../utils/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

interface DeviceManagementProps {
  className?: string;
}

export const DeviceManagement = ({ className }: DeviceManagementProps) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<AdminDeviceRequest>({
    name: '',
    brand: '',
    category: 'iPhone',
    priceRange: 'mid',
    price: 0,
    colors: [],
    storageOptions: [],
    inStock: true,
    imageUrl: '',
    specifications: '',
    galleryImages: []
  });

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const response = await adminDeviceApi.getAllDevices();
      setDevices(response.data as Device[]);
    } catch (error) {
      console.error('デバイス一覧の取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (selectedDevice) {
        await adminDeviceApi.updateDevice(selectedDevice.id, formData);
      } else {
        await adminDeviceApi.createDevice(formData);
      }
      await loadDevices();
      resetForm();
    } catch (error) {
      console.error('デバイスの保存に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (deviceId: string) => {
    if (!confirm('このデバイスを削除してもよろしいですか？')) return;
    
    try {
      setLoading(true);
      await adminDeviceApi.deleteDevice(deviceId);
      await loadDevices();
    } catch (error) {
      console.error('デバイスの削除に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (device: Device) => {
    setSelectedDevice(device);
    setFormData({
      name: device.name,
      brand: device.brand,
      category: device.category,
      priceRange: device.priceRange,
      price: device.price,
      colors: device.colors || [],
      storageOptions: device.storageOptions || [],
      inStock: device.inStock,
      imageUrl: device.imageUrl || '',
      specifications: device.specifications || '',
      galleryImages: device.galleryImages || []
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setSelectedDevice(null);
    setIsEditing(false);
    setFormData({
      name: '',
      brand: '',
      category: 'iPhone',
      priceRange: 'mid',
      price: 0,
      colors: [],
      storageOptions: [],
      inStock: true,
      imageUrl: '',
      specifications: '',
      galleryImages: []
    });
  };

  const handleExport = async () => {
    try {
      const response = await adminDeviceApi.exportDevices();
      const blob = new Blob([response.data as string], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'devices.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSVエクスポートに失敗しました:', error);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const response = await adminDeviceApi.importDevices(file);
      const result: DeviceImportResult = await response.json();
      
      alert(`インポート完了: 成功 ${result.successfulRows}件, 失敗 ${result.failedRows}件`);
      await loadDevices();
    } catch (error) {
      console.error('CSVインポートに失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">デバイス管理</h1>
        <div className="flex gap-2">
          <Button onClick={handleExport}>CSVエクスポート</Button>
          <label className="cursor-pointer">
            <Button variant="outline">CSVインポート</Button>
            <input
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <Button onClick={() => setIsEditing(true)}>新規作成</Button>
        </div>
      </div>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedDevice ? 'デバイス編集' : '新規デバイス作成'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">デバイス名</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="brand">ブランド</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">カテゴリ</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as 'iPhone' | 'Android' })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="iPhone">iPhone</option>
                    <option value="Android">Android</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="priceRange">価格帯</Label>
                  <select
                    id="priceRange"
                    value={formData.priceRange}
                    onChange={(e) => setFormData({ ...formData, priceRange: e.target.value as 'entry' | 'mid' | 'premium' })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="entry">エントリー</option>
                    <option value="mid">ミッド</option>
                    <option value="premium">プレミアム</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="price">価格</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="imageUrl">画像URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="specifications">仕様</Label>
                <textarea
                  id="specifications"
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="JSON形式で仕様を入力"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  {loading ? '保存中...' : '保存'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  キャンセル
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => (
          <Card key={device.id}>
            <CardHeader>
              <CardTitle className="text-lg">{device.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{device.brand}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">カテゴリ: {device.category}</p>
                <p className="text-sm">価格帯: {device.priceRange}</p>
                <p className="text-lg font-semibold">¥{device.price.toLocaleString()}</p>
                <p className="text-sm">
                  在庫: {device.inStock ? '有り' : '無し'}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" onClick={() => handleEdit(device)}>
                    編集
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDelete(device.id)}
                  >
                    削除
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="text-center py-4">
          <p>読み込み中...</p>
        </div>
      )}
    </div>
  );
};
