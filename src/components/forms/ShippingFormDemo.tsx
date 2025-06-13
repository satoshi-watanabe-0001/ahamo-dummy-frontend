import { useState } from 'react';

interface Address {
  postalCode: string;
  prefecture: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  building?: string;
}

interface FormData {
  addressType?: string;
  deliveryOption?: string;
  deliveryNotes?: string;
}

export const ShippingFormDemo = () => {
  const [step, setStep] = useState<'address' | 'options' | 'complete'>('address');
  const [formData, setFormData] = useState<FormData>({});

  const contractAddress: Address = {
    postalCode: '150-0002',
    prefecture: '東京都',
    city: '渋谷区',
    addressLine1: '渋谷1-1-1',
    addressLine2: 'サンプルマンション101',
    building: 'サンプルビル'
  };

  const handleAddressSubmit = (data: FormData) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep('options');
  };

  const handleOptionsSubmit = (data: FormData) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep('complete');
  };

  if (step === 'complete') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-green-600">配送設定が完了しました！</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">配送先タイプ:</h3>
            <p>{formData.addressType === 'contract' ? '契約住所' : 
                formData.addressType === 'alternate' ? '別住所' :
                formData.addressType === 'work' ? '勤務先' : 'コンビニ受取'}</p>
          </div>
          
          <div>
            <h3 className="font-medium">配送オプション:</h3>
            <p>{formData.deliveryOption || '未選択'}</p>
          </div>
          
          {formData.deliveryNotes && (
            <div>
              <h3 className="font-medium">配送メモ:</h3>
              <p>{formData.deliveryNotes}</p>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => {
            setStep('address');
            setFormData({});
          }}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          新しい配送設定を開始
        </button>
      </div>
    );
  }

  if (step === 'address') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">配送先住所選択</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">契約住所</h4>
            <p>{contractAddress.postalCode}</p>
            <p>{contractAddress.prefecture} {contractAddress.city}</p>
            <p>{contractAddress.addressLine1}</p>
            {contractAddress.addressLine2 && <p>{contractAddress.addressLine2}</p>}
          </div>
          
          <button 
            onClick={() => handleAddressSubmit({ addressType: 'contract' })}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            この住所を使用して次へ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">配送オプション選択</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">配送方法</h3>
          <div className="space-y-2">
            <button 
              onClick={() => handleOptionsSubmit({ deliveryOption: '置き配' })}
              className="w-full p-3 text-left border rounded hover:bg-gray-50"
            >
              <div className="font-medium">置き配</div>
              <div className="text-sm text-gray-600">玄関前などに荷物を置いて配送完了</div>
            </button>
            <button 
              onClick={() => handleOptionsSubmit({ deliveryOption: '対面受取' })}
              className="w-full p-3 text-left border rounded hover:bg-gray-50"
            >
              <div className="font-medium">対面受取</div>
              <div className="text-sm text-gray-600">受取人との対面での受け渡し</div>
            </button>
          </div>
        </div>
        
        <button 
          onClick={() => setStep('address')}
          className="px-4 py-2 border rounded hover:bg-gray-50"
        >
          戻る
        </button>
      </div>
    </div>
  );
};
