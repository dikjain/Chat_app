import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChatState } from "@/Context/Chatprovider";
import useCloudinaryUpload from "@/hooks/useCloudinaryUpload";
import { signup } from "@/api/auth";
import useToast from "@/hooks/useToast";
import ToastContainer from "@/components/UI/ToastContainer";
import Input from "./Input";
import Button from "./Button";

const Signup = ({ onSwitchToLogin }) => {
  const { setUser } = ChatState();
  const navigate = useNavigate();
  const { toast, toasts, removeToast } = useToast();
  const { uploadImage, isUploading } = useCloudinaryUpload(toast);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return false;
    }
    if (password.length < 8) {
      toast({
        title: "Password must be at least 8 characters long",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return false;
    }
    const validDomains = ["@gmail.com", "@yahoo.com", "@outlook.com"];
    if (!validDomains.some(domain => email.endsWith(domain))) {
      toast({
        title: "Invalid Email",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return false;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return false;
    }
    return true;
  };

  const submitHandler = async () => {
    if (!validateForm()) return;

    try {
      const data = await signup(name, email, password, pic);
      toast({
        title: "Registration Successful",
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
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await uploadImage(file);
      if (url) setPic(url);
    }
  };

  return (
    <>
      <motion.div 
        className="flex flex-col gap-4 w-full"
        initial={{ x: 80, opacity: 0 , filter: "blur(10px)"}}
        animate={{ x: 0, opacity: 1 , filter: "blur(0px)"}}
        exit={{ x: 80, opacity: 0 , filter: "blur(10px)"}}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 30,
          duration: 0.4
        }}
      >
        <Input
          id="name"
          label="Name"
          type="text"
          value={name}
          placeholder="jack sparrow"
          onChange={(e) => setName(e.target.value)}
          required
        />

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
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
          showPasswordToggle
          required
        />

        <Input
          id="confirm-password"
          label="Confirm Password"
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          showPasswordToggle
          required
        />

        <div className="w-full">
          <label htmlFor="pic" className="block text-gray-400 mb-1 text-sm font-medium">
            Upload your Picture
          </label>
          <input
            id="pic"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="shadow-[inset_0px_1px_1] w-full px-3 py-2 text-neutral-500 bg-neutral-100 rounded-lg outline-none focus:outline-none focus-visible:outline-none active:outline-none focus:ring-0 focus-visible:ring-0 border border-neutral-200/70 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-neutral-200 file:text-neutral-600 hover:file:bg-neutral-300 file:cursor-pointer file:transition-colors"
          />
        </div>

        <div className="w-5/6 mx-auto h-px bg-neutral-300 my-1  "></div>

        <div className="flex gap-2">
          <Button
            onClick={submitHandler}
            loading={isUploading}
            loadingText="Uploading..."
            variant="primary"
            className="flex-1"
          >
            Sign Up
          </Button>
          <Button
            onClick={() => {
              // Generate random name
              const firstNames = ["John", "Jane", "Alex", "Sarah", "Mike", "Emma", "David", "Lisa", "Chris", "Anna"];
              const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson", "Moore"];
              const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
              const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
              const randomName = `${randomFirstName} ${randomLastName}`;
              
              // Generate random email (keeping valid domain format)
              const domains = ["gmail.com", "yahoo.com", "outlook.com"];
              const randomDomain = domains[Math.floor(Math.random() * domains.length)];
              const randomEmail = `${randomFirstName.toLowerCase()}${Math.floor(Math.random() * 1000)}@${randomDomain}`;
              
              // Generate random password (8+ characters)
              const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
              let randomPassword = "";
              for (let i = 0; i < 10; i++) {
                randomPassword += chars.charAt(Math.floor(Math.random() * chars.length));
              }
              
              setName(randomName);
              setEmail(randomEmail);
              setPassword(randomPassword);
              setConfirmPassword(randomPassword);
            }}
            variant="white"
            className="flex-1 max-w-32 text-neutral-500"
          >
            Random
          </Button>
        </div>
        
        {onSwitchToLogin && (
          <div className="text-center  text-sm text-gray-400">
            <button
              onClick={onSwitchToLogin}
              className="underline font-saira  hover:text-gray-300 transition-colors"
            >
              Already have an account?
            </button>
          </div>
        )}
      </motion.div>
      <ToastContainer toasts={toasts} removeToast={removeToast} position="bottom" />
    </>
  );
};

export default Signup;
