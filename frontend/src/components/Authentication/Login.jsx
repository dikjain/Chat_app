import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "@/context/Chatprovider";
import { login } from "@/api/auth";
import useToast from "@/hooks/useToast";
import ToastContainer from "@/components/UI/ToastContainer";
import Input from "./Input";
import Button from "./Button";
import { motion } from "framer-motion";

const Login = ({ onSwitchToSignup }) => {
  const { setUser } = ChatState();
  const navigate = useNavigate();
  const { toast, toasts, removeToast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    setLoading(true);
    
    if (!email || !password) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const data = await login(email, password);
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || error.message || "Unknown error",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
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
          duration: 0.4
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
