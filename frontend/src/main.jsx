import { createRoot } from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { BrowserRouter } from 'react-router-dom'
import ChatProvider from '@/context/Chatprovider.jsx'
import { Toaster } from '@/components/ui/sonner'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <ChatProvider>
    <App />
    <Toaster />
  </ChatProvider>
  </BrowserRouter>
)
