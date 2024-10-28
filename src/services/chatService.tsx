// /src/services/chaService.tsx

import { ChatData } from '@/models/chat';
import { ChatMessage, ChatMessageOrigin, ChatMessageType } from '@/models/chat-message';
import axios from 'axios';

// Obtén la URL base desde la variable de entorno
const API_URL = import.meta.env.VITE_API_URL;
const endpointUrl = `${API_URL}/chat`;

export async function startChat(): Promise<ChatData> {
  try {
    /*const response = await axios.post(endpointUrl);
    return response.data;*/
    return mockStartChat();
  } catch (error) {
    console.error("Error starting chat", error);
    throw error;
  }
}

// create a mockup startChat function with some messages already
export function mockStartChat(): Promise<ChatData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockChat: ChatData = {
        id: '123456',
        messages: [
          {
            id: '1',
            type: ChatMessageType.TEXT,
            text: "¡Buenas! ¿En qué puedo ayudarte hoy?",
            sent_date: new Date().toISOString(),
            origin: ChatMessageOrigin.AGENT
          }
        ],
        creation_date: new Date().toISOString(),
        participants: ['user', 'ai'],
        is_over: false
      };
      resolve(mockChat);
    }, 500); // Simulate network delay
  });
}


export async function endChat(chatId: string): Promise<ChatData> {
  try {
    const response = await axios.post(`${endpointUrl}/${chatId}/finish`);
    return response.data;
  } catch (error) {
    console.error("Error finishing chat", error);
    throw error;
  }
}

export async function recoverChat(chatId: string): Promise<ChatData> {
  try {
    const response = await axios.get(`${endpointUrl}/${chatId}`);
    return response.data;
  } catch (error) {
    console.error("Error recovering chat", error);
    throw error;
  }
}

export async function sendMessage(chatId: string, message: ChatMessage): Promise<ChatMessage[]> {
  try {
    const response = await axios.post(`${endpointUrl}/${chatId}`, message);
    return response.data;
  } catch (error) {
    console.error("Error sending message", error);
    throw error;
  }
}