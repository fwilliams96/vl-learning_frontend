import { Message } from "@/models/message";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export const useChat = () => {

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const { token } = useAuth();
  
  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
  };

  const createChat = async () => {
    setLoading(true);

    //const messages = await getMockMessages();
    const data = await fetch(`${API_URL}/api/v1/chats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const chatData = await data.json();

    setMessages(chatData.messages);
    setLoading(false);
  };

  const chat = async (message: string, chatId: string) => {
    setLoading(true);

    //const messages = await getMockMessages();
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
    setLoading(false);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return {
    createChat,
    chat,
    message,
    onMessagePlayed,
    loading,
    cameraZoomed,
    setCameraZoomed,
  };
};
