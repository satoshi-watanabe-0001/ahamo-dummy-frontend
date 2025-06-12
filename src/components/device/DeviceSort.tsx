export type SortOption = 'price-asc' | 'price-desc' | 'release-date' | 'popularity';

interface DeviceSortProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
}

export function DeviceSort({ sortBy, onSortChange }: DeviceSortProps) {
  const sortOptions = [
    { value: 'popularity', label: '人気順' },
    { value: 'price-asc', label: '価格: 安い順' },
    { value: 'price-desc', label: '価格: 高い順' },
    { value: 'release-date', label: '発売日順' }
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">並び順:</span>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="flex h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
