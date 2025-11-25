import { createRoot } from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import 'react-chat-elements/dist/main.css'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary'
import { Toaster } from '@/components/ui/sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary message="Something went wrong. Please refresh the page.">
        <App />
        <Toaster />
      </ErrorBoundary>
    </QueryClientProvider>
  </BrowserRouter>
)
