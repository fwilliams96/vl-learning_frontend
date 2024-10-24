// /src/services/chaService.tsx

import { Chat } from '@/models/chat';
import { ChatMessage, ChatMessageOrigin, ChatMessageType } from '@/models/chat-message';
import axios from 'axios';

// Obtén la URL base desde la variable de entorno
const API_URL = import.meta.env.VITE_API_URL;
const endpointUrl = `${API_URL}/chat`;

export async function startChat(): Promise<Chat> {
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
export function mockStartChat(): Promise<Chat> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockChat: Chat = {
        id: '123456',
        messages: [
          {
            id: '1',
            type: ChatMessageType.TEXT,
            text: "Hello! I'm your AI English tutor. How can I help you today?",
            sent_date: new Date().toISOString(),
            origin: ChatMessageOrigin.AGENT
          },
          {
            id: '2',
            type: ChatMessageType.TEXT,
            text: "Hi! I'd like to practice my English conversation skills.",
            sent_date: new Date().toISOString(),
            origin: ChatMessageOrigin.USER
          },
          {
            id: '3',
            type: ChatMessageType.TEXT,
            text: "That's great! Let's start with a simple topic. Can you tell me about your favorite hobby?",
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


export async function endChat(chatId: string): Promise<Chat> {
  try {
    const response = await axios.post(`${endpointUrl}/${chatId}/finish`);
    return response.data;
  } catch (error) {
    console.error("Error finishing chat", error);
    throw error;
  }
}

export async function recoverChat(chatId: string): Promise<Chat> {
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