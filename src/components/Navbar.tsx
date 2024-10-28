import { Link } from 'react-router-dom';
import { Toggle } from "@/components/ui/toggle"
import { Home, LogOut, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/ThemeContext";
export function Navbar() {
  
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <nav className="bg-primary text-primary-foreground dark:bg-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">VLearning</Link>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/">
              <Home className="mr-2 h-5 w-5" />
              Home
            </Link>
          </Button>
          <Toggle aria-label="Toggle dark mode" pressed={isDarkMode} onPressedChange={toggleDarkMode}>
            {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Toggle>
          <Button variant="ghost">
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}