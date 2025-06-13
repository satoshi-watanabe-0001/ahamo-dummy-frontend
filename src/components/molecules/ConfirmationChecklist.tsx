import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

interface ConfirmationChecklistProps {
  checkedItems: string[];
  onItemChange: (itemId: string, checked: boolean) => void;
}

const CHECKLIST_ITEMS = [
  {
    id: 'contract-content',
    label: '契約内容を確認しました',
    description: '選択したプラン、デバイス、オプションの内容を確認しました。'
  },
  {
    id: 'important-terms',
    label: '重要事項説明を確認しました',
    description: '契約期間、解約条件、料金変更等の重要事項を理解しました。',
    linkText: '重要事項説明書を確認',
    linkUrl: 'https://ahamo.com/terms'
  },
  {
    id: 'terms-of-service',
    label: '利用規約に同意します',
    description: 'ahamo利用規約の内容を確認し、同意します。',
    linkText: '利用規約を確認',
    linkUrl: 'https://ahamo.com/legal/terms-of-service'
  },
  {
    id: 'privacy-policy',
    label: 'プライバシーポリシーに同意します',
    description: '個人情報の取り扱いについて確認し、同意します。',
    linkText: 'プライバシーポリシーを確認',
    linkUrl: 'https://ahamo.com/legal/privacy-policy'
  }
];

export const ConfirmationChecklist = ({ checkedItems, onItemChange }: ConfirmationChecklistProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">契約確認事項</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {CHECKLIST_ITEMS.map(item => (
            <label key={item.id} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={checkedItems.includes(item.id)}
                onChange={(e) => onItemChange(item.id, e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.label}</div>
                <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                {item.linkText && item.linkUrl && (
                  <a 
                    href={item.linkUrl} 
                    className="text-sm text-blue-600 hover:text-blue-800 underline mt-1 inline-block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.linkText}
                  </a>
                )}
              </div>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
