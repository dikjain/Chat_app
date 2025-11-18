import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
  Toast,
  useToast,
  Input,
  Spinner,
} from "@chakra-ui/react";

import axios from "axios";
import { ChatState } from "./Context/Chatprovider";
import { useState } from "react";
import ViewStatusModal from "./ViewStatusModal";
import { config as appConfig } from "./constants/config";

const ProfileModal = ({ children, profileUser }) => {
  const [picupdate, setPicupdate] = useState(false);
  const [isNaam, setisNaam] = useState(false);
  const [naam, setNaam] = useState("");
  const [isViewStatusModal, setIsViewStatusModal] = useState(false); // State to track modal type

  const { user, setUser, primaryColor, secondaryColor } = ChatState();
  if (!profileUser) profileUser = user;

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleUpdate = () => {
    setNaam(user.name);
    setisNaam((prev) => !prev);
  };

  const requestConfig = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
  };

  const handleNameChange = async () => {
    setisNaam(false);
    setNaam(user.name);
    try {
      const { data } = await axios.post(
        "/api/user/update",
        {
          UserId: user._id,
          pic: user.pic,
          name: naam,
        },
        requestConfig
      );
      if (data) {
        setUser({
          ...user,
          name: naam,
        });
        localStorage.setItem("userInfo", JSON.stringify({
          ...user,
          name: naam,
        }));
        toast({
          title: "Name Updated!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const changePic = () => {
    let imgUrl;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setPicupdate(true);
        const filereader = new FileReader();
        filereader.readAsDataURL(file);
        if (file.type === "image/jpeg" || file.type === "image/png") {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", appConfig.CLOUDINARY_UPLOAD_PRESET);
          data.append("cloud_name", appConfig.CLOUDINARY_CLOUD_NAME);
          fetch(`https://api.cloudinary.com/v1_1/${appConfig.CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: "post",
            body: data,
          })
            .then((res) => res.json())
            .then((dats) => {
              imgUrl = dats.url;
            })
            .then(async () => {
              try {
                await axios.post(
                  "/api/user/update",
                  {
                    UserId: user._id,
                    pic: imgUrl,
                    name: user.name,
                  },
                  requestConfig
                );
                setUser({
                  ...user,
                  pic: imgUrl,
                });
                localStorage.setItem("userInfo", JSON.stringify({
                  ...user,
                  pic: imgUrl,
                }));
                setPicupdate(false);
                toast({
                  title: "Profile Picture Updated!",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                  position: "bottom",
                });
              } catch (err) {
                console.log(err);
              }
            });
        } else {
          toast({
            title: "Please Select an Image!",
            status: "warning",
          });
          setPicupdate(false);
        }
      } else {
        toast({
          title: "Please Select an Image!",
          status: "warning",
        });
        setPicupdate(false);
      }
    };
    input.click();
  };

  const [status, setStatus] = useState([]);

  const fetchStatus = async ({ id }) => {
    try {
      const { data } = await axios.post("/api/status/fetch", {
        id: id,
      });
      setStatus(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleViewStatus = () => {
    fetchStatus({ id: profileUser._id });
    setIsViewStatusModal(true); // Set to view status modal
  };

  const handleCloseModal = () => {
    setIsViewStatusModal(false); // Reset state when closing modal
    setStatus([])
    onClose();
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
 { !isViewStatusModal && <Modal size="lg" onClose={handleCloseModal} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px" bg={"#18191a"}>
          <ModalHeader
            position={"relative"}
            fontSize="40px"
            fontFamily="Roboto"
            display="flex"
            justifyContent="center"
            color={primaryColor}
          >
            {!isNaam && profileUser && profileUser.name.toUpperCase()}
            {isNaam && (
              <Input
                type="text"
                placeholder="name"
                bg={"black"}
                color={primaryColor}
                fontSize={"20px"}
                fontWeight={"bold"}
                mx={"10px"}
                w={"50%"}
                h={"40px"}
                zIndex={"1000"}
                value={naam}
                onChange={(e) => setNaam(e.target.value)}
              />
            )}
            {isNaam && <Button onClick={handleNameChange}>Done</Button>}
          </ModalHeader>
          <ModalCloseButton bg={primaryColor} fontWeight={"bold"} />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            {picupdate ? (
              <Spinner size="xl" color={primaryColor} thickness="4px" speed="0.65s" />
            ) : (
              <Image
                transition={"all 0.3s ease"}
                border={`4px solid ${primaryColor}`}
                borderRadius="full"
                boxSize="150px"
                src={profileUser && profileUser.pic}
                alt={profileUser && profileUser.name}
              />
            )}
            <Text fontSize={{ base: "28px", md: "30px" }} color={primaryColor}>
              {profileUser && `Email: ${profileUser.email}`}
            </Text>
          </ModalBody>
          <ModalFooter w={"100%"} display={"flex"} justifyContent={"space-between"}>
            {profileUser && user._id === profileUser._id && (
              <>
                <Button
                  bg={primaryColor}
                  onClick={changePic}
                  color={"white"}
                  fontWeight={"bold"}
                  my={"4px"}
                  fontSize={"15px"}
                  borderRadius={"10px"}
                >
                  Change Picture
                </Button>
                <Button
                  bg={primaryColor}
                  onClick={handleUpdate}
                  color={"white"}
                  fontWeight={"bold"}
                  my={"4px"}
                  fontSize={"15px"}
                  borderRadius={"10px"}
                >
                  Edit Name
                </Button>
              </>
            )}
            {profileUser && user._id !== profileUser._id && (
              <Button
                bg={primaryColor}
                onClick={handleViewStatus}
                color={"white"}
                fontWeight={"bold"}
                my={"4px"}
                fontSize={"15px"}
                borderRadius={"10px"}
              >
                View Status
              </Button>
            )}
            <Button onClick={handleCloseModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>}
      {/* Conditionally render ViewStatusModal content based on state */}
      {isViewStatusModal && (
        <Modal size="xl" onClose={handleCloseModal}  isOpen={isViewStatusModal} isCentered>
          <ModalOverlay />
          <ModalContent bg="black" color={primaryColor} borderColor={primaryColor} borderWidth={2}  rounded={"10px"}>
            <ViewStatusModal
              currUser={user}
              isOpen={isViewStatusModal}
              onClose={handleCloseModal}
              setStatus={setStatus}
              fetchStatus={fetchStatus}
              status={status.status}
              user={profileUser}
            />
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default ProfileModal;
