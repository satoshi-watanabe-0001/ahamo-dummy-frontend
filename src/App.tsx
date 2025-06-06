import { useState } from 'react';
import { AdminDeviceApp } from './components/admin/AdminDeviceApp';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Ahamo Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAdmin(!showAdmin)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                {showAdmin ? 'コンポーネント表示' : 'デバイス管理'}
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {showAdmin ? (
        <AdminDeviceApp />
      ) : (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ahamo UI Component Library
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              React + TypeScript + Tailwind CSS コンポーネントライブラリのデモ
            </p>
            <button
              onClick={() => setShowAdmin(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors text-lg"
            >
              デバイス管理画面を開く
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
