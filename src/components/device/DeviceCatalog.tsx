import { useState, useEffect, useMemo } from 'react';
import { Device } from '../../types';
import { deviceApi } from '../../utils/api';
import { DeviceCard } from './DeviceCard';
import { DeviceFilters, FilterState } from './DeviceFilters';
import { DeviceSort, SortOption } from './DeviceSort';

interface DeviceCatalogProps {
  className?: string;
  onDeviceSelect?: (deviceId: string) => void;
}

export function DeviceCatalog({ className, onDeviceSelect }: DeviceCatalogProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    manufacturer: '',
    priceRange: '',
    category: '',
    inStock: null
  });
  const [sortBy, setSortBy] = useState<SortOption>('popularity');

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const response = await deviceApi.getDevices();
      setDevices(response.data.devices || []);
    } catch (error) {
      console.error('Failed to load devices:', error);
    } finally {
      setLoading(false);
    }
  };

  const manufacturers = useMemo(() => {
    const uniqueManufacturers = [...new Set(devices.map(device => device.brand))];
    return uniqueManufacturers.sort();
  }, [devices]);

  const filteredAndSortedDevices = useMemo(() => {
    let filtered = devices.filter(device => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!device.name.toLowerCase().includes(searchLower) && 
            !device.brand.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      if (filters.manufacturer && device.brand !== filters.manufacturer) {
        return false;
      }

      if (filters.priceRange && device.priceRange !== filters.priceRange) {
        return false;
      }

      if (filters.category && device.category !== filters.category) {
        return false;
      }

      if (filters.inStock !== null && device.inStock !== filters.inStock) {
        return false;
      }

      return true;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'release-date':
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        case 'popularity':
        default:
          return b.popularity - a.popularity;
      }
    });

    return filtered;
  }, [devices, filters, sortBy]);

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">デバイスカタログ</h1>
        <DeviceSort sortBy={sortBy} onSortChange={setSortBy} />
      </div>

      <DeviceFilters 
        filters={filters}
        onFiltersChange={setFilters}
        manufacturers={manufacturers}
      />

      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          {filteredAndSortedDevices.length}件のデバイスが見つかりました
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">読み込み中...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedDevices.map((device) => (
            <DeviceCard key={device.id} device={device} onClick={() => onDeviceSelect?.(device.id)} />
          ))}
        </div>
      )}

      {!loading && filteredAndSortedDevices.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">条件に一致するデバイスが見つかりませんでした。</p>
        </div>
      )}
    </div>
  );
}
