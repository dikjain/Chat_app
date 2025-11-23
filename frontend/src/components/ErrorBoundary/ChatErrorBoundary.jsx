import ErrorBoundary from "./ErrorBoundary";

/**
 * Chat-specific error boundary
 * Catches errors in chat-related components
 */
const ChatErrorBoundary = ({ children }) => {
  return (
    <ErrorBoundary
      message="Something went wrong with the chat. Please try refreshing."
      showDetails={false}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ChatErrorBoundary;

