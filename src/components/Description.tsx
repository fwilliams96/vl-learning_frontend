/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Mic, Move, Pause, Play, Send, Volume2 } from 'lucide-react';
import Draggable, { DraggableEvent } from 'react-draggable';
import './Description.css';
import { ResizableBox } from 'react-resizable';
import { Textarea } from './ui/textarea';
import { AspectRatio } from './ui/aspect-ratio';
import { useDescription } from '@/hooks/useDescription';
import { DescriptionData, DescriptionResult } from '@/models/description';
import { ScrollArea } from './ui/scroll-area';

const Description: React.FC = () => {
  const [resultData, setResultData] = useState<DescriptionResult | null>(null)
  const [inputText, setInputText] = useState('')
  const [inputTextDisabled, setInputTextDisabled] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [chatPosition, setChatPosition] = useState({ x: 400, y: 100 });
  const [chatSize, setChatSize] = useState({ width: 600, height: 800 });
  const { generateDescription, sendUserDescription, description, loading, result } = useDescription();
  const [ descriptionData, setDescriptionData ] = useState<DescriptionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [gameState, setGameState] = useState<'initial' | 'playing'>('initial');
  const [inputType, setInputType] = useState<'text' | 'audio' | null>(null);
  const [audioData, setAudioData] = useState<Blob | null>(null);

  const loadDescription = async () => {
    try {
      await generateDescription();
    } catch (err) {
      setError("Error fetching description");
    }
  };

  useEffect(() => {
    if (description) {
      setDescriptionData(description);
    }
  }, [description]);
    
  const handleSendDescription = () => {
    if (!loading && descriptionData && !descriptionData.result && inputText) {
      sendUserDescription(descriptionData.id, inputText, 'text');
      setInputTextDisabled(true);
    }
  };

  const handleSendAudio = async () => {
    if (audioData && !loading && descriptionData && !descriptionData.result) {
      // Convert audio blob to base64 or handle it according to your API requirements
      const reader = new FileReader();
      reader.readAsDataURL(audioData);
      reader.onloadend = () => {
        const base64Audio = reader.result as string;
        sendUserDescription(descriptionData.id, base64Audio, 'audio');
      };
      setInputTextDisabled(true);
    }
  };

  useEffect(() => {
    if (result) {
      setResultData(result);
    }
  }, [result]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [resultData]);

  const toggleRecording = () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setAudioData(null);
      }
      setInputType(null);
    } else {
      setInputText(''); // Clear text input when starting recording
      setInputType('audio');
      navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new MediaRecorder(stream);
        const chunks: BlobPart[] = [];
        
        recorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/mp3' });
          setAudioData(blob);
          if (audioRef.current) {
            audioRef.current.src = URL.createObjectURL(blob);
          }
        };

        mediaRecorderRef.current = recorder;
        mediaRecorderRef.current.start();
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
        setInputType(null);
      });
    }
    setIsRecording(!isRecording);
  };
    
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

  const handleDrag = (e: DraggableEvent, data: { x: number; y: number }) => {
    setChatPosition({ x: data.x, y: data.y });
  };

  const handleResize = (e: React.SyntheticEvent, { size }: { size: { width: number; height: number } }) => {
    setChatSize({ width: size.width, height: size.height });
  };

  const handleStart = async () => {
    try {
      await loadDescription();
      setGameState('playing');
    } catch (error) {
      setError("Failed to start listening exercise");
    }
  };

  const handleSeek = (value: number) => {
    if (audioRef.current) {
      const time = (value / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isRecording) {
      setInputText(e.target.value);
      if (e.target.value) {
        setInputType('text');
      } else {
        setInputType(null);
      }
    }
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
            {/*<ScrollArea className="h-[calc(50vh-4rem)] pr-5">*/}
            <ScrollArea className="h-[calc(75vh-4rem)] pr-5" ref={scrollAreaRef}>
              <div className="flex flex-col">
                  <AspectRatio ratio={16 / 9} className="bg-muted">
                    <img
                      src={descriptionData?.image_url}
                      alt="Photo by Drew Beamer"
                      className="h-full w-full rounded-md object-cover"
                    />
                  </AspectRatio>
                  <div className="mt-4">
                    <Textarea
                      value={inputText}
                      disabled={inputTextDisabled || isRecording}
                      rows={5}
                      onChange={handleTextChange}
                      placeholder={isRecording ? "Recording in progress..." : "Type your description..."}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendDescription()}
                    />
                    {audioData && <div className="flex items-center gap-2 p-2 bg-gray-200 dark:bg-gray-800 rounded-lg">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={playAudio}
                        disabled={!isPlaying}
                      >
                        {/*<Volume2 className="h-6 w-6" />*/}
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </Button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue={0}  // Add explicit default value
                        value={progress || 0}
                        onChange={(e) => handleSeek(Number(e.target.value))}
                        className="progress-bar w-full"
                        style={{ "--progress": `${progress}%` } as React.CSSProperties}
                      />
                      <audio ref={audioRef} className="hidden" />
                    </div>}

                  <div className="mt-4 flex space-x-2">
                      <Button 
                        onClick={inputType === 'text' ? handleSendDescription : handleSendAudio} 
                        disabled={!inputType || (inputType === 'text' && !inputText)}
                      >
                        <Send size={20} />
                      </Button>
                      <Button variant={isRecording ? "destructive" : "default"} onClick={toggleRecording}>
                        <Mic size={20} />
                      </Button>
                      <Button onClick={playAudio} disabled={isPlaying}>
                        <Volume2 size={20} />
                      </Button>
                    </div>

                    {/* Add the new result section */}
                    {resultData && (
                      <div className="mt-4 border rounded-lg p-4 bg-muted">
                        <div className="mb-2">
                          <span className="font-bold">Rating: </span>
                          <span className="text-lg">{resultData?.rating}/10</span>
                        </div>
                        
                        <div className="mb-2">
                          <span className="font-bold">Solution: </span>
                          <p className="mt-1 text-sm">{resultData?.solution}</p>
                        </div>
                        
                        <div>
                          <span className="font-bold">Feedback: </span>
                          <p className="mt-1 text-sm">{resultData?.comments}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
            </ScrollArea>
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
          <CardTitle className="text-2xl font-bold text-black dark:text-white">
            Describe the image
          </CardTitle>
          <div className="flex space-x-2">
            <Button size="icon" aria-label="Move chat window">
              <Move className="h-4 w-4" />
            </Button>
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

export default Description;