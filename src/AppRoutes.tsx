import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Experience } from './components/Experience';
import { Home } from './components/Home';
import Chat from './components/Chat';
import Description from './components/Description';
import Listening from './components/Listening';
import RolePlay from './components/RolePlay';
import Login from './components/Login';
import Register from './components/Register';
import { PrivateRoute } from './components/PrivateRoute';
import { ChatProvider } from './contexts/ChatContext';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route 
        path="/chat" 
        element={
          <PrivateRoute>
            <ChatProvider>
              <Experience><Chat /></Experience>
            </ChatProvider>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/description" 
        element={
          <PrivateRoute>
            <Experience><Description /></Experience>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/listening" 
        element={
          <PrivateRoute>
            <Experience><Listening /></Experience>
          </PrivateRoute>
        } 
      />
      <Route 
        path="/role-play" 
        element={
          <PrivateRoute>
            <Experience><RolePlay /></Experience>
          </PrivateRoute>
        } 
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}