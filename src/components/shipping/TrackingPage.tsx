import React, { useState, useEffect } from 'react';
import { ShippingTimeline } from './ShippingTimeline';
import { DeliveryMap } from './DeliveryMap';
import { DeliveryOptions } from './DeliveryOptions';
import { DeliveryRating } from './DeliveryRating';
import { mockWebSocketClient as webSocketClient } from '../../utils/mockWebSocketClient';
import { TrackingData } from '../../types';

interface TrackingPageProps {
  trackingNumber: string;
}

export const TrackingPage: React.FC<TrackingPageProps> = ({ trackingNumber }) => {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const connectAndSubscribe = async () => {
      try {
        await webSocketClient.connect();
        setIsConnected(true);
        
        webSocketClient.subscribeToTracking(trackingNumber, (data) => {
          setTrackingData(data);
          setError(null);
        });
      } catch (err) {
        setError('WebSocket接続に失敗しました');
        console.error('WebSocket connection failed:', err);
      }
    };

    connectAndSubscribe();

    return () => {
      webSocketClient.unsubscribeFromTracking(trackingNumber);
    };
  }, [trackingNumber]);

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>エラー:</strong> {error}
        </div>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">配送情報を読み込み中...</p>
            {!isConnected && <p className="text-sm text-gray-500 mt-2">WebSocketに接続中...</p>}
          </div>
        </div>
      </div>
    );
  }

  const isDelivered = trackingData.status === 'DELIVERED';
  const canChangeDelivery = ['SHIPPED', 'IN_TRANSIT'].includes(trackingData.status);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">配送追跡</h1>
        <p className="text-gray-600">追跡番号: {trackingNumber}</p>
        <div className="flex items-center mt-2">
          <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'リアルタイム更新中' : '接続中...'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <ShippingTimeline 
            events={trackingData.events} 
            currentStatus={trackingData.status} 
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <DeliveryMap events={trackingData.events} />
        </div>
      </div>

      {trackingData.estimatedDelivery && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">配達予定</h3>
          <p className="text-blue-700">
            {new Date(trackingData.estimatedDelivery).toLocaleString('ja-JP')}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {canChangeDelivery && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <DeliveryOptions trackingNumber={trackingNumber} />
          </div>
        )}
        
        {isDelivered && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <DeliveryRating trackingNumber={trackingNumber} />
          </div>
        )}
      </div>
    </div>
  );
};
