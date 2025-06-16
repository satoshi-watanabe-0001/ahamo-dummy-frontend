import React from 'react';
import { Badge } from '../ui/badge';

interface PaymentErrorDetailsProps {
  errorCode?: string;
  errorMessage?: string;
  errorType?: 'system' | 'user' | 'card_issuer';
}

export const PaymentErrorDetails: React.FC<PaymentErrorDetailsProps> = ({
  errorCode,
  errorMessage,
  errorType
}) => {
  const getErrorTypeDisplay = (type?: string) => {
    switch (type) {
      case 'system':
        return { label: 'システムエラー', variant: 'destructive' as const };
      case 'user':
        return { label: 'ユーザーエラー', variant: 'secondary' as const };
      case 'card_issuer':
        return { label: 'カード会社エラー', variant: 'outline' as const };
      default:
        return { label: '不明なエラー', variant: 'secondary' as const };
    }
  };

  const getErrorSolution = (type?: string, _code?: string) => {
    switch (type) {
      case 'system':
        return {
          title: 'システムの一時的な問題が発生しています',
          solutions: [
            'しばらく時間をおいてから再度お試しください',
            '問題が継続する場合は、カスタマーサポートまでお問い合わせください'
          ],
          supportNeeded: true
        };
      case 'user':
        return {
          title: '入力内容に問題があります',
          solutions: [
            'カード番号、有効期限、セキュリティコードを再度ご確認ください',
            '別のお支払い方法をお試しください',
            'カードの利用限度額をご確認ください'
          ],
          supportNeeded: false
        };
      case 'card_issuer':
        return {
          title: 'カード会社での承認が得られませんでした',
          solutions: [
            'カード会社にお問い合わせください',
            '別のカードまたはお支払い方法をお試しください',
            'カードの利用状況をご確認ください'
          ],
          supportNeeded: false
        };
      default:
        return {
          title: '決済処理中にエラーが発生しました',
          solutions: [
            'しばらく時間をおいてから再度お試しください',
            '別のお支払い方法をお試しください'
          ],
          supportNeeded: true
        };
    }
  };

  const errorTypeInfo = getErrorTypeDisplay(errorType);
  const errorSolution = getErrorSolution(errorType, errorCode);

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-red-800">エラー詳細</h3>
        <Badge variant={errorTypeInfo.variant}>{errorTypeInfo.label}</Badge>
      </div>

      {errorCode && (
        <div className="mb-4">
          <span className="text-sm text-red-600">エラーコード</span>
          <p className="font-mono text-sm text-red-800">{errorCode}</p>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4">
          <span className="text-sm text-red-600">エラーメッセージ</span>
          <p className="text-red-800">{errorMessage}</p>
        </div>
      )}

      <div className="mt-6">
        <h4 className="font-medium text-red-800 mb-3">{errorSolution.title}</h4>
        <ul className="space-y-2">
          {errorSolution.solutions.map((solution, index) => (
            <li key={index} className="flex items-start text-sm text-red-700">
              <span className="inline-block w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              {solution}
            </li>
          ))}
        </ul>
      </div>

      {errorSolution.supportNeeded && (
        <div className="mt-6 p-4 bg-white rounded border border-red-200">
          <h5 className="font-medium text-red-800 mb-2">サポートが必要な場合</h5>
          <div className="space-y-2 text-sm">
            <p className="text-red-700">
              <strong>電話:</strong> 0120-123-456 (受付時間: 9:00-18:00)
            </p>
            <p className="text-red-700">
              <strong>チャット:</strong> 
              <button className="ml-2 text-blue-600 hover:text-blue-800 underline">
                チャットサポートを開始
              </button>
            </p>
            <p className="text-red-700">
              <strong>メール:</strong> support@ahamo.com
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
