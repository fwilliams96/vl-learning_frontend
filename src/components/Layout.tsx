import { Navbar } from './Navbar'
import { ReactNode } from 'react';
import { Toaster } from './ui/toaster';
interface LayoutProps {
    children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
        <Toaster />
      </main>
      <footer className="bg-gray-100 dark:bg-gray-800 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          © 2024 VLearning. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}