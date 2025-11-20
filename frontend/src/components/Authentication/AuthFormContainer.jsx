import { AnimatePresence } from "framer-motion";
import Login from "./Login";
import Signup from "./Signup";

const AuthFormContainer = ({ activeTab, onSwitchToSignup, onSwitchToLogin }) => {
  return (
    <div className="mt-auto w-full relative overflow-hidden">
      <AnimatePresence mode="wait">
        {activeTab === "login" && (
          <Login key="login" onSwitchToSignup={onSwitchToSignup} />
        )}
        {activeTab === "signup" && (
          <Signup key="signup" onSwitchToLogin={onSwitchToLogin} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthFormContainer;

