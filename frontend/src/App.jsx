import { Button } from '@chakra-ui/react'
import React from 'react'
import { Routes,Route } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import ChatPage from './Pages/ChatPage'
import VideoCall from './Pages/VideoCall'
function App() {
  return (
    <div className='op'>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/Chats" element={<ChatPage/>}/>
        <Route path="/videocall/:id" element={<VideoCall/>}/>
      </Routes>
    </div>
  )
}

export default App