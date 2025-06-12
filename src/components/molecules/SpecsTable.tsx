interface SpecsTableProps {
  specifications: string;
  deviceName: string;
}

export function SpecsTable({ specifications, deviceName }: SpecsTableProps) {
  let specs: Record<string, string> = {};
  
  try {
    specs = specifications ? JSON.parse(specifications) : {};
  } catch (error) {
    console.error('Failed to parse specifications:', error);
  }

  const specCategories = {
    display: ['display', 'ディスプレイ', '画面'],
    performance: ['chip', 'cpu', 'processor', 'チップ', 'プロセッサ'],
    camera: ['camera', 'カメラ'],
    battery: ['battery', 'バッテリー'],
    storage: ['storage', 'ストレージ', '容量'],
    connectivity: ['connectivity', '通信', '接続'],
    other: []
  };

  const categorizeSpecs = () => {
    const categorized: Record<string, Array<[string, string]>> = {
      display: [],
      performance: [],
      camera: [],
      battery: [],
      storage: [],
      connectivity: [],
      other: []
    };

    Object.entries(specs).forEach(([key, value]) => {
      const lowerKey = key.toLowerCase();
      let category = 'other';
      
      for (const [cat, keywords] of Object.entries(specCategories)) {
        if (keywords.some(keyword => lowerKey.includes(keyword))) {
          category = cat;
          break;
        }
      }
      
      categorized[category].push([key, value]);
    });

    return categorized;
  };

  const categorizedSpecs = categorizeSpecs();
  const categoryLabels = {
    display: 'ディスプレイ',
    performance: 'パフォーマンス',
    camera: 'カメラ',
    battery: 'バッテリー',
    storage: 'ストレージ',
    connectivity: '通信・接続',
    other: 'その他'
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">{deviceName} 詳細仕様</h3>
      
      {Object.entries(categorizedSpecs).map(([category, items]) => {
        if (items.length === 0) return null;
        
        return (
          <div key={category} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 className="font-semibold text-gray-900">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </h4>
            </div>
            <div className="divide-y divide-gray-200">
              {items.map(([key, value]) => (
                <div key={key} className="px-4 py-3 flex justify-between items-center">
                  <span className="text-gray-600 font-medium">{key}</span>
                  <span className="text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
