import { useState, useEffect } from 'react';
import { planApi } from '../utils/api';
import { Plan } from '../types';

interface PlansResponse {
  plans: Plan[];
  total: number;
}

interface UsePlansResult {
  plans: Plan[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}



export function usePlans(): UsePlansResult {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await planApi.getPlans();
      const data = response.data as PlansResponse;
      setPlans(data.plans);
      
    } catch (err) {
      setError('プラン情報の取得に失敗しました。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPlans();
  }, []);
  
  return { plans, loading, error, refetch: fetchPlans };
}
