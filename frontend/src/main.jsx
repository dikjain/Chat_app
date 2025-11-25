import { createRoot } from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import 'react-chat-elements/dist/main.css'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import { Toaster } from '@/components/ui/sonner'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ErrorBoundary message="Something went wrong. Please refresh the page.">
      <App />
      <Toaster />
    </ErrorBoundary>
  </BrowserRouter>
)
