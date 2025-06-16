import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TrackingEvent } from '../../types';

interface DeliveryMapProps {
  events: TrackingEvent[];
  className?: string;
}

export const DeliveryMap: React.FC<DeliveryMapProps> = ({ events, className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    mapRef.current.innerHTML = '';

    const map = L.map(mapRef.current).setView([35.6762, 139.6503], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const locationEvents = events.filter(event => event.latitude && event.longitude);

    if (locationEvents.length > 0) {
      const latLngs: L.LatLngExpression[] = locationEvents.map(event => [
        event.latitude!,
        event.longitude!
      ]);

      const polyline = L.polyline(latLngs, { color: 'blue', weight: 3 }).addTo(map);
      map.fitBounds(polyline.getBounds());

      locationEvents.forEach((event, index) => {
        const isLatest = index === locationEvents.length - 1;
        const marker = L.marker([event.latitude!, event.longitude!])
          .addTo(map)
          .bindPopup(`
            <div>
              <strong>${event.description}</strong><br/>
              ${event.location}<br/>
              ${new Date(event.timestamp).toLocaleString('ja-JP')}
            </div>
          `);

        if (isLatest) {
          marker.openPopup();
          const truckIcon = L.divIcon({
            html: '🚚',
            className: 'truck-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
          });
          marker.setIcon(truckIcon);
        }
      });
    }

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [events]);

  return (
    <div className={`delivery-map ${className}`}>
      <h3 className="text-lg font-semibold mb-4">配送ルート</h3>
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border border-gray-300"
        style={{ minHeight: '400px' }}
      />
      <style>{`
        .truck-icon {
          background: none !important;
          border: none !important;
          font-size: 24px;
        }
      `}</style>
    </div>
  );
};
