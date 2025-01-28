import { Canvas } from "@react-three/fiber";
import { Leva } from "leva"
import { Loader } from "@react-three/drei";
import "./Experience.css";
import {
  CameraControls,
  ContactShadows,
  Environment,
  Text,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { Avatar } from "./Avatar";
import { useChat } from "@/contexts/ChatContext";

const Dots = ({ position_x, position_y }: { position_x: number, position_y: number }) => {
  const { loading } = useChat();
  const [loadingText, setLoadingText] = useState("...");

  useEffect(() => {
    console.log("loading", loading);
    let interval: NodeJS.Timeout;

    if (loading) {
      // Add the first dot immediately
      setLoadingText(".");
      // Then add the next dots every 300ms
      interval = setInterval(() => {
        setLoadingText(prev => prev.length >= 3 ? "." : prev + ".");
      }, 300);
    } else {
      setLoadingText("");
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);
  
  if (!loading) return null;

  return (
    <group position={[position_x, position_y, 0]}>
      <Text fontSize={0.14} anchorX="left" anchorY="bottom">
        {loadingText}
        <meshBasicMaterial attach="material" color="white" />
      </Text>
    </group>
  );
};
export function Experience({ children }: { children: React.ReactNode }) {
  
  const cameraControls = useRef<CameraControls>(null);
  const { cameraZoomed } = useChat();
  const [controlsEnabled, setControlsEnabled] = useState(true);

  useEffect(() => {
    cameraControls?.current?.setLookAt(0, 2, 5, 0, 1.5, 0);
  }, []);

  useEffect(() => {
    if (cameraZoomed) {
      //cameraControls?.current?.setLookAt(0, 1.5, 1.5, 0, 1.5, 0, true);
      cameraControls?.current?.setLookAt(0, 1.5, 3, -1, 1.2, 0, true)
      .then(() => {
        // Desactiva los controles de cámara después de enfocar
        //setControlsEnabled(false);
      });
    } else {
      //cameraControls?.current?.setLookAt(0, 2.2, 5, 0, 1.0, 0, true)
      cameraControls?.current?.setLookAt(0, 1.5, 3, -1, 1.2, 0, true)
      .then(() => {
        // Desactiva los controles de cámara después de enfocar
        //setControlsEnabled(false);
      });
    }
  }, [cameraZoomed]);

  return (
    <div className="w-full h-screen relative">
        <Loader />
        <Leva hidden={true} />
        {/*<Canvas shadows camera={{ position: [0, 0, 0.0001], fov: 30 }}>*/}
        <Canvas camera={{ position: [0, 0, 1], fov: 30 }} >
          <CameraControls ref={cameraControls} enabled={controlsEnabled} />
          <Environment preset="sunset" />
            <Dots position_y={1.86} position_x={-0.08} />
          <Avatar/>
          <ContactShadows opacity={0.7} />
        </Canvas>
        {/*<ChatWindow />*/}
        {children}
    </div>
  );

}