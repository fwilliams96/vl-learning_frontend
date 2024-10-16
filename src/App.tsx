import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import ChatComponent from "./components/ChatComponent";
import { Home, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "./components/ui/button";
import { useState } from "react";
import { Toggle } from "@radix-ui/react-toggle";

function App() {
  /*return (
    <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
      <color attach="background" args={["#ececec"]} />
      <Experience />
    </Canvas>
  );*/
  /*return (
    <div className="app-container">
      <div className="canvas-container">
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
          <color attach="background" args={["#ececec"]} />
          <Experience />
        </Canvas>
      </div>

      <div className="chat-container">
        <ChatComponent />
      </div>
    </div>
  );*/
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'dark' : ''}`}>
      <nav className="flex justify-between items-center p-4 bg-primary text-primary-foreground dark:bg-gray-800 dark:text-gray-200">
        <Button variant="ghost" className="text-lg">
          <Home className="mr-2 h-5 w-5" />
          VLearning
        </Button>
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center mr-2">
            <div className="cat-avatar w-full h-full">
              <div className="ear ear-left"></div>
              <div className="ear ear-right"></div>
              <div className="face">
                <div className="eye eye-left"></div>
                <div className="eye eye-right"></div>
                <div className="nose"></div>
                <div className="mouth"></div>
              </div>
            </div>
          </div>
          <Toggle aria-label="Toggle dark mode" pressed={isDarkMode} onPressedChange={toggleDarkMode}>
            {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Toggle>
          <Button variant="ghost">
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </nav>
      <div className="app-container">
        <div className="canvas-container">
          <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
            <color attach="background" args={["#ececec"]} />
            <Experience />
          </Canvas>
        </div>

        <div className="chat-container">
          <ChatComponent />
        </div>
      </div>
    </div>
  );
}

export default App;
