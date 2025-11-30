import React, { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import AuthPage from '@/pages/AuthPage.jsx'
import ChatPage from '@/pages/ChatPage.jsx'
import { validateConfig } from '@/constants/config'
import LandingPage from '@/pages/LandingPage.jsx'
import { useAuthStore } from '@/stores'
import "./leafletFix"

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  useEffect(() => {
    validateConfig();
  }, []);
  
  return (
    <div className='min-h-screen overflow-hidden flex items-center justify-center'>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/auth" element={<AuthPage/>}/>
        <Route 
          path="/chats" 
          element={
            <ProtectedRoute>
              <ChatPage/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App