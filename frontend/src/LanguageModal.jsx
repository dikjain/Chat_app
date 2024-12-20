import React, { useState, useEffect } from 'react'
import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Spinner, Toast } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { ChatState } from './Context/Chatprovider';
import axios from 'axios';

function LanguageModal({children}) {
  const { user, setUser, primaryColor, secondaryColor } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const languages = ['Hindi', 'English', 'Spanish', 'French', 'German', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali'];
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Added state for loading

  useEffect(() => {
    if(user.TranslateLanguage){
      setSelectedLanguage(user.TranslateLanguage);
    } else {
      setSelectedLanguage("English");
    }
  }, [user.TranslateLanguage]);

  const handleLanguageChange = async () => {
    setIsLoading(true); // Start loading
    if(user.TranslateLanguage !== selectedLanguage){
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.post("/api/user/updatelanguage", {
          UserId: user._id,
          language: selectedLanguage,
        }, config);
        setUser({ ...user, TranslateLanguage: selectedLanguage });
        onClose();
        localStorage.setItem("userInfo", JSON.stringify({ ...user, TranslateLanguage: selectedLanguage }))
      } catch (err) {
        Toast({
          title: "Error Occured!",
          description: err.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      }
    }
    setIsLoading(false); // Stop loading
  }

  return (
    <>
    <Box onClick={onOpen} >
      {children}
    </Box>

    <Modal isOpen={isOpen}  onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent bg="black" color={secondaryColor} overflow="hidden">
        <ModalHeader>Choose Your Language</ModalHeader>
        <ModalCloseButton bg={secondaryColor} color="black" />
        <ModalBody display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Select placeholder="Select language" bg={primaryColor} fontFamily={"Orbitron"} color="black" width="full" mt={2} mb={2} value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
            {languages.map((language) => (
              <option key={language} value={language}>{language}</option>
            ))}
          </Select>
          {isLoading && <Spinner />} {/* Added Spinner */}
        </ModalBody>
        <ModalFooter display="flex" justifyContent="space-between">
          <Button bg={primaryColor} color="white" mr={3} onClick={handleLanguageChange} isLoading={isLoading}>
            {isLoading ? <Spinner /> : "Submit"}
          </Button>
          <Button bg="red" color={"white"} mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>  )
}

export default LanguageModal