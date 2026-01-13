import React from 'react';

interface State { hasError: boolean; error?: any; }
export class ErrorBoundary extends React.Component<{children: React.ReactNode}, State> {
  constructor(props: any) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  componentDidCatch(error: any, info: any) { console.error('ErrorBoundary caught', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: 20}}>
          <h2>Something went wrong</h2>
          <pre style={{whiteSpace: 'pre-wrap'}}>{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
