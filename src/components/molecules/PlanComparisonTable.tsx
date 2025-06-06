
import { Plan } from '../../types';

interface PlanComparisonTableProps {
  plans: Plan[];
}

export function PlanComparisonTable({ plans }: PlanComparisonTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left p-4 border-b font-semibold text-gray-700">比較項目</th>
            {plans.map(plan => (
              <th key={plan.id} className="text-left p-4 border-b">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700">{plan.name}</span>
                  {plan.isPopular && (
                    <span className="mt-1 inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      おすすめ
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-4 border-b font-medium text-gray-700">月額料金</td>
            {plans.map(plan => (
              <td key={plan.id} className="p-4 border-b font-bold text-blue-600">
                ¥{plan.monthlyFee.toLocaleString()}
              </td>
            ))}
          </tr>
          <tr className="bg-gray-50">
            <td className="p-4 border-b font-medium text-gray-700">データ容量</td>
            {plans.map(plan => (
              <td key={plan.id} className="p-4 border-b">{plan.dataCapacity}</td>
            ))}
          </tr>
          <tr>
            <td className="p-4 border-b font-medium text-gray-700">通話</td>
            {plans.map(plan => (
              <td key={plan.id} className="p-4 border-b">{plan.voiceCalls}</td>
            ))}
          </tr>
          <tr className="bg-gray-50">
            <td className="p-4 border-b font-medium text-gray-700">SMS</td>
            {plans.map(plan => (
              <td key={plan.id} className="p-4 border-b">{plan.sms}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
