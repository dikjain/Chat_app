import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

function Homepage() {
  const [minH, setMinH] = useState("50vh"); // Initially set to 40vh for Login


  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        background="black"
        color="green.400" // Brighter neon green text color
        boxShadow="0 0 15px 1px rgba(0, 255, 0, 0.7)" // Green box shadow
      >
        <Text id="smtxt" fontSize="4xl" fontFamily="Atomic Age" textColor="green.400">
          A <span className="oii">Basic</span> <span className="oii">Chat</span> App
        </Text>
      </Box>
      <Box 
      id="liooo"
        bg="black" // Black background for the container
        h={"fit-content"}
        overflow={"hidden"}
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
        boxShadow="0 0 20px 1px rgba(0, 255, 0, 0.7)" // Green box shadow
      >
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab color="green.400" _selected={{ boxShadow:"0 0 8px 2px rgba(0, 255, 0, 0.7)",border:"1px #00ff00 solid", color: "white", bg: "green.400" }}>
              Login
            </Tab>
            <Tab color="green.400" _selected={{ boxShadow:"0 0 8px 2px rgba(0, 255, 0, 0.7)",border:"1px #00ff00 solid", color: "white", bg: "green.400" }}>
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;
