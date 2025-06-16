import { useEffect, useState, useRef } from 'react';
import { LocationUpdate } from '../../types';

interface WebSocketTrackingClientProps {
  trackingNumber: string;
  onLocationUpdate: (update: LocationUpdate) => void;
  onStatusChange: (status: string) => void;
}

export const WebSocketTrackingClient = ({ 
  trackingNumber, 
  onLocationUpdate, 
  onStatusChange 
}: WebSocketTrackingClientProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    try {
      const wsUrl = `ws://localhost:8080/ws/tracking/${trackingNumber}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setError(null);
        console.log(`WebSocket connected for tracking: ${trackingNumber}`);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'LOCATION_UPDATE') {
            onLocationUpdate(data.payload as LocationUpdate);
          } else if (data.type === 'STATUS_CHANGE') {
            onStatusChange(data.payload.status);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected, attempting to reconnect...');
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 5000);
      };

      wsRef.current.onerror = (err) => {
        setError('WebSocket connection error');
        console.error('WebSocket error:', err);
      };

    } catch (err) {
      setError('Failed to establish WebSocket connection');
      console.error('WebSocket connection failed:', err);
    }
  };

  useEffect(() => {
    if (trackingNumber) {
      connect();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [trackingNumber]);

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className="text-gray-600">
        {isConnected ? 'リアルタイム追跡中' : error || '接続中...'}
      </span>
    </div>
  );
};
