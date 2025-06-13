import { useState, useEffect } from 'react';
import { ConvenienceStore, DeliveryTimeSlot, ShippingOption } from '../types';
import { shippingApi } from '../api/shippingApi';

export const useShippingData = () => {
  const [convenienceStores, setConvenienceStores] = useState<ConvenienceStore[]>([]);
  const [deliveryTimeSlots, setDeliveryTimeSlots] = useState<DeliveryTimeSlot[]>([]);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [stores, timeSlots, options] = await Promise.all([
          shippingApi.getAllConvenienceStores(),
          shippingApi.getDeliveryTimeSlots(),
          Promise.resolve([
            { id: 1, optionCode: 'unattended', optionName: '置き配', description: '玄関前などに荷物を置いて配送完了', requiresRecipientInfo: false, isActive: true },
            { id: 2, optionCode: 'delivery_box', optionName: '宅配ボックス', description: 'マンション等の宅配ボックスに配送', requiresRecipientInfo: false, isActive: true },
            { id: 3, optionCode: 'face_to_face', optionName: '対面受取', description: '受取人との対面での受け渡し', requiresRecipientInfo: true, isActive: true },
            { id: 4, optionCode: 'recipient_only', optionName: '本人限定受取', description: '本人確認書類による本人限定受取', requiresRecipientInfo: true, isActive: true }
          ])
        ]);
        
        setConvenienceStores(stores);
        setDeliveryTimeSlots(timeSlots);
        setShippingOptions(options);
      } catch (err) {
        setError(err instanceof Error ? err.message : '配送データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const searchStores = async (params: {
    prefecture?: string;
    city?: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
  }) => {
    try {
      const stores = await shippingApi.searchConvenienceStores(params);
      setConvenienceStores(stores);
      return stores;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'コンビニ店舗の検索に失敗しました');
      return [];
    }
  };

  return {
    convenienceStores,
    deliveryTimeSlots,
    shippingOptions,
    loading,
    error,
    searchStores
  };
};
