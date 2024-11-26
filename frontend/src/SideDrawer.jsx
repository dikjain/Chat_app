import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useNavigate } from "react-router-dom"; // Changed to useNavigate
import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "./Chatloading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModal";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "./configs/ChatLogics";
import UserListItem from "./UserListItem";
import { ChatState } from "./Context/Chatprovider";
import { FaSearch } from "react-icons/fa";
import StatusModal from "./StatusModal";
import io from "socket.io-client";
import LanguageModal from "./LanguageModal";


function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [showColorInputs, setShowColorInputs] = useState(false);
  
  const {
    setSelectedChat,
    user,
    setUser,
    notification,
    setNotification,
    chats,
    setChats,
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor
  } = ChatState();
  
  const ENDPOINT = "https://chat-app-3-2cid.onrender.com/";
  const Socket = useMemo(() => io(ENDPOINT), [ENDPOINT]);
  
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate(); // Replacing useHistory with useNavigate
  
  useEffect(() => {
    if (!isOpen) {
      setShowColorInputs(false);
    }
  }, [isOpen]);

  const logoutHandler = () => {
    Socket.emit("userDisconnected", user);
    localStorage.removeItem("userInfo");
    navigate("/"); // Replaced history.push with navigate
  };


  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="black" // Black background
        color={secondaryColor} // Neon green text
        w="100%"
        p="5px 10px"
        border={`${primaryColor} solid 3px`}
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom">
          <Button variant="ghost" onClick={onOpen} colorScheme="green">
            <FaSearch fill={primaryColor} />
            <Text
              display={{ base: "none", md: "flex" }}
              px={4}
              color={primaryColor}
            >
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text className="oip" fontSize="2xl" fontFamily="Atomic Age" textColor={primaryColor}>
          A{" "}
          <span className="oii oil" style={{borderBottom: `${primaryColor} solid 2px`,textDecoration: `line-through ${primaryColor}`}} fontSize={"1px !important"}>
            Basic
          </span>{" "}
          <span className="oii oil" style={{borderBottom: `${primaryColor} solid 2px`}}>Chat</span> App
        </Text>
        <div>
          <Menu zIndex={1000}>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon
                fontSize="2xl"
                m={1}
                borderRadius={"99px"}
                backgroundColor={primaryColor}
              />
            </MenuButton>
            <MenuList pl={2} bg="black" color={secondaryColor} zIndex={1000}>
              {!notification.length && (
                <Text color={secondaryColor}>No New Messages</Text>
              )}

              {/* Limit the notifications to the latest 10 */}
              {notification.slice(-10).map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                  bg="black" // Black background
                  color={primaryColor} // Neon green text
                  zIndex={1000}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              bg="black"
              rightIcon={
                <ChevronDownIcon
                  borderRadius={"999px"}
                  backgroundColor={primaryColor}
                />
              }
              color={secondaryColor}
            >
              <Avatar
                border={`2px solid ${primaryColor}`}
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList bg="black" color={secondaryColor} zIndex="overlay">
              <ProfileModal user={user} setUser={setUser}>
                <MenuItem bg="black" color={secondaryColor} zIndex={1000}>
                  My Profile
                </MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <StatusModal>
                <MenuItem bg="black" color={secondaryColor}>
                  My Status
                </MenuItem>
              </StatusModal>
              <MenuDivider />
              <LanguageModal>
                <MenuItem bg="black" color={secondaryColor}>
                  Language
                </MenuItem>
              </LanguageModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler} bg="black" color={secondaryColor} zIndex={1000}>
                Logout
              </MenuItem>
              <MenuDivider />
              <Box display="flex" justifyContent="space-around" alignItems="center" p={2}>
                {!showColorInputs ? (
                  <>
                    <Box
                      as="button"
                      borderRadius="50%"
                      bg="linear-gradient(45deg,black , #e69500,#d48500, black)"
                      w="25px"
                      h="25px"
                      border={"0.5px white solid"}
                      onClick={() => {setPrimaryColor('#e69500'); setSecondaryColor('#d48500')}}
                    />
                    <Box
                      as="button"
                      borderRadius="50%"
                      bg="linear-gradient(45deg,black , #6b0073,#950aff, black)"
                      w="25px"
                      h="25px"
                      border={"0.5px white solid"}
                      onClick={() => {setPrimaryColor('#a32bff'); setSecondaryColor('#950aff')}}
                    />
                    <Box
                      as="button"
                      borderRadius="50%"
                      bg="linear-gradient(45deg,black , #0099b0,#007a92, black)"
                      w="25px"
                      h="25px"
                      border={"0.5px white solid"}
                      onClick={() => {setPrimaryColor('#0099b0'); setSecondaryColor('#007a92')}}
                    />
                    <Box
                      as="button"
                      borderRadius="50%"
                      bg={`linear-gradient(45deg,black,${primaryColor},${secondaryColor},black)`}
                      w="25px"
                      h="25px"
                      border={"0.5px white solid"}
                      onClick={() => setShowColorInputs(true)}
                    />
                  </>
                ) : (
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <Box display="flex" justifyContent="space-between" gap={2} alignItems="center">
                    <Input
                      type="color"
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      title="Select Primary Color"
                      size="sm"
                      w="40px"
                      h="20px"
                    />
                    <Input
                      type="color"
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      title="Select Secondary Color"
                      size="sm"
                      w="40px"
                      h="20px"
                    />
                    </Box>
                    <Button mt={2} onClick={() => setShowColorInputs(false)}>
                      Go Back
                    </Button>
                  </Box>
                )}
              </Box>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="black" color={secondaryColor}>
          {" "}
          {/* Black background for the drawer */}
          <DrawerHeader borderBottomWidth="1px" color={primaryColor}>
            Search Users
          </DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg="black" // Black background
                color={secondaryColor} // Neon green text
                borderColor={primaryColor} // Neon green border
                _placeholder={{ color: "gray.500" }} // Placeholder color
              />
              <Button onClick={handleSearch} colorScheme="green">
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                  />
              ))
            )}
            {loadingChat && (
              <Spinner ml="auto" display="flex" color={secondaryColor} />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;


