/* src/components/ErrorBoundary.tsx */
'use client';

import React from 'react';

type ErrorBoundaryProps = {
  children?: React.ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    console.error('Unhandled error caught by ErrorBoundary:', error);
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-6 bg-red-50 text-red-600">Something went wrong.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 