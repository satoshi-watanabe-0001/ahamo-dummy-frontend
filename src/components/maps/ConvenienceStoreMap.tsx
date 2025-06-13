import { useState, useEffect } from 'react';
import { ConvenienceStore } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface ConvenienceStoreMapProps {
  onStoreSelect: (store: ConvenienceStore) => void;
  selectedStore?: ConvenienceStore | null;
}

export const ConvenienceStoreMap = ({ onStoreSelect, selectedStore }: ConvenienceStoreMapProps) => {
  const [stores, setStores] = useState<ConvenienceStore[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const searchStores = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/shipping/convenience-stores/search?prefecture=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setStores(data);
      }
    } catch (error) {
      console.error('コンビニ店舗の検索に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadDefaultStores = async () => {
      try {
        const response = await fetch('/api/v1/shipping/convenience-stores');
        if (response.ok) {
          const data = await response.json();
          setStores(data.slice(0, 10));
        }
      } catch (error) {
        console.error('コンビニ店舗の取得に失敗しました:', error);
        setStores([
          {
            id: 1,
            storeCode: '7ELV001',
            storeName: 'セブン-イレブン渋谷駅前店',
            chainName: 'セブン-イレブン',
            postalCode: '150-0002',
            prefecture: '東京都',
            city: '渋谷区',
            addressLine1: '渋谷1-1-1',
            operatingHours: '24時間営業',
            isActive: true
          },
          {
            id: 2,
            storeCode: 'FAMI001',
            storeName: 'ファミリーマート新宿南口店',
            chainName: 'ファミリーマート',
            postalCode: '160-0022',
            prefecture: '東京都',
            city: '新宿区',
            addressLine1: '新宿3-35-1',
            operatingHours: '24時間営業',
            isActive: true
          }
        ]);
      }
    };
    loadDefaultStores();
  }, []);

  return (
    <div className="space-y-4">
      <h4 className="font-medium">コンビニ店舗を選択</h4>
      
      <div className="flex gap-2">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="都道府県または市区町村で検索"
          className="flex-1"
        />
        <Button 
          type="button" 
          onClick={searchStores}
          disabled={loading}
          variant="outline"
        >
          {loading ? '検索中...' : '検索'}
        </Button>
      </div>

      <div className="max-h-64 overflow-y-auto border rounded-lg">
        {stores.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            コンビニ店舗が見つかりませんでした
          </div>
        ) : (
          <div className="space-y-2 p-2">
            {stores.map((store) => (
              <div
                key={store.id}
                className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedStore?.id === store.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => onStoreSelect(store)}
              >
                <div className="font-medium">{store.storeName}</div>
                <div className="text-sm text-gray-600">{store.chainName}</div>
                <div className="text-sm text-gray-500">
                  〒{store.postalCode} {store.prefecture} {store.city} {store.addressLine1}
                </div>
                {store.operatingHours && (
                  <div className="text-sm text-gray-500">営業時間: {store.operatingHours}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedStore && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-900">選択された店舗</h5>
          <div className="text-sm text-blue-800 mt-1">
            {selectedStore.storeName} ({selectedStore.chainName})
          </div>
          <div className="text-sm text-blue-700">
            〒{selectedStore.postalCode} {selectedStore.prefecture} {selectedStore.city} {selectedStore.addressLine1}
          </div>
        </div>
      )}
    </div>
  );
};
