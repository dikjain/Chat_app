import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import ToastContainer from "../UI/ToastContainer";
import Input from "./Input";
import Button from "./Button";
import { motion } from "framer-motion";

const Login = ({ onSwitchToSignup }) => {
  const { handleLogin, loading } = useAuth();
  const { toast, toasts, removeToast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async () => {
      await handleLogin(email, password, toast);
  };

  return (
    <>
      <motion.div 
        className="flex flex-col gap-4 w-full h-full"
        initial={{ x: -100, opacity: 0 , filter: "blur(10px)"}}
        animate={{ x: 0, opacity: 1 , filter: "blur(0px)"}}
        exit={{ x: -100, opacity: 0 , filter: "blur(10px)"}}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.4,
        }}
      >
        <Input
          id="email"
          label="Email Address"
          type="email"
          value={email}
          placeholder="jack.sparrow@gmail.com"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Input
          id="password"
          label="Password"
          value={password}
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          showPasswordToggle
          required
        />
        
        <div className="w-5/6 mx-auto h-px bg-neutral-300 my-1  "></div>
        
        <Button
          onClick={submitHandler}
          loading={loading}
          loadingText="Loading..."
          variant="primary"
        >
          Login
        </Button>
        
        {onSwitchToSignup && (
          <div className="text-center  text-sm text-gray-400">
            <button
              onClick={onSwitchToSignup}
              className="underline  hover:text-gray-300 transition-colors"
            >
              Don't have an account?
            </button>
          </div>
        )}
      </motion.div>
      <ToastContainer toasts={toasts} removeToast={removeToast} position="bottom" />
    </>
  );
};

export default Login;
