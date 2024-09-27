import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
  const { setUser, user } = ChatState();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


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
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data)
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      console.error("Error details:", error); // Log full error
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || error.message || "Unknown error",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="10px" align="stretch">
      <FormControl id="email" isRequired>
        <FormLabel color="green.400">Email Address</FormLabel>
        <Input
          value={email}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
          bg="black" // Black background for input
          color="green.400" // Neon green text color
          borderColor="green.400" // Neon green border
          _placeholder={{ color: "gray.500" }} // Placeholder color
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel color="green.400">Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
            bg="black" // Black background for input
            color="green.400" // Neon green text color
            borderColor="green.400" // Neon green border
            _placeholder={{ color: "gray.500" }} // Placeholder color
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick} colorScheme="green">
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="green" // Neon green button
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
