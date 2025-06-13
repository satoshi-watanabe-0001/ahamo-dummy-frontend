import { } from 'react';
import { MyPage } from './components/pages/MyPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">ahamo</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium">マイページ</span>
            </div>
          </div>
        </div>
      </nav>

      <MyPage contractId="contract-1" />
    </div>
  );
}

export default App;
