import { useState, useEffect, useCallback } from 'react';
import { ApiResponse, ApiError } from '@/utils/api';
import { toast } from './use-toast';
import { getErrorMessage, getErrorResolution, getErrorSeverity } from '@/utils/errorUtils';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiOptions {
  immediate?: boolean;
}

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = { immediate: true }
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiCall();
      setState({
        data: response.data,
        loading: false,
        error: null,
      });
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      setState({
        data: null,
        loading: false,
        error: apiError,
      });
      
      toast({
        title: getErrorMessage(apiError),
        description: getErrorResolution(apiError),
        severity: getErrorSeverity(apiError),
        resolution: apiError.resolution,
      });
      
      throw error;
    }
  }, [apiCall]);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  return {
    ...state,
    execute,
    refetch: execute,
  };
}

export function useMutation<T, P = any>(
  apiCall: (params: P) => Promise<ApiResponse<T>>
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (params: P) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await apiCall(params);
      setState({
        data: response.data,
        loading: false,
        error: null,
      });
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      setState({
        data: null,
        loading: false,
        error: apiError,
      });
      
      toast({
        title: getErrorMessage(apiError),
        description: getErrorResolution(apiError),
        severity: getErrorSeverity(apiError),
        resolution: apiError.resolution,
      });
      
      throw error;
    }
  }, [apiCall]);

  return {
    ...state,
    mutate,
  };
}
