import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import { TrackingData } from '../types';

export class WebSocketClient {
  private client: Client;
  private isConnected: boolean = false;
  private subscriptions: Map<string, (data: TrackingData) => void> = new Map();

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('/ws/tracking'),
      connectHeaders: {},
      debug: (str) => {
        console.log('WebSocket Debug:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log('WebSocket connected');
      this.isConnected = true;
    };

    this.client.onDisconnect = () => {
      console.log('WebSocket disconnected');
      this.isConnected = false;
    };

    this.client.onStompError = (frame) => {
      console.error('WebSocket error:', frame.headers['message']);
    };
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        resolve();
        return;
      }

      this.client.onConnect = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        resolve();
      };

      this.client.onStompError = (frame) => {
        console.error('WebSocket connection error:', frame.headers['message']);
        reject(new Error(frame.headers['message']));
      };

      this.client.activate();
    });
  }

  subscribeToTracking(trackingNumber: string, callback: (data: TrackingData) => void): void {
    if (!this.isConnected) {
      console.error('WebSocket not connected');
      return;
    }

    const destination = `/topic/tracking/${trackingNumber}`;
    
    this.client.subscribe(destination, (message) => {
      try {
        const data: TrackingData = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error('Error parsing tracking data:', error);
      }
    });

    this.subscriptions.set(trackingNumber, callback);
    
    this.client.publish({
      destination: `/app/tracking/${trackingNumber}`,
      body: JSON.stringify({ trackingNumber })
    });
  }

  unsubscribeFromTracking(trackingNumber: string): void {
    this.subscriptions.delete(trackingNumber);
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.isConnected = false;
    }
  }
}

export const webSocketClient = new WebSocketClient();
