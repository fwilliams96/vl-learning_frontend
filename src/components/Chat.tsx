/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Mic, Move, Send, Volume2 } from 'lucide-react';
import Draggable, { DraggableEvent } from 'react-draggable';
import './Chat.css';
import { ResizableBox } from 'react-resizable';
import { useChat } from '@/hooks/useChat';
import { ChatData } from '@/models/chat';
import { ChatMessageType, ChatMessageOrigin } from '@/models/chat-message';
import { useAvatarController } from '@/hooks/useAvatarController';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai' }[]>([
      { text: "Welcome to the English Academy AI chat! How can I help you today?", sender: 'ai' }
    ])
  const [inputText, setInputText] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [chatPosition, setChatPosition] = useState({ x: 400, y: 100 });
  const [chatSize, setChatSize] = useState({ width: 600, height: 800 });
  const { createChat, chat, loading, cameraZoomed, setCameraZoomed, message } = useChat();
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { setMessage, setOnMessagePlayed } = useAvatarController();
  const [gameState, setGameState] = useState<'initial' | 'playing'>('initial');

  useEffect(() => {
    if (message?.text) {
      setChatData((prev: ChatData | null) => {
        if (prev) {
          return {
            ...prev,
            messages: [...prev.messages, { text: message.text, type: ChatMessageType.TEXT, origin: ChatMessageOrigin.AGENT }]
          }
        }
        return prev;
      });
      setMessage({
        animation: message.animation,
        facialExpression: message.facialExpression,
        lipsync: message.lipsync,
        audio: message.audio
      });
      setOnMessagePlayed(() => {
        setMessage(undefined);
      });
    }
  }, [message]);

  const handleSendMessage = () => {
    if (!loading && !message && inputText && chatData?.id) {
      setChatData((prev: ChatData | null) => {
        if (prev) {
          return {
            ...prev,
            messages: [...prev.messages, { text: inputText, type: ChatMessageType.TEXT, origin: ChatMessageOrigin.USER }]
          }
        }
        return prev;
      });
      chat(inputText, chatData.id);
      setInputText('');
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const recorder = new MediaRecorder(stream);
          mediaRecorderRef.current = recorder
          mediaRecorderRef.current.start()
          mediaRecorderRef.current.ondataavailable = (event) => {
            const audioBlob = new Blob([event.data], { type: 'audio/wav' })
            // Here you would typically send this blob to your AI service
            console.log("Audio recorded", audioBlob)
            // Simulate AI response
            //setMessages(prev => [...prev, { type: 'ai', content: "I've received your audio message. Let's continue our English practice!" }])
          }
        })
    }
    setIsRecording(!isRecording)
  }

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => setIsPlaying(false)
    }
  }, [])

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleDrag = (e: DraggableEvent, data: { x: number; y: number }) => {
    setChatPosition({ x: data.x, y: data.y });
  };

  const handleResize = (e: React.SyntheticEvent, { size }: { size: { width: number; height: number } }) => {
    setChatSize({ width: size.width, height: size.height });
  };

  const handleStart = () => {
    setGameState('playing');
    createChat();
  };

  const renderContent = () => {
    switch (gameState) {
      case 'initial':
        return (
          <div className="flex justify-center items-center h-[50vh]">
            <Button onClick={handleStart} size="lg">
              Start
            </Button>
          </div>
        );
      
      case 'playing':
        return (
          <>
            <ScrollArea className="h-[calc(50vh-4rem)] pr-5" ref={scrollAreaRef}>
              <div className="space-y-4 p-4">
                {chatData?.messages.map((message, index) => (
                  <div key={index} className={`flex ${message.origin === 'USER' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg ${message.origin === 'USER' ? 'bg-gray-200 text-black' : 'bg-gray-800 text-white'}`}>
                    {message.text}
                  </div>
                </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex space-x-2">
                <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
            <Button onClick={handleSendMessage}>
              <Send size={20} />
            </Button>
            <Button variant={isRecording ? "destructive" : "default"} onClick={toggleRecording}>
              <Mic size={20} />
            </Button>
            <Button onClick={playAudio} disabled={isPlaying}>
              <Volume2 size={20} />
            </Button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="h-screen w-full z-10 absolute right-0 bottom-0">
        <Draggable
            bounds="parent"
            handle=".chat-handle"
            position={chatPosition}
            onDrag={handleDrag}
        >
       <ResizableBox
          width={chatSize.width}
          height={chatSize.height}
          minConstraints={[200, 200]} // Tamaño mínimo
          maxConstraints={[window.innerWidth - 20, window.innerHeight - 20]} // Tamaño máximo relativo a la pantalla
          onResizeStop={(e, data) => setChatSize({ width: data.size.width, height: data.size.height })}
        >

      <div className="w-full bg-gray-100 dark:bg-gray-900">
      <Card className={`transition-all duration-300 ease-in-out`}>
      <CardHeader className="chat-handle flex flex-row items-center justify-between space-y-0 pb-2 cursor-move">
      <CardTitle className="text-2xl font-bold text-black dark:text-white">Chat with AI Tutor</CardTitle>
            <div className="flex space-x-2">
              <Button size="icon" aria-label="Move chat window">
                <Move className="h-4 w-4" />
              </Button>
              {/*<Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={isExpanded ? "Minimize chat window" : "Maximize chat window"}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              */}
            </div>
        </CardHeader>
        <CardContent>
            { renderContent() }
          </CardContent>
      </Card>
      </div>
      </ResizableBox>
      </Draggable>
    </div>
  );
};

export default Chat;