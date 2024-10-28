import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Chat } from './components/Chat';
import { Home } from './components/Home';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}