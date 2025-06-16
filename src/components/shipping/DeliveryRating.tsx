import React, { useState } from 'react';

interface DeliveryRatingProps {
  trackingNumber: string;
}

export const DeliveryRating: React.FC<DeliveryRatingProps> = ({ trackingNumber }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setMessage('評価を選択してください');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/v1/shipping/confirm-delivery/${trackingNumber}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          feedback
        })
      });

      const result = await response.json();
      setMessage(result.message);
      
      if (result.success) {
        setIsSubmitted(true);
      }
    } catch (error) {
      setMessage('配達確認に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="delivery-rating">
        <h3 className="text-lg font-semibold mb-4">配達確認</h3>
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded">
          <div className="flex items-center">
            <span className="text-2xl mr-2">✅</span>
            <div>
              <strong>配達確認が完了しました</strong>
              <p className="text-sm mt-1">ご評価いただき、ありがとうございました。</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="delivery-rating">
      <h3 className="text-lg font-semibold mb-4">配達確認・評価</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            配達サービスの評価
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                className={`text-3xl transition-colors ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                } hover:text-yellow-400`}
              >
                ★
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {rating > 0 && (
              <>
                {rating === 1 && '非常に不満'}
                {rating === 2 && '不満'}
                {rating === 3 && '普通'}
                {rating === 4 && '満足'}
                {rating === 5 && '非常に満足'}
              </>
            )}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            フィードバック（任意）
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="配達サービスについてのご意見をお聞かせください"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '送信中...' : '配達確認・評価を送信'}
        </button>

        {message && (
          <div className={`p-3 rounded-md ${
            message.includes('失敗') || message.includes('エラー') 
              ? 'bg-red-100 text-red-700 border border-red-300' 
              : 'bg-green-100 text-green-700 border border-green-300'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};
