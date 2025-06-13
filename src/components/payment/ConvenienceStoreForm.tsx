

interface ConvenienceStoreFormProps {
  register: any;
}

export const ConvenienceStoreForm = ({ register }: ConvenienceStoreFormProps) => {
  const convenienceStores = [
    { value: 'seven_eleven', label: 'セブン-イレブン' },
    { value: 'family_mart', label: 'ファミリーマート' },
    { value: 'lawson', label: 'ローソン' },
    { value: 'ministop', label: 'ミニストップ' },
    { value: 'daily_yamazaki', label: 'デイリーヤマザキ' }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="font-medium text-blue-800 mb-2">コンビニ払いについて</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 毎月の請求書をコンビニでお支払いいただけます</li>
          <li>• 手数料として110円（税込）が発生します</li>
          <li>• 支払い期限は請求書発行から30日間です</li>
          <li>• バーコード付きの請求書をお送りします</li>
        </ul>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">
          ご利用予定のコンビニエンスストア
        </label>
        <select
          {...register('convenienceStore')}
          className="w-full p-2 border rounded-md"
        >
          <option value="">選択してください</option>
          {convenienceStores.map(store => (
            <option key={store.value} value={store.value}>
              {store.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
        <p className="text-sm text-yellow-800">
          <strong>注意:</strong> コンビニ払いを選択された場合、毎月請求書をお送りします。
          支払い忘れにご注意ください。
        </p>
      </div>
    </div>
  );
};
