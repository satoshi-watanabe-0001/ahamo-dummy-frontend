import { useDeviceComparison } from '../../hooks/useDeviceComparison';
import { Button } from '../ui/button';
import { DeviceComparison } from '../organisms/DeviceComparison';

interface DeviceComparisonPageProps {
  onBack: () => void;
}

export function DeviceComparisonPage({ onBack }: DeviceComparisonPageProps) {
  const { comparisonDevices, removeDevice, clearComparison } = useDeviceComparison();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack}>
          ← 戻る
        </Button>
        <h1 className="text-3xl font-bold">デバイス比較</h1>
        <div></div>
      </div>

      <DeviceComparison
        devices={comparisonDevices}
        onRemoveDevice={removeDevice}
        onClearComparison={clearComparison}
      />
    </div>
  );
}
