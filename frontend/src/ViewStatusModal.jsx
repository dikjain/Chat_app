import React, { useEffect, useState } from 'react'
import { Box, ModalHeader, Text, Image, useToast, Button } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import axios from 'axios';

function ViewStatusModal({ fetchStatus,user, status, currUser}) {
  const[currentStatus , setCurrentStatus] = useState([])
  const toast = useToast();

  const deleteStatus = async (id) => {
      try {
        await axios.post("/api/status/delete", { id: id });
        toast({
          title: "Status deleted successfully",
          status: "success",
        });
        fetchStatus({id: user._id});
      } catch (err) {
        console.log(err);
        toast({
          title: "Error deleting status",
          status: "error",
        });
      }
  }
  const calculateTimeRemaining = (expiresAt) => {
    const diffInMs = new Date(expiresAt) - new Date(); 
    if (diffInMs <= 0) return 'Expired';
    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `Expires in ${hours}h ${minutes}m` : `Expires in ${minutes}m`;
  };
  useEffect(() => {
    fetchStatus({id: user._id});
  }, []);
  
  useEffect(() => {
      setCurrentStatus(status)
  }, [status])
  
  return (
    <>
    <Box flex="1" alignItems={"center"} justifyContent={"center"}  mr={{ base: 0, md: 2 }} mb={{ base: 2, md: 0 }}>
    <ModalHeader color="green.400">{user._id === currUser._id ? "Your Status" : `${user.name}'s Status`}</ModalHeader>
    <Box  display={"flex"} alignItems={"center"} justifyContent={"center"} rounded={"md"} height={{base:"30vh",md:"70vh"}} >
    {currentStatus && < Swiper
        effect={'cards'}
        grabCursor={true}
        modules={[EffectCards]}
        className="mySwiper"  
      >
      {currentStatus.length > 0 && currentStatus.map((item,index) => (
        <SwiperSlide key={index}>
          <Box bg={"rgba(0,0,0,0.5)"} w={"100%"} h={"100%"} display={"flex"}  justifyContent={"end"} flexDir={"column"} color="black" position="relative">
            <Image objectFit={"contain"} maxHeight={"100%"} src={item.mediaUrl} />
            <Text position={"absolute"} bottom={0} h={"fit-content"} maxW={"100%"} px={3} bg={"black"} opacity={0.6} color={"white"} >{item.content}</Text>
            {user._id === currUser._id && <Button  position={"absolute"}  top={2}  right={2}  colorScheme="red"  size="sm" onClick={() => deleteStatus(item._id)}>Delete</Button>}
            <Button position={"absolute"}  top={2}  left={2} color={"white"}  bg={"green.400"}  size="sm">{calculateTimeRemaining(item.expiresAt)}</Button>
          </Box>
        </SwiperSlide>
     ))}
     </Swiper>}
     {!status && <Text color="green.400" fontSize={"lg"} textAlign={"center"} mt={4}>No status found</Text>}
    
    </Box>
    </Box>
    </>
  )
}

export default ViewStatusModal