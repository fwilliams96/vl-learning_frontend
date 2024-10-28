import {
  CameraControls,
  ContactShadows,
  Environment,
  Text,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { Avatar } from "./Avatar";

const Dots = ({ position_x, position_y }: { position_x: number, position_y: number }) => {
  const { loading } = useChat();
  const [loadingText, setLoadingText] = useState("...");
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingText((loadingText) => {
          if (loadingText.length > 2) {
            return ".";
          }
          return loadingText + ".";
        });
      }, 800);
      return () => clearInterval(interval);
    } else {
      setLoadingText("");
    }
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

export const Experience = () => {

  const cameraControls = useRef<CameraControls>(null);
  const { cameraZoomed } = useChat();
  const [controlsEnabled, setControlsEnabled] = useState(true);

  useEffect(() => {
    cameraControls?.current?.setLookAt(0, 2, 5, 0, 1.5, 0);
  }, []);

  useEffect(() => {
    if (cameraZoomed) {
      //cameraControls?.current?.setLookAt(0, 1.5, 1.5, 0, 1.5, 0, true);
      cameraControls?.current?.setLookAt(0, 1.5, 3, 0, 1.2, 0, true)
      .then(() => {
        // Desactiva los controles de cámara después de enfocar
        setControlsEnabled(false);
      });
    } else {
      cameraControls?.current?.setLookAt(0, 2.2, 5, 0, 1.0, 0, true)
      .then(() => {
        // Desactiva los controles de cámara después de enfocar
        setControlsEnabled(false);
      });
    }
  }, [cameraZoomed]);

  return (
    <>
      <CameraControls ref={cameraControls} enabled={controlsEnabled}/>
      <Environment preset="sunset" />
      <Suspense>
        <Dots position_y={1.86} position_x={-0.08} />
      </Suspense>
      <Avatar/>
      <ContactShadows opacity={0.7} />
    </>
  );
    
  /*return (
    <>
      <CameraControls ref={cameraControls} />
      <Avatar/>
      <Environment preset="sunset" />
      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
      </mesh>
    </>
  );*/


};
