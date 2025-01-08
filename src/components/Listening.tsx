/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Mic, Move, Pause, Play, Send, Volume2 } from 'lucide-react';
import Draggable, { DraggableEvent } from 'react-draggable';
import './Chat.css';
import { ResizableBox } from 'react-resizable';
import { ChatData } from '@/models/chat';
import { ChatMessageType, ChatMessageOrigin } from '@/models/chat-message';
import { Textarea } from './ui/textarea';
import { AspectRatio } from './ui/aspect-ratio';
import { Word } from '@/models/word';
import { ListeningData, ListeningSentence, ListeningWord } from '@/models/listening';
import { useListening } from '@/hooks/useListening';
import { useToast } from '@/hooks/use-toast';

const Listening: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [chatPosition, setChatPosition] = useState({ x: 400, y: 100 });
  const [chatSize, setChatSize] = useState({ width: 600, height: 800 });
  const [listeningData, setListeningData] = useState<ListeningData | null>(null);
  const [currentSentence, setCurrentSentence] = useState<ListeningSentence | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Add these new states
  const [currentPage, setCurrentPage] = useState(1);
  const totalSentences = 1; // 

  const { generateListening, closeListening, listening, loading } = useListening();
  const [progress, setProgress] = useState(0);
  const [gameState, setGameState] = useState<'initial' | 'playing'>('initial');
  const { toast } = useToast()

  const loadListening = async () => {
    try {
      await generateListening(totalSentences);
    } catch (err) {
      setError("Error fetching description");
    }
  };

  useEffect(() => {
    if (listening) {
      setListeningData(listening);
      setCurrentSentence(listening.sentences[0]);
    }
  }, [listening]);

  useEffect(() => {
    if (currentSentence) {
      setProgress(0);
      
      // Do not load audio if the sentence is answered
      if (currentSentence.answered || audioRef.current?.dataset.sentenceId === currentSentence.id) {
        console.log('Audio already loaded for this sentence');
        return;
      }
      const blob = b64toBlob(currentSentence.audio, 'audio/mp3');
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.dataset.sentenceId = currentSentence.id; // Store the current sentence ID
        audioRef.current.currentTime = 0;
        audioRef.current.onended = () => {
          setIsPlaying(false);
          setProgress(0);  // Reset progress when loading new audio
        };
        // Add timeupdate event listener
        audioRef.current.ontimeupdate = () => {
          const percentage = (audioRef.current!.currentTime / audioRef.current!.duration) * 100;
          setProgress(percentage);
        };
        audioRef.current.load();
      }

      if (!currentSentence.words.some(word => 'user_word' in word)) {
        currentSentence.words = initializeSentenceWords(currentSentence.words);
      }
      currentSentence.answered = false;
    }
  }, [currentSentence]);  

  const b64toBlob = (b64Data: string, contentType: string): Blob => {
	  const sliceSize = 512;
	  const byteCharacters = atob(b64Data);
	  const byteArrays = [];

	  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize);

		const byteNumbers = new Array(slice.length);
	    for (let i = 0; i < slice.length; i++) {
	      byteNumbers[i] = slice.charCodeAt(i);
	    }

	    const byteArray = new Uint8Array(byteNumbers);
	    byteArrays.push(byteArray);
	  }

	  const blob = new Blob(byteArrays, {type: contentType});
	  return blob;
  }

  const initializeSentenceWords = (words: ListeningWord[]): ListeningWord[] => {
    return words.map(word => {
      if (word.askable) {
        return {
          ...word,
          user_word: ''
        };
      }
      return {...word};
    });

  }

  useEffect(() => {
    if (listening) {
      setCurrentSentence(listening.sentences[currentPage - 1]);
    }
  }, [currentPage]);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleSeek = (value: number) => {
    if (audioRef.current) {
      const time = (value / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
    }
  };

  const handleDrag = (e: DraggableEvent, data: { x: number; y: number }) => {
    setChatPosition({ x: data.x, y: data.y });
  };

  const handleResize = (e: React.SyntheticEvent, { size }: { size: { width: number; height: number } }) => {
    setChatSize({ width: size.width, height: size.height });
  };

  const handleWordChange = (index: number, value: string) => {
    if (!currentSentence) return;
  
    // Create a new array with the updated word
    const updatedWords = [...currentSentence.words];
    updatedWords[index] = {
      ...updatedWords[index],
      user_word: value
    };
  
    // Update the current sentence with the new words array
    setCurrentSentence({
      ...currentSentence,
      words: updatedWords
    });
  };

  // Add this function to verify the sentence
  const checkSentence = () => {
    if (!currentSentence) return;

    // Check why user_word is not the same as the word, add a console.log
    console.log(currentSentence.words);

    const updatedWords = currentSentence.words.map(word => ({
      ...word,
      wrong: word.askable && word.user_word !== word.word
    }));

    // Update the current sentence with the new words array
    setCurrentSentence({
      ...currentSentence,
      words: updatedWords,
      answered: true
    });
  };

  const handleStart = async () => {
    try {
      await loadListening();
      setGameState('playing');
    } catch (error) {
      setError("Failed to start listening exercise");
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
            <div className="flex flex-col">
            {/* Audio Component */}
            <div className="mb-4">
              <div className="flex items-center gap-2 p-2 bg-gray-200 dark:bg-gray-800 rounded-lg">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={playAudio}
                  disabled={!currentSentence || isPlaying}
                >
                  {/*<Volume2 className="h-6 w-6" />*/}
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                {currentSentence && (  // Only render the progress bar if we have a sentence
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
                )}
                {/*<div className="flex-1 h-2 bg-gray-300 dark:bg-gray-700 rounded">
                  <input type="range" min="0" max="100" value={progress} onChange={(e) => handleSeek(parseInt(e.target.value))} />
                </div>*/}
                <audio ref={audioRef} className="hidden" />
              </div>
            </div>

            {/* Sentence words */}
            <div className="flex flex-wrap gap-2 mb-4">
              {currentSentence?.words.map((word, index) => (
                word.askable ? (
                  <div key={index} className="flex flex-col items-center">
                    <Input
                      className={`w-24 ${
                        currentSentence?.answered 
                          ? word.user_word === word.word 
                            ? 'border-green-500 text-green-500' 
                            : 'border-red-500 text-red-500'
                          : ''
                      }`}
                      placeholder="type..."
                      value={word.user_word}
                      onChange={(e) => handleWordChange(index, e.target.value)}
                      disabled={currentSentence?.answered}
                    />
                    {word.wrong && (
                      <span className="text-sm text-red-500 mt-1">
                        {word.word}
                      </span>
                    )}
                  </div>
                ) : (
                  <span key={index} className="py-2">
                    {word.word}
                  </span>
                )
              ))}
            </div>

            {/* Verification Button */}
            <div className="flex flex-col items-center gap-4 mb-6">
              <Button 
                onClick={checkSentence}
                className="w-full max-w-xs"
                variant="default"
                disabled={currentSentence?.answered}
              >
                Check Answer
              </Button>
              
            </div>

            {/* Navigation Section */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {totalSentences}
                </span>
                {currentPage !== 1 && (
                  <Button
                    onClick={() => {
                      setCurrentPage(prev => prev - 1);
                    }}
                  >
                    Previous
                  </Button>
                )}
                <Button
                  onClick={() => {
                    if (currentPage === totalSentences) {
                      // Handle submission
                      console.log('Submit listening exercise');
                      if (listeningData?.id) {
                        closeListening(listeningData.id, listeningData);
                        // Show toast
                        toast({
                          title: 'Listening exercise submitted',
                          description: 'Your listening exercise has been submitted',
                        })
                        setGameState('initial');
                      }
                    } else {
                      setCurrentPage(prev => prev + 1);
                    }
                  }}
                >
                  {currentPage === totalSentences ? 'Submit' : 'Next Page'}
                </Button>
              </div>
            </div>
              
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
          <CardTitle className="text-2xl font-bold text-black dark:text-white">
            Complete the sentences
          </CardTitle>
          <div className="flex space-x-2">
            <Button size="icon" aria-label="Move chat window">
              <Move className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className='mt-4'>
          { renderContent() }
        </CardContent>
      </Card>
      </div>
      </ResizableBox>
      </Draggable>
    </div>
  );
};

export default Listening;