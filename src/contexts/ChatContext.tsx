import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Message } from "@/models/message";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

interface ChatContextType {
  createChat: () => Promise<void>;
  chat: (message: string, chatId: string) => Promise<void>;
  message: Message | null;
  onMessagePlayed: () => void;
  loading: boolean;
  cameraZoomed: boolean;
  setCameraZoomed: (zoomed: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const { token } = useAuth();
  
  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
  };

  const createChat = async () => {
    setLoading(true);
    try {
        const data = await fetch(`${API_URL}/api/v1/chats`, {
            method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
        });
        const chatData = await data.json();
        setMessages(chatData.messages);
    } catch (error) {
        console.error('Error creating chat:', error);
    } finally {
        setLoading(false);
    }
  };

  const chat = async (message: string, chatId: string) => {
    setLoading(true);
    try {
      const data = await fetch(`${API_URL}/api/v1/chats/${chatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ "content": message }),
      });
      const chatData = await data.json();
      setMessages((prevMessages) => [...prevMessages, ...chatData.messages]);
    } catch (error) {
      console.error('Error in chat:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  const value = {
    createChat,
    chat,
    message,
    onMessagePlayed,
    loading,
    cameraZoomed,
    setCameraZoomed,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 