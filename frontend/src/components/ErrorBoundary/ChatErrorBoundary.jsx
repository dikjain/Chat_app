import ErrorBoundary from "./ErrorBoundary";

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

