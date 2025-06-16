import { Badge } from '../ui/badge';

interface ColorOption {
  color: string;
  storageOptions: Array<{
    storage: string;
    inStock: boolean;
    quantity: number;
  }>;
}

interface ColorSelectorProps {
  colors: string[];
  inventory?: ColorOption[];
  selectedColor: string;
  selectedStorage: string;
  onColorChange: (color: string) => void;
  onStorageChange: (storage: string) => void;
}

export function ColorSelector({
  colors,
  inventory,
  selectedColor,
  selectedStorage,
  onColorChange,
  onStorageChange
}: ColorSelectorProps) {
  const getColorInventory = (color: string) => {
    return inventory?.find(inv => inv.color === color);
  };



  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">カラー</h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => {
            const colorInv = getColorInventory(color);
            const hasStock = colorInv?.storageOptions.some(opt => opt.inStock) ?? true;
            
            return (
              <button
                key={color}
                onClick={() => onColorChange(color)}
                disabled={!hasStock}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  selectedColor === color
                    ? 'border-blue-500 bg-blue-50'
                    : hasStock
                    ? 'border-gray-300 hover:border-gray-400'
                    : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                }`}
              >
                <span className="font-medium">{color}</span>
                {!hasStock && (
                  <Badge variant="secondary" className="ml-2">在庫切れ</Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedColor && (
        <div>
          <h3 className="text-lg font-semibold mb-3">ストレージ</h3>
          <div className="flex flex-wrap gap-3">
            {getColorInventory(selectedColor)?.storageOptions.map(({ storage, inStock, quantity }) => (
              <button
                key={storage}
                onClick={() => onStorageChange(storage)}
                disabled={!inStock}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${
                  selectedStorage === storage
                    ? 'border-blue-500 bg-blue-50'
                    : inStock
                    ? 'border-gray-300 hover:border-gray-400'
                    : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                }`}
              >
                <span className="font-medium">{storage}</span>
                {!inStock && (
                  <Badge variant="secondary" className="ml-2">在庫切れ</Badge>
                )}
                {inStock && quantity <= 3 && (
                  <Badge variant="outline" className="ml-2">残り{quantity}台</Badge>
                )}
              </button>
            )) || []}
          </div>
        </div>
      )}
    </div>
  );
}
