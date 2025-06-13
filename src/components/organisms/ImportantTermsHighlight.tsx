import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';

const IMPORTANT_TERMS = [
  {
    id: 'contract-period',
    title: '契約期間',
    content: '契約期間の定めはありません。いつでも解約可能です。',
    isImportant: true
  },
  {
    id: 'cancellation',
    title: '解約条件',
    content: '解約月の料金は日割り計算となります。解約手数料はかかりません。',
    isImportant: true
  },
  {
    id: 'fee-changes',
    title: '料金変更',
    content: '料金プランの変更は翌月から適用されます。月の途中での変更はできません。',
    isImportant: true
  },
  {
    id: 'data-rollover',
    title: 'データ繰り越し',
    content: '余ったデータ容量の翌月繰り越しはできません。',
    isImportant: false
  }
];

export const ImportantTermsHighlight = () => {
  const [expandedTerms, setExpandedTerms] = useState<string[]>([]);

  const toggleTerm = (termId: string) => {
    setExpandedTerms(prev => 
      prev.includes(termId) 
        ? prev.filter(id => id !== termId)
        : [...prev, termId]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <span className="text-red-600 mr-2">⚠️</span>
          重要な契約条件
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {IMPORTANT_TERMS.map(term => (
            <div key={term.id} className={`border rounded-lg p-4 ${term.isImportant ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
              <div className="flex justify-between items-center">
                <h4 className={`font-medium ${term.isImportant ? 'text-red-800' : 'text-gray-800'}`}>
                  {term.isImportant && <span className="text-red-600 mr-1">●</span>}
                  {term.title}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleTerm(term.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {expandedTerms.includes(term.id) ? '閉じる' : '詳細'}
                </Button>
              </div>
              {expandedTerms.includes(term.id) && (
                <div className="mt-2 text-sm text-gray-700">
                  {term.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
