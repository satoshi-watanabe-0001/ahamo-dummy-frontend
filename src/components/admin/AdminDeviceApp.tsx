import { useState, useEffect } from 'react';
import { Device, AdminDeviceRequest, DeviceImportResult } from '../../types';
import { adminDeviceApi } from '../../utils/api';

interface AdminDeviceAppProps {
  className?: string;
}

export const AdminDeviceApp = ({ className }: AdminDeviceAppProps) => {
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

  const handleSubmit = async (e: any) => {
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

  const handleImport = async (e: any) => {
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
    <div className={`min-h-screen bg-gray-50 p-6 ${className || ''}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">デバイス管理</h1>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              CSVエクスポート
            </button>
            <label className="cursor-pointer">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block">
                CSVインポート
              </span>
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              新規作成
            </button>
          </div>
        </div>

        {isEditing && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">
                {selectedDevice ? 'デバイス編集' : '新規デバイス作成'}
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      デバイス名
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ブランド
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      カテゴリ
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as 'iPhone' | 'Android' })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="iPhone">iPhone</option>
                      <option value="Android">Android</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      価格帯
                    </label>
                    <select
                      value={formData.priceRange}
                      onChange={(e) => setFormData({ ...formData, priceRange: e.target.value as 'entry' | 'mid' | 'premium' })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="entry">エントリー</option>
                      <option value="mid">ミッド</option>
                      <option value="premium">プレミアム</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      価格
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      画像URL
                    </label>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    仕様
                  </label>
                  <textarea
                    value={formData.specifications}
                    onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="JSON形式で仕様を入力"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? '保存中...' : '保存'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => (
            <div key={device.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{device.name}</h3>
                <p className="text-sm text-gray-600">{device.brand}</p>
              </div>
              <div className="p-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">カテゴリ: {device.category}</p>
                  <p className="text-sm text-gray-600">価格帯: {device.priceRange}</p>
                  <p className="text-lg font-semibold text-gray-900">¥{device.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">
                    在庫: {device.inStock ? '有り' : '無し'}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(device)}
                      className="bg-blue-600 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(device.id)}
                      className="bg-red-600 text-white px-3 py-1 text-sm rounded-md hover:bg-red-700 transition-colors"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center py-4">
            <p className="text-gray-600">読み込み中...</p>
          </div>
        )}
      </div>
    </div>
  );
};
