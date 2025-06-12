import { useState } from 'react';
import { Button } from '../ui/button';

interface ImageGalleryProps {
  images: string[];
  deviceName: string;
  selectedColor?: string;
}

export function ImageGallery({ images, deviceName, selectedColor }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  const handlePrevious = () => {
    setSelectedImageIndex(prev => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImageIndex(prev => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">画像がありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div 
          className={`relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer transition-all duration-300 ${
            isZoomed ? 'h-96 md:h-[500px]' : 'h-64 md:h-80'
          }`}
          onClick={handleZoomToggle}
        >
          <img
            src={images[selectedImageIndex]}
            alt={`${deviceName} - ${selectedColor || ''}`}
            className={`w-full h-full transition-all duration-300 ${
              isZoomed ? 'object-contain' : 'object-cover'
            }`}
            loading="lazy"
          />
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
              >
                ←
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
              >
                →
              </Button>
            </>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          クリックで{isZoomed ? '縮小' : '拡大'}
        </p>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleImageClick(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                index === selectedImageIndex
                  ? 'border-blue-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${deviceName} サムネイル ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
