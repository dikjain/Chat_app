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
import { useState } from "react";
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
import ScrollableFeed from "react-scrollable-feed";


function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    setUser,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate(); // Replacing useHistory with useNavigate

  const logoutHandler = () => {
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
        color="green.400" // Neon green text
        w="100%"
        p="5px 10px"
        border={"#48bb78 solid 3px"}
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom">
          <Button variant="ghost" onClick={onOpen} colorScheme="green">
            <FaSearch fill="#48bb78" />
            <Text
              display={{ base: "none", md: "flex" }}
              px={4}
              color="green.400"
            >
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Atomic Age" textColor="green.400">
          A{" "}
          <span className="oii oil" fontSize={"1px !important"}>
            Basic
          </span>{" "}
          <span className="oii oil">Chat</span> App
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon
                fontSize="2xl"
                m={1}
                borderRadius={"99px"}
                backgroundColor={"#48bb78"}
              />
            </MenuButton>
            <MenuList pl={2} bg="black" color="green.400">
              {!notification.length && (
                <Text color="green.400">No New Messages</Text>
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
                  color="#48bb78" // Neon green text
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
                  backgroundColor={"#48bb78"}
                />
              }
              color="green.400"
            >
              <Avatar
                border={"2px solid #48bb78"}
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList bg="black" color="green.400" zIndex="overlay">
              <ProfileModal user={user} setUser={setUser}>
                <MenuItem bg="black" color="green.400">
                  My Profile
                </MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler} bg="black" color="green.400">
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="black" color="green.400">
          {" "}
          {/* Black background for the drawer */}
          <DrawerHeader borderBottomWidth="1px" color="green.400">
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
                color="green.400" // Neon green text
                borderColor="green.400" // Neon green border
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
              <Spinner ml="auto" display="flex" color="green.400" />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
