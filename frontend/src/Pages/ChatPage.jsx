import { Box } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import Chatbox from "@/components/Chat/ChatBox";
import MyChats from "@/components/Chat/MyChats";
import SideDrawer from "@/components/UI/SideDrawer";
import { ChatState } from "@/Context/Chatprovider";
import axios from "axios";


const Chatpage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  
  
  
  const getdata = async () => {
    try {
      const email = user.email;
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/getuserdetails",
        { email },
        config
      );
      if (user.name !== data.name || user.pic !== data.pic) {
        user.name = data.name;
        user.pic = data.pic;
        localStorage.setItem("userInfo", JSON.stringify(user));
      }

    } catch (error) {
      console.error("Error details:", error);
    }
  }

  useEffect(() => {
    if (user && user.email) {
      getdata();
    }
  }, [user]);

  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;