import React,{useEffect} from 'react'
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
  Textarea,
  Box,
  Text,
  Image,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChatState } from "./Context/Chatprovider";
import axios from 'axios';
import './Swiper.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { EffectCards } from 'swiper/modules';
import ViewStatusModal from './ViewStatusModal';

function StatusModal({children}) {
  const { user } = ChatState();
  const toast = useToast();   
  const [status, setStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [statusContent, setStatusContent] = useState({ text: "", imageUrl: "" });
 
  


  const takeImage = () => {
    let imgUrl;
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
            .then( (dats) => {imgUrl = dats.url})
            .then(async () => {
              try {
                setStatusContent((prev) => ({
                  ...prev,
                  imageUrl: imgUrl,
                }));
              } catch (err) {
                console.log(err);
            }
        });
        } else {
          toast({
            title: "Please Select an Image!",
            status: "warning",
          });
        }
      }
    }
    input.click();
  }
  const CreateStatus = async () => {

    if(statusContent.text === "" && statusContent.imageUrl === ""){
      toast({
        title: "Please Enter Some Text or Upload an Image!",
        status: "warning",
      });
      return;
    }

    if(statusContent.text.length > 100){
      toast({
        title: "Maximum 100 characters allowed!",
        status: "warning",
      });
      return;
    }
    setIsLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post("/api/status", {
        id: user._id,
        content: statusContent.text,
        mediaUrl: statusContent.imageUrl,
      }, config);
      setStatusContent({ text: "", imageUrl: "" });
      // Fetch the updated status
      fetchStatus({id: user._id});
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      toast({
        title: "Error Occured!",
        status: "error",
      });
      setIsLoading(false);
    }
  }

  const fetchStatus = async ({id}) => {
    try {

      const { data } = await axios.post("/api/status/fetch",{
        id: id
      });
      setStatus(data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Box onClick={onOpen} >
        {children}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent bg="black" color="green.400" overflow="hidden">
          <ModalHeader>Update Your Status</ModalHeader>
          <ModalCloseButton bg="green.400" color="black" />
          <ModalBody display="flex"  flexDirection={{ base: "column", md: "row" }}>
            {/* Left side: Display current status */}
            <ViewStatusModal setStatus={setStatus} currUser={user} fetchStatus={fetchStatus} status={status.status} user={user}/>

            {/* Right side: Add new status */}
            <Box flex="1" ml={{ base: 0, md: 2 }}>
              <ModalHeader color="green.400">Add New Status</ModalHeader>
              <Box>
                <Text color="green.400">Upload an image</Text>
                <Box onClick={takeImage} bg="green.400" height={{ base: "30vh", md: "50vh" }} display={"flex"} justifyContent={"center"} alignItems={"center"}  color="black" p={2} borderRadius="md" cursor="pointer">
                    {statusContent.imageUrl ? <Image src={statusContent.imageUrl} objectFit={"cover"} height={"100%"} alt="Status Image" /> : <Text>No image uploaded</Text>}
                </Box>
              </Box>
              <Textarea
                placeholder="What's on your mind?"
                maxH={"100px"}
                value={statusContent.text}
                onChange={(e) => setStatusContent((prev) => ({ ...prev, text: e.target.value }))}
                bg="black"
                color="green.400"
                borderColor="green.400"
                _placeholder={{ color: "gray.500" }}
              />
              <Button colorScheme="green" mt={3} onClick={CreateStatus} isLoading={isLoading}>
                Add
              </Button>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default StatusModal