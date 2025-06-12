import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useDebounce } from '../../hooks/useDebounce';

export interface FilterState {
  search: string;
  manufacturer: string;
  priceRange: string;
  category: string;
  inStock: boolean | null;
}

interface DeviceFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  manufacturers: string[];
}

export function DeviceFilters({ filters, onFiltersChange, manufacturers }: DeviceFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFiltersChange({ ...filters, search: debouncedSearch });
    }
  }, [debouncedSearch, filters, onFiltersChange]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setLocalSearch('');
    onFiltersChange({
      search: '',
      manufacturer: '',
      priceRange: '',
      category: '',
      inStock: null
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">検索</label>
            <Input
              placeholder="デバイス名またはメーカーで検索..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">メーカー</label>
              <select
                value={filters.manufacturer}
                onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">すべて</option>
                {manufacturers.map(manufacturer => (
                  <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">価格帯</label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">すべて</option>
                <option value="entry">エントリー</option>
                <option value="mid">ミッド</option>
                <option value="premium">プレミアム</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">カテゴリ</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">すべて</option>
                <option value="iPhone">iPhone</option>
                <option value="Android">Android</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">在庫状況</label>
              <select
                value={filters.inStock === null ? '' : filters.inStock.toString()}
                onChange={(e) => handleFilterChange('inStock', e.target.value === '' ? null : e.target.value === 'true')}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">すべて</option>
                <option value="true">在庫あり</option>
                <option value="false">在庫切れ</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={clearFilters}>
              フィルターをクリア
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
