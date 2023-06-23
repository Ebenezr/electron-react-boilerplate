import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  goBack = () => {
    // Logic to go back, you can use react-router or regular window.history API
    window.history.back();
  };

  retry = () => {
    // Logic to retry, for example, you can reload the page
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-700">
          <h1 className="text-2xl font-semibold text-purple-100">
            Something went wrong.
          </h1>
          <p className="text-slate-50 my-4">
            Please try again later or contact support if the problem persists.
          </p>
          <div className="grid grid-cols-2 w-1/3 gap-3 items-center mt-4">
            <button
              className="bg-purple-200 text-purple-600 rounded-sm font-semibold py-2 px-4 hover:bg-purple-300 hover:text-purple-900"
              onClick={this.retry}
            >
              Retry
            </button>
            <button
              className="border-slate-300 border-[1px] text-slate-50 rounded-sm font-semibold py-2 px-4 hover:bg-slate-300 hover:text-slate-900"
              onClick={this.goBack}
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
