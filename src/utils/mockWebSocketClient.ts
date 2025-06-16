import { TrackingData } from '../types';

export class MockWebSocketClient {
  private isConnected: boolean = false;
  private subscriptions: Map<string, (data: TrackingData) => void> = new Map();
  private intervalId: NodeJS.Timeout | null = null;

  async connect(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        console.log('Mock WebSocket connected');
        resolve();
      }, 1000);
    });
  }

  subscribeToTracking(trackingNumber: string, callback: (data: TrackingData) => void): void {
    if (!this.isConnected) {
      console.error('Mock WebSocket not connected');
      return;
    }

    this.subscriptions.set(trackingNumber, callback);
    
    const mockData: TrackingData = {
      trackingNumber,
      status: 'IN_TRANSIT',
      estimatedDelivery: '2024-06-14T15:00:00Z',
      events: [
        {
          id: 1,
          status: 'SHIPPED',
          location: '東京配送センター',
          latitude: 35.6762,
          longitude: 139.6503,
          timestamp: '2024-06-13T08:00:00Z',
          description: '商品が発送されました'
        },
        {
          id: 2,
          status: 'IN_TRANSIT',
          location: '横浜中継センター',
          latitude: 35.4437,
          longitude: 139.6380,
          estimatedArrivalTime: '2024-06-14T15:00:00Z',
          timestamp: '2024-06-13T12:00:00Z',
          description: '配送中です'
        }
      ]
    };

    callback(mockData);

    this.intervalId = setInterval(() => {
      const updatedData: TrackingData = {
        ...mockData,
        events: [
          ...mockData.events,
          {
            id: mockData.events.length + 1,
            status: 'IN_TRANSIT',
            location: `配送車両 - ${new Date().toLocaleTimeString('ja-JP')}`,
            latitude: 35.4437 + (Math.random() - 0.5) * 0.01,
            longitude: 139.6380 + (Math.random() - 0.5) * 0.01,
            timestamp: new Date().toISOString(),
            description: `位置更新: ${new Date().toLocaleTimeString('ja-JP')}`
          }
        ]
      };
      callback(updatedData);
    }, 10000);
  }

  unsubscribeFromTracking(trackingNumber: string): void {
    this.subscriptions.delete(trackingNumber);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  disconnect(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.subscriptions.clear();
    this.isConnected = false;
    console.log('Mock WebSocket disconnected');
  }
}

export const mockWebSocketClient = new MockWebSocketClient();
