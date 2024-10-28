/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Mic, Move, Send, Volume2 } from 'lucide-react';
import Draggable, { DraggableEvent } from 'react-draggable';
import './ChatWindow.css';
import { ResizableBox } from 'react-resizable';
import { useChat } from '@/hooks/useChat';
import { ChatData } from '@/models/chat';
import { ChatMessageType, ChatMessageOrigin } from '@/models/chat-message';

const ChatWindow: React.FC = () => {
    const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'ai' }[]>([
        { text: "Welcome to the English Academy AI chat! How can I help you today?", sender: 'ai' }
      ])
      const [inputText, setInputText] = useState('')
      const [isExpanded, setIsExpanded] = useState(false)
      const scrollAreaRef = useRef<HTMLDivElement>(null)
      const [chatPosition, setChatPosition] = useState({ x: 0, y: 0 });
      const [chatSize, setChatSize] = useState({ width: 600, height: 400 });
      const { chat, loading, cameraZoomed, setCameraZoomed, message } = useChat();
      const [chatData, setChatData] = useState<ChatData | null>(null);
      const [isRecording, setIsRecording] = useState(false);
      const [isPlaying, setIsPlaying] = useState(false);
      const mediaRecorderRef = useRef<MediaRecorder | null>(null);
      const audioRef = useRef<HTMLAudioElement | null>(null);

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
        }
      }, [message]);
    
      const handleSendMessage = () => {
        if (!loading && !message && inputText) {
          setChatData((prev: ChatData | null) => {
            if (prev) {
              return {
                ...prev,
                messages: [...prev.messages, { text: inputText, type: ChatMessageType.TEXT, origin: ChatMessageOrigin.USER }]
              }
            }
            return prev;
          });
          chat(inputText);
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

      const handleDrag = (e: DraggableEvent, data: { x: number; y: number }) => {
        setChatPosition({ x: data.x, y: data.y });
      };
    
      const handleResize = (e: React.SyntheticEvent, { size }: { size: { width: number; height: number } }) => {
        setChatSize({ width: size.width, height: size.height });
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

      <div className="w-full max-w-md bg-gray-100 dark:bg-gray-900">
      <Card className={`transition-all duration-300 ease-in-out`}>
      <CardHeader className="chat-handle flex flex-row items-center justify-between space-y-0 pb-2 cursor-move">
      <CardTitle className="text-2xl font-bold">Chat with AI Tutor</CardTitle>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" aria-label="Move chat window">
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
            <ScrollArea className="h-[calc(50vh-4rem)] pr-5" ref={scrollAreaRef}>
              <div className="space-y-4 p-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      }`}
                    >
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
            <Button variant="outline" onClick={playAudio} disabled={isPlaying}>
              <Volume2 size={20} />
            </Button>
            </div>
          </CardContent>
      </Card>
      </div>
      </ResizableBox>
      </Draggable>
    </div>
  );
};

export default ChatWindow;