import { Button } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { Routes,Route } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import ChatPage from './Pages/ChatPage'
import VideoCall from './Pages/VideoCall'
import { ChatState } from './Context/Chatprovider'
import { config, validateConfig } from './constants/config'
function App() {
  const {secondaryColor} = ChatState();
  
  // Validate environment configuration on app startup
  useEffect(() => {
    validateConfig();
  }, []);
  
  return (
    <div className='op' style={{background: `linear-gradient(45deg, black, black, ${secondaryColor}, black, black)`}}>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/Chats" element={<ChatPage/>}/>
        <Route path="/videocall/:id" element={<VideoCall/>}/>
      </Routes>
    </div>
  )
}

export default App