import { Canvas } from "@react-three/fiber";
import { Leva } from "leva"
import { Loader } from "@react-three/drei";
import "./Chat.css";
import DraggableChat from "./DraggableChat";
import { Experience } from "./Experience";
import ChatWindow from "./ChatWindow";

export function Chat() {

  return (
    <div className="w-full h-screen relative">
        <Loader />
        <Leva hidden={true} />
        <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
          <Experience />
        </Canvas>
        <ChatWindow />
    </div>
  );

    /*return (
      <div className={`flex flex-col h-screen`}>
        <div className="app-container">
          <div className="canvas-container">
            <Loader />
            <Leva hidden={true} />
            <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
              <Experience />
            </Canvas>
          </div>
          <div className="chat-container">
            <ChatComponent hidden={false} />
          </div>
      </div>
      </div>
    )*/
}