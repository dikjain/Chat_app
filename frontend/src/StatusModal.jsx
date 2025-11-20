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
import useCloudinaryUpload from "./hooks/useCloudinaryUpload";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { EffectCards } from 'swiper/modules';
import ViewStatusModal from './ViewStatusModal';

function StatusModal({children}) {
  const { user, primaryColor, secondaryColor } = ChatState();
  const toast = useToast();   
  const [status, setStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { uploadImage } = useCloudinaryUpload(toast);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [statusContent, setStatusContent] = useState({ text: "", imageUrl: "" });
 


  const takeImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const imgUrl = await uploadImage(file);
        if (imgUrl) {
          setStatusContent((prev) => ({
            ...prev,
            imageUrl: imgUrl,
          }));
        }
      }
    };
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

    if(statusContent.text.length > 200){
      toast({
        title: "Maximum 200 characters allowed!",
        status: "warning",
      });
      return;
    }
    setIsLoading(true);
    try {
      const requestConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.post("/api/status", {
        id: user._id,
        content: statusContent.text,
        mediaUrl: statusContent.imageUrl,
      }, requestConfig);
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
        <ModalContent bg="black" color={secondaryColor} overflow="hidden">
          <ModalHeader>Update Your Status</ModalHeader>
          <ModalCloseButton bg={primaryColor} color="black" />
          <ModalBody display="flex"  flexDirection={{ base: "column", md: "row" }} w={{base:"100%",md:"100%"}}>
            {/* Left side: Display current status */}
            <ViewStatusModal setStatus={setStatus} currUser={user} fetchStatus={fetchStatus} status={status.status} user={user}/>

            {/* Right side: Add new status */}
            <Box flex="1" ml={{ base: 0, md: 2 }}>
              <ModalHeader color={primaryColor}>Add New Status</ModalHeader>
              <Box>
                <Text color={primaryColor}>Upload an image</Text>
                <Box onClick={takeImage} bg={primaryColor} height={{ base: "30vh", md: "50vh" }} display={"flex"} justifyContent={"center"} alignItems={"center"}  color="black" p={2} borderRadius="md" cursor="pointer">
                    {statusContent.imageUrl ? <Image src={statusContent.imageUrl} objectFit={"cover"} height={"100%"} alt="Status Image" /> : <Text>No image uploaded</Text>}
                </Box>
              </Box>
              <Textarea
                placeholder="What's on your mind?"
                maxH={"100px"}
                value={statusContent.text}
                onChange={(e) => setStatusContent((prev) => ({ ...prev, text: e.target.value }))}
                bg="black"
                color={secondaryColor}
                borderColor={secondaryColor}
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