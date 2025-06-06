import { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorSeverity } from '../utils/api';
import { getErrorIcon } from '../utils/errorUtils';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">{getErrorIcon(ErrorSeverity.CRITICAL)}</span>
              <h2 className="text-lg font-semibold text-gray-900">
                予期しないエラーが発生しました
              </h2>
            </div>
            <p className="text-gray-600 mb-4">
              アプリケーションでエラーが発生しました。ページをリロードして再度お試しください。
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                ページをリロード
              </button>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                再試行
              </button>
            </div>
            {true && this.state.error && (
              <details className="mt-4">
                <summary className="text-sm text-gray-500 cursor-pointer">
                  エラー詳細 (開発環境のみ)
                </summary>
                <pre className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
