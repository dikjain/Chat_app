import React, { useEffect } from 'react'
import { Routes,Route } from 'react-router-dom'
import AuthPage from '@/pages/AuthPage'
import ChatPage from '@/pages/ChatPage'
import VideoCall from '@/pages/VideoCall'
import { ChatState } from '@/context/Chatprovider'
import { config, validateConfig } from '@/constants/config'
import LandingPage from '@/pages/LandingPage'
function App() {
  useEffect(() => {
    validateConfig();
  }, []);
  
  return (
    <div className='min-h-screen overflow-hidden flex items-center justify-center'>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/auth" element={<AuthPage/>}/>
        <Route path="/chats" element={<ChatPage/>}/>
        <Route path="/videocall/:id" element={<VideoCall/>}/>
      </Routes>
    </div>
  )
}

export default App