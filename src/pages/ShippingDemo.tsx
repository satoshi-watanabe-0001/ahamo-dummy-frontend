
import { ShippingFormDemo } from '../components/forms/ShippingFormDemo';

export const ShippingDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">配送設定デモ</h1>
        <ShippingFormDemo />
      </div>
    </div>
  );
};

export default ShippingDemo;
