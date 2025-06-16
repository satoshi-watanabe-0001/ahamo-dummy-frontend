import React, { useState } from 'react';
import { PaymentForm, PaymentFormData } from '../forms/PaymentForm';
import { PaymentResultPage, PaymentResult } from './PaymentResultPage';
import { paymentApi, classifyPaymentError } from '../../utils/api';

export const PaymentDemoPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'form' | 'result'>('form');
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [, setIsProcessing] = useState(false);
  const [_testMode, setTestMode] = useState(false);

  const handlePaymentSubmit = async (formData: PaymentFormData) => {
    setIsProcessing(true);
    setCurrentStep('result');
    
    setPaymentResult({
      status: 'processing',
      transactionId: `TXN_${Date.now()}`,
      amount: 2970,
      paymentMethod: formData.paymentMethod,
      timestamp: new Date()
    });

    try {
      const response = await paymentApi.processPayment({
        amount: 2970,
        paymentMethod: formData.paymentMethod,
        paymentToken: formData.paymentToken,
        billingAddress: formData.billingAddress
      });

      const responseData = response.data as any;
      setPaymentResult({
        status: 'success',
        transactionId: responseData.transactionId,
        amount: responseData.amount,
        paymentMethod: responseData.paymentMethod,
        timestamp: new Date(responseData.timestamp)
      });
    } catch (error: any) {
      const classifiedError = classifyPaymentError(error);
      
      setPaymentResult({
        status: 'failure',
        transactionId: `TXN_${Date.now()}`,
        amount: 2970,
        paymentMethod: formData.paymentMethod,
        timestamp: new Date(),
        errorCode: error.code || 'UNKNOWN_ERROR',
        errorMessage: classifiedError.message,
        errorType: error.type || 'system'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentRetry = async (retryData: any) => {
    setIsProcessing(true);
    
    setPaymentResult(prev => prev ? {
      ...prev,
      status: 'processing'
    } : null);

    try {
      const response = await paymentApi.retryPayment(
        paymentResult?.transactionId || '',
        {
          amount: 2970,
          paymentMethod: retryData.paymentMethod,
          cardNumber: retryData.cardNumber,
          expiryDate: retryData.expiryDate,
          cvv: retryData.cvv
        }
      );

      const responseData = response.data as any;
      setPaymentResult({
        status: 'success',
        transactionId: responseData.transactionId,
        amount: responseData.amount,
        paymentMethod: responseData.paymentMethod,
        timestamp: new Date(responseData.timestamp)
      });
    } catch (error: any) {
      const classifiedError = classifyPaymentError(error);
      
      setPaymentResult(prev => prev ? {
        ...prev,
        status: 'failure',
        errorCode: error.code || 'RETRY_FAILED',
        errorMessage: classifiedError.message,
        errorType: error.type || 'system'
      } : null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToHome = () => {
    setCurrentStep('form');
    setPaymentResult(null);
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
    setPaymentResult(null);
  };

  const handleTestPayment = () => {
    setTestMode(true);
    handlePaymentSubmit({
      paymentMethod: 'credit',
      paymentToken: 'test_token_123',
      billingAddress: {
        postalCode: '100-0001',
        prefecture: '東京都',
        city: '千代田区',
        addressLine1: '千代田1-1-1',
        addressLine2: ''
      },
      agreementTerms: true,
      agreementPrivacy: true
    });
  };

  if (currentStep === 'result' && paymentResult) {
    return (
      <PaymentResultPage
        result={paymentResult}
        onRetry={handlePaymentRetry}
        onBackToHome={handleBackToHome}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">決済結果デモテスト</h3>
        <p className="text-yellow-700 mb-3">
          決済結果表示機能をテストするために、以下のボタンをクリックしてください。
        </p>
        <button
          onClick={handleTestPayment}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          決済処理をテスト実行
        </button>
      </div>
      
      <PaymentForm
        onSubmit={handlePaymentSubmit}
        onBack={handleBackToForm}
      />
    </div>
  );
};
