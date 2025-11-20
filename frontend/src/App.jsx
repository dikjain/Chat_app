import React, { useEffect } from 'react'
import { Routes,Route } from 'react-router-dom'
import AuthPage from './Pages/AuthPage'
import ChatPage from './Pages/ChatPage'
import VideoCall from './Pages/VideoCall'
import { ChatState } from './Context/Chatprovider'
import { config, validateConfig } from './constants/config'
import LandingPage from './Pages/landingPage'
function App() {
  const {secondaryColor} = ChatState();
  
  useEffect(() => {
    validateConfig();
  }, []);
  
  return (
    <div className='min-h-screen overflow-hidden flex items-center justify-center'>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/auth" element={<AuthPage/>}/>
        <Route path="/Chats" element={<ChatPage/>}/>
        <Route path="/videocall/:id" element={<VideoCall/>}/>
      </Routes>
    </div>
  )
}

export default App