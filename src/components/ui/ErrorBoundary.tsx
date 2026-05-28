"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-center">
          <h2 className="text-rose-900 font-bold mb-2">Something went wrong</h2>
          <p className="text-sm text-rose-700">
            This visualizer could not be loaded. It may require WebGL support which is not available in your browser.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
