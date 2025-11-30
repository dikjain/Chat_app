import React from "react";
import { Button } from "@/components/UI/button";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const { fallback, onReset } = this.props;

      if (fallback) {
        return fallback({ error: this.state.error, reset: this.handleReset });
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
          <div className="max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-500">
              Something went wrong
            </h2>
            <p className="text-gray-400 mb-6">
              {this.props.message || "An unexpected error occurred"}
            </p>
            {this.props.showDetails && this.state.error && (
              <details className="mb-6 text-left bg-gray-900 p-4 rounded">
                <summary className="cursor-pointer text-gray-300 mb-2">
                  Error Details
                </summary>
                <pre className="text-xs text-red-400 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  this.handleReset();
                  if (onReset) onReset();
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Try Again
              </Button>
              <Button
                onClick={() => (window.location.replace("/"))}
                variant="outline"
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

