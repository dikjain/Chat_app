import { Button } from '@chakra-ui/react'
import React from 'react'
import { Routes,Route } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import ChatPage from './Pages/ChatPage'

function App() {
  return (
    <div className='op'>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/Chats" element={<ChatPage/>}/>
      </Routes>
    </div>
  )
}

export default App