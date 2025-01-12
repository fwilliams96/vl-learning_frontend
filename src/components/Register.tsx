// src/components/Login.tsx
import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, FacebookAuthProvider, updateProfile } from "firebase/auth";
import { Card, CardHeader, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, Facebook, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Register: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const auth = getAuth();

  const handleRegister = async () => {
    try {
      setError("");
      
      // Validaciones
      if (!email || !password) {
        setError("El correo y la contraseña son obligatorios");
        return;
      }
  
      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        return;
      }
  
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Solo actualizar el nombre si se proporcionó uno
      if (name.trim()) {
        await updateProfile(userCredential.user, {
          displayName: name.trim()
        });
      }
      
      console.log("Usuario registrado:", userCredential.user);
    } catch (error: any) {
      // Mejorar los mensajes de error
      if (error.code === 'auth/email-already-in-use') {
        setError('Este correo electrónico ya está registrado');
      } else if (error.code === 'auth/invalid-email') {
        setError('El correo electrónico no es válido');
      } else if (error.code === 'auth/weak-password') {
        setError('La contraseña es demasiado débil');
      } else {
        setError(error.message);
      }
    }
  };

  const handleFacebookRegister = async () => {
    const provider = new FacebookAuthProvider();
    try {
      setError("");
      const result = await signInWithPopup(auth, provider);
      console.log("Usuario registrado con Facebook:", result.user);
    } catch (error: any) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        setError('Ya existe una cuenta con este email. Intenta otro método de inicio de sesión.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        setError('Se cerró la ventana de Facebook. Por favor, intenta nuevamente.');
      } else {
        setError('Error al registrarse con Facebook. Por favor, intenta nuevamente.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[350px]">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Crear cuenta</h2>
          <CardDescription className="text-center">
            Regístrate para comenzar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <div className="relative">
              <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

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
            onClick={handleRegister}
            size="lg"
          >
            Crear cuenta
          </Button>

          <div className="relative w-full">
            <Separator className="my-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-2 text-muted-foreground text-sm">
                O continúa con
              </span>
            </div>
          </div>

          <Button 
            variant="outline"
            className="w-full flex items-center gap-2" 
            onClick={handleFacebookRegister}
            size="lg"
          >
            <Facebook className="h-4 w-4 text-blue-600" />
            Registrarse con Facebook
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;