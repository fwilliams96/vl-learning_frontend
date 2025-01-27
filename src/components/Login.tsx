// src/components/Login.tsx
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, Facebook } from "lucide-react"; // Iconos de Lucide
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const auth = getAuth();
  const { login } = useAuth();
  const navigate = useNavigate();

  // Manejar inicio de sesión con correo y contraseña
  const handleLogin = async () => {
    try {
      setError("");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuario autenticado con correo:", userCredential.user);
      const token = await userCredential.user.getIdToken();
      console.log("Token JWT:", token);
      login(token);
      navigate("/");
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Manejar inicio de sesión con Facebook
  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    try {
      setError("");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Usuario autenticado con Facebook:", user);

      // Opcional: Puedes guardar el token o mostrar información del usuario
      const token = await user.getIdToken();
      console.log("Token JWT:", token);
      login(token);
      navigate("/");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[350px]">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button 
            className="w-full" 
            onClick={handleLogin}
            size="lg"
          >
            Iniciar Sesión
          </Button>

          <Button 
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={handleFacebookLogin}
            size="lg"
          >
            <Facebook className="h-4 w-4" />
            Iniciar sesión con Facebook
          </Button>
          <div className="w-full text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            ¿No tienes una cuenta?{" "}
            <Link 
              to="/register" 
              className="text-primary hover:underline font-medium"
            >
              Regístrate aquí
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
