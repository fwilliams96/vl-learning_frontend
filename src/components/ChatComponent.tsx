'use client'

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, Send, Volume2 } from "lucide-react";

export default function ChatComponent() {
  const [messages, setMessages] = useState([
    { type: 'ai', content: "Hello! I'm your AI English tutor. How can I help you today?" },
    { type: 'user', content: "Hi! I'd like to practice my English conversation skills." },
    { type: 'ai', content: "That's great! Let's start with a simple topic. Can you tell me about your favorite hobby?" },
    { type: 'user', content: "I love playing guitar in my free time." },
    { type: 'ai', content: "That's wonderful! Playing an instrument is a great hobby. How long have you been playing guitar?" },
    { type: 'user', content: "I've been playing for about 3 years now." },
    { type: 'ai', content: "Impressive! What kind of music do you enjoy playing the most on your guitar?" },
    { type: 'user', content: "I really enjoy playing rock and blues music." },
    { type: 'ai', content: "Rock and blues are excellent genres for guitar! Do you have a favorite guitarist who inspires you?" },
    { type: 'user', content: "Yes, I'm a big fan of Jimi Hendrix and Eric Clapton." },
    { type: 'ai', content: "Those are legendary guitarists! What's your favorite song to play on the guitar?" },
    { type: 'user', content: "I love playing 'Purple Rain' by Prince. It's challenging but fun." },
    { type: 'ai', content: "That's a great choice! 'Purple Rain' has some beautiful guitar work. How often do you practice?" },
    { type: 'user', content: "I try to practice for at least an hour every day." },
    { type: 'ai', content: "That's a good practice routine. Do you ever play with other musicians or in a band?" },
    { type: 'user', content: "Not yet, but I'm hoping to join a local band soon." },
    { type: 'ai', content: "That's an exciting goal! Playing with others can really improve your skills. Have you looked into any local music scenes or open mic nights?" },
    { type: 'user', content: "I've been checking out some local venues. There's an open mic night next week I might try." },
    { type: 'ai', content: "That's fantastic! Open mic nights are a great way to gain experience and meet other musicians. Do you have any songs prepared for it?" },
    { type: 'user', content: "I'm thinking of playing an acoustic version of 'Wonderwall' by Oasis." },
    { type: 'ai', content: "That's a popular choice! It's a good song for engaging the audience. How do you feel about performing in front of others?" },
  ])
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setMessages([...messages, { type: 'user', content: inputText }])
      setInputText('')
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { type: 'ai', content: "That's interesting! Can you tell me more about that?" }])
      }, 1000)
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
            setMessages(prev => [...prev, { type: 'ai', content: "I've received your audio message. Let's continue our English practice!" }])
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

  return (
      <Card className="flex-grow relative dark:bg-gray-900">
        <CardContent className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold dark:text-gray-200">Chat</h2>
          </div>
          
          <div className="flex-grow flex relative">
            <ScrollArea className="flex-grow h-[calc(100vh-16rem)] pr-5" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[70%] p-3 rounded-lg ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

          </div>
          
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
          
          <audio ref={audioRef} src="/placeholder-audio.mp3" />
        </CardContent>
      </Card>
  )
}