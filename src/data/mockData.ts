import { Plan, Device, Contract } from '../types';

export const mockPlans: Plan[] = [
  {
    id: '1',
    name: 'ahamo',
    description: '20GBの大容量で安心。5分以内の国内通話無料。',
    monthlyFee: 2970,
    dataCapacity: '20GB',
    voiceCalls: '5分以内無料',
    sms: '送信3.3円/通',
    features: [
      '20GBまで高速データ通信',
      '5分以内の国内通話無料',
      '海外82の国・地域でデータ通信可能',
      'dカード支払いで1GB追加',
      '5G対応',
      'テザリング無料'
    ],
    isPopular: true,
    isActive: true
  },
  {
    id: '2',
    name: 'ahamo大盛り',
    description: '100GBの超大容量プラン。動画もゲームも思う存分。',
    monthlyFee: 4950,
    dataCapacity: '100GB',
    voiceCalls: '5分以内無料',
    sms: '送信3.3円/通',
    features: [
      '100GBまで高速データ通信',
      '5分以内の国内通話無料',
      '海外82の国・地域でデータ通信可能',
      'dカード支払いで5GB追加',
      '5G対応',
      'テザリング無料',
      '動画配信サービス最適化'
    ],
    isPopular: false,
    isActive: true
  },
  {
    id: '3',
    name: 'ahamoライト',
    description: 'ライトユーザー向けの3GBプラン。',
    monthlyFee: 1980,
    dataCapacity: '3GB',
    voiceCalls: '22円/30秒',
    sms: '送信3.3円/通',
    features: [
      '3GBまで高速データ通信',
      '海外82の国・地域でデータ通信可能',
      '5G対応',
      'テザリング無料',
      'dカード支払いで500MB追加'
    ],
    isPopular: false,
    isActive: true
  }
];

export const mockDevices: Device[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    category: 'iPhone',
    priceRange: 'premium',
    price: 159800,
    colors: ['ナチュラルチタニウム', 'ブルーチタニウム', 'ホワイトチタニウム', 'ブラックチタニウム'],
    storageOptions: ['128GB', '256GB', '512GB', '1TB'],
    inStock: true,
    imageUrl: 'https://example.com/iphone15pro.jpg',
    specifications: JSON.stringify({
      display: '6.1インチ Super Retina XDR',
      chip: 'A17 Pro',
      camera: 'Pro 48MPカメラシステム',
      battery: 'ビデオ再生最大23時間',
      storage: '128GB〜1TB',
      connectivity: '5G対応'
    }),
    galleryImages: [
      'https://example.com/iphone15pro_1.jpg',
      'https://example.com/iphone15pro_2.jpg'
    ]
  },
  {
    id: '2',
    name: 'iPhone 15',
    brand: 'Apple',
    category: 'iPhone',
    priceRange: 'mid',
    price: 124800,
    colors: ['ピンク', 'イエロー', 'グリーン', 'ブルー', 'ブラック'],
    storageOptions: ['128GB', '256GB', '512GB'],
    inStock: true,
    imageUrl: 'https://example.com/iphone15.jpg',
    specifications: JSON.stringify({
      display: '6.1インチ Super Retina XDR',
      chip: 'A16 Bionic',
      camera: 'デュアル48MPカメラシステム',
      battery: 'ビデオ再生最大20時間',
      storage: '128GB〜512GB',
      connectivity: '5G対応'
    }),
    galleryImages: [
      'https://example.com/iphone15_1.jpg',
      'https://example.com/iphone15_2.jpg'
    ]
  },
  {
    id: '3',
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'Android',
    priceRange: 'premium',
    price: 189700,
    colors: ['チタニウムグレー', 'チタニウムブラック', 'チタニウムバイオレット'],
    storageOptions: ['256GB', '512GB', '1TB'],
    inStock: true,
    imageUrl: 'https://example.com/galaxys24ultra.jpg',
    specifications: JSON.stringify({
      display: '6.8インチ Dynamic AMOLED 2X',
      chip: 'Snapdragon 8 Gen 3',
      camera: '200MP広角カメラ',
      battery: '5000mAh',
      storage: '256GB〜1TB',
      connectivity: '5G対応',
      spen: 'S Pen内蔵'
    }),
    galleryImages: [
      'https://example.com/galaxys24ultra_1.jpg',
      'https://example.com/galaxys24ultra_2.jpg'
    ]
  },
  {
    id: '4',
    name: 'Galaxy S24',
    brand: 'Samsung',
    category: 'Android',
    priceRange: 'mid',
    price: 124700,
    colors: ['オニキスブラック', 'マーブルグレー', 'コバルトバイオレット'],
    storageOptions: ['256GB', '512GB'],
    inStock: true,
    imageUrl: 'https://example.com/galaxys24.jpg',
    specifications: JSON.stringify({
      display: '6.2インチ Dynamic AMOLED 2X',
      chip: 'Snapdragon 8 Gen 3',
      camera: '50MP広角カメラ',
      battery: '4000mAh',
      storage: '256GB〜512GB',
      connectivity: '5G対応'
    }),
    galleryImages: [
      'https://example.com/galaxys24_1.jpg',
      'https://example.com/galaxys24_2.jpg'
    ]
  },
  {
    id: '5',
    name: 'Xperia 1 VI',
    brand: 'Sony',
    category: 'Android',
    priceRange: 'premium',
    price: 174900,
    colors: ['ブラック', 'プラチナシルバー', 'スカーレット'],
    storageOptions: ['256GB', '512GB'],
    inStock: true,
    imageUrl: 'https://example.com/xperia1vi.jpg',
    specifications: JSON.stringify({
      display: '6.5インチ 4K HDR OLED',
      chip: 'Snapdragon 8 Gen 3',
      camera: 'Zeiss光学系トリプルカメラ',
      battery: '5000mAh',
      storage: '256GB〜512GB',
      connectivity: '5G対応',
      audio: 'ハイレゾ音源対応'
    }),
    galleryImages: [
      'https://example.com/xperia1vi_1.jpg',
      'https://example.com/xperia1vi_2.jpg'
    ]
  },
  {
    id: '6',
    name: 'AQUOS sense8',
    brand: 'Sharp',
    category: 'Android',
    priceRange: 'entry',
    price: 62700,
    colors: ['ライトカッパー', 'ペールグリーン', 'コバルトブラック'],
    storageOptions: ['128GB'],
    inStock: true,
    imageUrl: 'https://example.com/aquossense8.jpg',
    specifications: JSON.stringify({
      display: '6.1インチ IGZO OLED',
      chip: 'Snapdragon 6 Gen 1',
      camera: '50MP標準カメラ',
      battery: '5000mAh',
      storage: '128GB',
      connectivity: '5G対応',
      waterproof: 'IPX5/IPX8防水'
    }),
    galleryImages: [
      'https://example.com/aquossense8_1.jpg',
      'https://example.com/aquossense8_2.jpg'
    ]
  },
  {
    id: '7',
    name: 'iPhone SE (第3世代)',
    brand: 'Apple',
    category: 'iPhone',
    priceRange: 'entry',
    price: 62800,
    colors: ['ミッドナイト', 'スターライト', '(PRODUCT)RED'],
    storageOptions: ['64GB', '128GB', '256GB'],
    inStock: true,
    imageUrl: 'https://example.com/iphonese3.jpg',
    specifications: JSON.stringify({
      display: '4.7インチ Retina HD',
      chip: 'A15 Bionic',
      camera: '12MPシングルカメラ',
      battery: 'ビデオ再生最大15時間',
      storage: '64GB〜256GB',
      connectivity: '5G対応'
    }),
    galleryImages: [
      'https://example.com/iphonese3_1.jpg',
      'https://example.com/iphonese3_2.jpg'
    ]
  },
  {
    id: '8',
    name: 'Pixel 8 Pro',
    brand: 'Google',
    category: 'Android',
    priceRange: 'premium',
    price: 159800,
    colors: ['オブシディアン', 'ポーセリン', 'ベイ'],
    storageOptions: ['128GB', '256GB', '512GB'],
    inStock: true,
    imageUrl: 'https://example.com/pixel8pro.jpg',
    specifications: JSON.stringify({
      display: '6.7インチ LTPO OLED',
      chip: 'Google Tensor G3',
      camera: '50MP Octa PD広角カメラ',
      battery: '5050mAh',
      storage: '128GB〜512GB',
      connectivity: '5G対応',
      ai: 'AI機能搭載'
    }),
    galleryImages: [
      'https://example.com/pixel8pro_1.jpg',
      'https://example.com/pixel8pro_2.jpg'
    ]
  },
  {
    id: '9',
    name: 'Pixel 8',
    brand: 'Google',
    category: 'Android',
    priceRange: 'mid',
    price: 112900,
    colors: ['オブシディアン', 'ヘーゼル', 'ローズ'],
    storageOptions: ['128GB', '256GB'],
    inStock: true,
    imageUrl: 'https://example.com/pixel8.jpg',
    specifications: JSON.stringify({
      display: '6.2インチ OLED',
      chip: 'Google Tensor G3',
      camera: '50MP Octa PD広角カメラ',
      battery: '4575mAh',
      storage: '128GB〜256GB',
      connectivity: '5G対応',
      ai: 'AI機能搭載'
    }),
    galleryImages: [
      'https://example.com/pixel8_1.jpg',
      'https://example.com/pixel8_2.jpg'
    ]
  },
  {
    id: '10',
    name: 'arrows N',
    brand: 'FCNT',
    category: 'Android',
    priceRange: 'entry',
    price: 98780,
    colors: ['フォグホワイト', 'フォレストブラック'],
    storageOptions: ['128GB'],
    inStock: true,
    imageUrl: 'https://example.com/arrowsn.jpg',
    specifications: JSON.stringify({
      display: '6.24インチ有機EL',
      chip: 'Snapdragon 695 5G',
      camera: '50MP + 8MP デュアルカメラ',
      battery: '4300mAh',
      storage: '128GB',
      connectivity: '5G対応',
      durability: '耐衝撃・防水・防塵'
    }),
    galleryImages: [
      'https://example.com/arrowsn_1.jpg',
      'https://example.com/arrowsn_2.jpg'
    ]
  }
];

export const mockContracts: Contract[] = [
  {
    id: '1',
    planId: '1',
    deviceId: '1',
    customerName: '田中太郎',
    customerEmail: 'tanaka@example.com',
    customerPhone: '090-1234-5678',
    status: 'active',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    planId: '2',
    deviceId: '3',
    customerName: '佐藤花子',
    customerEmail: 'sato@example.com',
    customerPhone: '090-2345-6789',
    status: 'active',
    createdAt: '2024-02-01T10:30:00Z',
    updatedAt: '2024-02-01T10:30:00Z'
  },
  {
    id: '3',
    planId: '3',
    deviceId: '7',
    customerName: '鈴木一郎',
    customerEmail: 'suzuki@example.com',
    customerPhone: '090-3456-7890',
    status: 'active',
    createdAt: '2024-03-10T14:15:00Z',
    updatedAt: '2024-03-10T14:15:00Z'
  }
];
