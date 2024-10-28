import React, { useState, useRef } from 'react';
import Draggable, { DraggableEvent } from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import ChatWindow from './ChatWindow';
import './DraggableChat.css';

const ChatPage: React.FC = () => {
    const [chatPosition, setChatPosition] = useState({ x: 0, y: 0 });
    const [chatSize, setChatSize] = useState({ width: 300, height: 400 });
    const chatRef = useRef<HTMLDivElement>(null);
  
    const handleDrag = (e: DraggableEvent, data: { x: number; y: number }) => {
      setChatPosition({ x: data.x, y: data.y });
    };
  
    const handleResize = (e: React.SyntheticEvent, { size }: { size: { width: number; height: number } }) => {
      setChatSize({ width: size.width, height: size.height });
    };
  
    return (
        <div className="chat-page">
            <Draggable
                bounds="parent"
                handle=".chat-handle"
                defaultPosition={{ x: 0, y: window.innerHeight - chatSize.height }}
                position={chatPosition}
                onDrag={handleDrag}
                >
                <ResizableBox
                    className="chat-box"
                    width={chatSize.width}
                    height={chatSize.height}
                    onResize={handleResize}
                    minConstraints={[200, 200]}
                    maxConstraints={[500, 700]}
                >
                    <div
                        ref={chatRef}
                        className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                        style={{ width: chatSize.width, height: chatSize.height }}
                    >
                        <ChatWindow />
                    </div>
                </ResizableBox>
            </Draggable>
      </div>
    );
  };
  
  export default ChatPage;