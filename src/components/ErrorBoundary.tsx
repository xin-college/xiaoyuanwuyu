import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-brand-bg p-6 z-[9999]">
          <div className="bg-white rounded-[40px] shadow-2xl p-10 max-w-md w-full text-center border border-white/60">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-4">哎呀，出错了！</h2>
            <p className="text-sm font-bold text-slate-400 mb-8 leading-relaxed">
              游戏在运行过程中遇到了意料之外的问题。这可能是由于存档数据不兼容或网络波动导致的。
            </p>
            <div className="bg-slate-50 rounded-2xl p-4 mb-8 text-left overflow-auto max-h-32">
              <code className="text-[10px] font-mono text-red-400 break-all">
                {this.state.error?.toString()}
              </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-brand-pink text-white font-black rounded-2xl shadow-xl shadow-brand-pink/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <RefreshCw className="w-5 h-5" /> 刷新页面重试
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
