import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ChatProvider } from './hooks/useChat.tsx'
import "./firebaseConfig"; // Esto inicializa Firebase al cargar la aplicación

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChatProvider>
      <App />
    </ChatProvider>
  </StrictMode>
)
