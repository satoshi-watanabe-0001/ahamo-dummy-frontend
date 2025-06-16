export interface TrackingApiResponse {
  trackingNumber: string;
  status: string;
  events: Array<{
    id: number;
    status: string;
    location: string;
    latitude?: number;
    longitude?: number;
    estimatedArrivalTime?: string;
    timestamp: string;
    description: string;
  }>;
  estimatedDelivery: string;
}

export const trackingApi = {
  async getTrackingData(trackingNumber: string): Promise<TrackingApiResponse> {
    const response = await fetch(`/api/shipping/track?trackingNumber=${trackingNumber}`);
    if (!response.ok) {
      throw new Error('配送追跡データの取得に失敗しました');
    }
    return response.json();
  },

  async changeDeliveryTime(trackingNumber: string, data: { deliveryDate: string; timeWindow: string }) {
    const response = await fetch(`/api/shipping/delivery-time/${trackingNumber}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('配達日時の変更に失敗しました');
    }
    return response.json();
  },

  async requestRedelivery(trackingNumber: string, data: { deliveryDate?: string; timeWindow?: string }) {
    const response = await fetch(`/api/shipping/redelivery/${trackingNumber}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('再配達の依頼に失敗しました');
    }
    return response.json();
  },

  async confirmDelivery(trackingNumber: string, data: { rating: number; feedback?: string }) {
    const response = await fetch(`/api/shipping/confirm-delivery/${trackingNumber}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('配達確認に失敗しました');
    }
    return response.json();
  }
};
