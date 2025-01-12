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
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Experience><Chat /></Experience>} />
      <Route path="/description" element={<Experience><Description /></Experience>} />
      <Route path="/listening" element={<Experience><Listening /></Experience>} />
      <Route path="/role-play" element={<Experience><RolePlay /></Experience>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}