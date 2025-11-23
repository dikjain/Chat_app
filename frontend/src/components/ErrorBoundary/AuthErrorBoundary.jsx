import ErrorBoundary from "./ErrorBoundary";
import { useAuthStore } from "@/stores";

const AuthErrorBoundary = ({ children }) => {
  return (
    <ErrorBoundary
      message="Something went wrong with authentication. Please try again."
      showDetails={false}
      onReset={() => {
        useAuthStore.getState().clearUser();
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default AuthErrorBoundary;
