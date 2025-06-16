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
    ],
    releaseDate: '2023-09-22',
    popularity: 5
  },
  {
    id: '2',
    name: 'iPhone 15',
    brand: 'Apple',
    category: 'iPhone',
    priceRange: 'premium',
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
    ],
    releaseDate: '2023-09-22',
    popularity: 4
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
    ],
    releaseDate: '2024-01-17',
    popularity: 5
  },
  {
    id: '4',
    name: 'Galaxy S24',
    brand: 'Samsung',
    category: 'Android',
    priceRange: 'premium',
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
    ],
    releaseDate: '2024-01-17',
    popularity: 4
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
    ],
    releaseDate: '2024-06-07',
    popularity: 3
  },
  {
    id: '6',
    name: 'AQUOS sense8',
    brand: 'Sharp',
    category: 'Android',
    priceRange: 'mid',
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
    ],
    releaseDate: '2023-11-09',
    popularity: 3
  },
  {
    id: '7',
    name: 'iPhone SE (第3世代)',
    brand: 'Apple',
    category: 'iPhone',
    priceRange: 'mid',
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
    ],
    releaseDate: '2022-03-18',
    popularity: 3
  },
  {
    id: '8',
    name: 'Pixel 8 Pro',
    brand: 'Google',
    category: 'Android',
    priceRange: 'premium',
    price: 159000,
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
    ],
    releaseDate: '2023-10-12',
    popularity: 4
  },
  {
    id: '9',
    name: 'Pixel 8',
    brand: 'Google',
    category: 'Android',
    priceRange: 'premium',
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
    ],
    releaseDate: '2023-10-12',
    popularity: 3
  },
  {
    id: '10',
    name: 'arrows N',
    brand: 'FCNT',
    category: 'Android',
    priceRange: 'mid',
    price: 98780,
    colors: ['フォグホワイト', 'フォレストブラック'],
    storageOptions: ['128GB'],
    inStock: false,
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
    ],
    releaseDate: '2023-02-09',
    popularity: 2
  },
  {
    id: '11',
    name: 'Xiaomi 14',
    brand: 'Xiaomi',
    category: 'Android',
    priceRange: 'premium',
    price: 119800,
    colors: ['ブラック', 'ホワイト', 'グリーン'],
    storageOptions: ['256GB', '512GB'],
    inStock: true,
    imageUrl: 'https://example.com/xiaomi14.jpg',
    specifications: JSON.stringify({
      display: '6.36インチ AMOLED',
      chip: 'Snapdragon 8 Gen 3',
      camera: 'Leica 50MPトリプルカメラ',
      battery: '4610mAh',
      storage: '256GB〜512GB',
      connectivity: '5G対応'
    }),
    galleryImages: [
      'https://example.com/xiaomi14_1.jpg'
    ],
    releaseDate: '2024-02-25',
    popularity: 4
  },
  {
    id: '12',
    name: 'OnePlus 12',
    brand: 'OnePlus',
    category: 'Android',
    priceRange: 'premium',
    price: 134800,
    colors: ['シルキーブラック', 'フローラルグリーン'],
    storageOptions: ['256GB', '512GB'],
    inStock: true,
    imageUrl: 'https://example.com/oneplus12.jpg',
    specifications: JSON.stringify({
      display: '6.82インチ LTPO AMOLED',
      chip: 'Snapdragon 8 Gen 3',
      camera: 'Hasselblad 50MPトリプルカメラ',
      battery: '5400mAh',
      storage: '256GB〜512GB',
      connectivity: '5G対応'
    }),
    galleryImages: [
      'https://example.com/oneplus12_1.jpg'
    ],
    releaseDate: '2024-01-23',
    popularity: 3
  },
  {
    id: '13',
    name: 'OPPO Reno11 A',
    brand: 'OPPO',
    category: 'Android',
    priceRange: 'mid',
    price: 48800,
    colors: ['ムーンホワイト', 'コーラルパープル'],
    storageOptions: ['128GB'],
    inStock: true,
    imageUrl: 'https://example.com/opporeno11a.jpg',
    specifications: JSON.stringify({
      display: '6.7インチ AMOLED',
      chip: 'MediaTek Dimensity 7050',
      camera: '64MP AIトリプルカメラ',
      battery: '5000mAh',
      storage: '128GB',
      connectivity: '5G対応'
    }),
    galleryImages: [
      'https://example.com/opporeno11a_1.jpg'
    ],
    releaseDate: '2024-06-27',
    popularity: 3
  },
  {
    id: '14',
    name: 'Nothing Phone (2a)',
    brand: 'Nothing',
    category: 'Android',
    priceRange: 'mid',
    price: 54800,
    colors: ['ブラック', 'ホワイト'],
    storageOptions: ['128GB', '256GB'],
    inStock: true,
    imageUrl: 'https://example.com/nothingphone2a.jpg',
    specifications: JSON.stringify({
      display: '6.7インチ AMOLED',
      chip: 'MediaTek Dimensity 7200 Pro',
      camera: '50MPデュアルカメラ',
      battery: '5000mAh',
      storage: '128GB〜256GB',
      connectivity: '5G対応'
    }),
    galleryImages: [
      'https://example.com/nothingphone2a_1.jpg'
    ],
    releaseDate: '2024-03-05',
    popularity: 2
  },
  {
    id: '15',
    name: 'Redmi Note 13 Pro 5G',
    brand: 'Xiaomi',
    category: 'Android',
    priceRange: 'entry',
    price: 39800,
    colors: ['ミッドナイトブラック', 'オーロラパープル', 'フォレストグリーン'],
    storageOptions: ['128GB', '256GB'],
    inStock: true,
    imageUrl: 'https://example.com/redminote13pro.jpg',
    specifications: JSON.stringify({
      display: '6.67インチ AMOLED',
      chip: 'Snapdragon 7s Gen 2',
      camera: '200MPトリプルカメラ',
      battery: '5100mAh',
      storage: '128GB〜256GB',
      connectivity: '5G対応'
    }),
    galleryImages: [
      'https://example.com/redminote13pro_1.jpg'
    ],
    releaseDate: '2024-05-16',
    popularity: 4
  },
  {
    id: '16',
    name: 'moto g64 5G',
    brand: 'Motorola',
    category: 'Android',
    priceRange: 'entry',
    price: 32800,
    colors: ['アイスリリー', 'ミントグリーン', 'パープル'],
    storageOptions: ['128GB'],
    inStock: true,
    imageUrl: 'https://example.com/motog64.jpg',
    specifications: JSON.stringify({
      display: '6.5インチ IPS LCD',
      chip: 'MediaTek Dimensity 7025',
      camera: '50MPデュアルカメラ',
      battery: '6000mAh',
      storage: '128GB',
      connectivity: '5G対応'
    }),
    galleryImages: [
      'https://example.com/motog64_1.jpg'
    ],
    releaseDate: '2024-04-04',
    popularity: 3
  },
  {
    id: '17',
    name: 'AQUOS R8 pro',
    brand: 'Sharp',
    category: 'Android',
    priceRange: 'premium',
    price: 191900,
    colors: ['ブラック', 'ホワイト'],
    storageOptions: ['256GB'],
    inStock: false,
    imageUrl: 'https://example.com/aquosr8pro.jpg',
    specifications: JSON.stringify({
      display: '6.6インチ Pro IGZO OLED',
      chip: 'Snapdragon 8 Gen 2',
      camera: 'Leica監修 47.2MPカメラ',
      battery: '5000mAh',
      storage: '256GB',
      connectivity: '5G対応'
    }),
    galleryImages: [
      'https://example.com/aquosr8pro_1.jpg'
    ],
    releaseDate: '2023-07-20',
    popularity: 2
  },
  {
    id: '18',
    name: 'Galaxy A55 5G',
    brand: 'Samsung',
    category: 'Android',
    priceRange: 'mid',
    price: 69300,
    colors: ['オーサムアイスブルー', 'オーサムライラック', 'オーサムネイビー'],
    storageOptions: ['128GB'],
    inStock: true,
    imageUrl: 'https://example.com/galaxya55.jpg',
    specifications: JSON.stringify({
      display: '6.6インチ Super AMOLED',
      chip: 'Exynos 1480',
      camera: '50MPトリプルカメラ',
      battery: '5000mAh',
      storage: '128GB',
      connectivity: '5G対応'
    }),
    galleryImages: [
      'https://example.com/galaxya55_1.jpg'
    ],
    releaseDate: '2024-05-30',
    popularity: 3
  },
  {
    id: '19',
    name: 'Xperia 10 VI',
    brand: 'Sony',
    category: 'Android',
    priceRange: 'mid',
    price: 67100,
    colors: ['ブラック', 'ホワイト', 'ブルー', 'イエロー'],
    storageOptions: ['128GB'],
    inStock: true,
    imageUrl: 'https://example.com/xperia10vi.jpg',
    specifications: JSON.stringify({
      display: '6.1インチ OLED',
      chip: 'Snapdragon 6 Gen 1',
      camera: '48MPトリプルカメラ',
      battery: '5000mAh',
      storage: '128GB',
      connectivity: '5G対応'
    }),
    galleryImages: [
      'https://example.com/xperia10vi_1.jpg'
    ],
    releaseDate: '2024-07-05',
    popularity: 2
  },
  {
    id: '20',
    name: 'iPhone 14',
    brand: 'Apple',
    category: 'iPhone',
    priceRange: 'premium',
    price: 112800,
    colors: ['ブルー', 'パープル', 'ミッドナイト', 'スターライト', '(PRODUCT)RED'],
    storageOptions: ['128GB', '256GB', '512GB'],
    inStock: true,
    imageUrl: 'https://example.com/iphone14.jpg',
    specifications: JSON.stringify({
      display: '6.1インチ Super Retina XDR',
      chip: 'A15 Bionic',
      camera: 'デュアル12MPカメラシステム',
      battery: 'ビデオ再生最大20時間',
      storage: '128GB〜512GB',
      connectivity: '5G対応'
    }),
    galleryImages: [
      'https://example.com/iphone14_1.jpg'
    ],
    releaseDate: '2022-09-16',
    popularity: 4
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
    updatedAt: '2024-01-15T09:00:00Z',
    customerInfo: {
      name: '田中太郎',
      email: 'tanaka@example.com',
      phoneNumber: '090-1234-5678',
      address: '東京都渋谷区1-1-1'
    }
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
    updatedAt: '2024-02-01T10:30:00Z',
    customerInfo: {
      name: '佐藤花子',
      email: 'sato@example.com',
      phoneNumber: '090-2345-6789',
      address: '大阪府大阪市2-2-2'
    }
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
    updatedAt: '2024-03-10T14:15:00Z',
    customerInfo: {
      name: '鈴木一郎',
      email: 'suzuki@example.com',
      phoneNumber: '090-3456-7890',
      address: '愛知県名古屋市3-3-3'
    }
  }
];
