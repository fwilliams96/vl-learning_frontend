import { Link, useNavigate } from 'react-router-dom';
import { Toggle } from "@/components/ui/toggle"
import { Home, LogOut, Moon, Sun, LogIn, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
          {isAuthenticated ? (
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative">
                <User className="h-5 w-5" />
                <span className="ml-2">Mi Cuenta</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/account')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Mi Cuenta</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          ) : (
            <Button variant="ghost" asChild>
              <Link to="/login">
                <LogIn className="mr-2 h-5 w-5" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}