
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
} from "@chakra-ui/react";

import axios from "axios";
import { useState } from "react";

const   ProfileModal = ({ user, children,setUser }) => {
  const[pic,setPic] = useState(user.pic);

  const toast = useToast();


  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleUpdate = () => {

  }
  const changePic = () => {
    let imgUrl;

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
  
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const filereader = new FileReader();
        filereader.readAsDataURL(file); // Start reading the file as Data URL
        if (file.type === "image/jpeg" || file.type === "image/png") {
          const data = new FormData();
          data.append("file", file); // Corrected the variable name from 'pics' to 'file'
          data.append("upload_preset", "chat-app");
          data.append("cloud_name", "ddtkuyiwb");
          fetch("https://api.cloudinary.com/v1_1/ddtkuyiwb/image/upload", {
            method: "post",
            body: data,
          })
            .then((res) => res.json())
            .then( (data) => {imgUrl = data.url})
            .then(async () => {
              try {
                const { data } = await axios.post(
                  "/api/user/update",
                  {
                    UserId: user._id,
                    pic: imgUrl,
                    name: user.name,
                  },
                  config
                );
                setUser({
                  _id: user._id,
                  name: data.name,
                  pic: data.pic,    
                  token: user.token,
                  email: user.email
              })
              localStorage.setItem("userInfo", JSON.stringify(user));
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
          Toast({
            title: "Please Select an Image!",
            status: "warning",
          });
        }
      }else {
        Toast({
          title: "Please Select an Image!",
          status: "warning",
        });
      }
    };
    input.click(); // Trigger the input click to open the file dialog
  };
  

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px" bg={"#18191a"}>
          <ModalHeader
            fontSize="40px"
            fontFamily="Roboto"
            display="flex"
            justifyContent="center"
            color={"#48bb78"}

          >
            {(user.name).toUpperCase()}
          </ModalHeader>
          <ModalCloseButton bg={"#48bb78"} fontWeight={"bold"} />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
            border={"4px solid #48bb78"}
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              color={"#48bb78"}

            >
              Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter w={"100%"} display={"flex"} justifyContent={"space-between"} >
          {user.token && <Button bg={"#48bb78"} onClick={changePic} color={"white"} fontWeight={"bold"} my={"4px"} fontSize={"15px"} borderRadius={"10px"} >Change Picture</Button>}
          {user.token && <Button bg={"#48bb78"} onClick={handleUpdate} color={"white"} fontWeight={"bold"} my={"4px"} fontSize={"15px"} borderRadius={"10px"} >Edit Name</Button>}
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
