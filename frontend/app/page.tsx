"use client";

import React, { useState } from 'react';
import LoginModal from './components/auth/LoginModal';

export default function Home() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  return (
<main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
  <div className="bg-white p-10 rounded-lg shadow-xl border border-gray-300">
    <h1 className="text-3xl font-semibold text-gray-700 mb-4 retro-font">Paper Company</h1>
    <p className="text-xl text-gray-600">Centrala logowania</p>
    <button
      onClick={() => setLoginModalOpen(true)}
      className="mt-6 px-6 py-2 bg-green-500 text-white font-medium rounded-lg shadow hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring focus:ring-green-300 transition duration-150 ease-in-out"
    >
      Logowanie
    </button>
  </div>
  <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} />
</main>

  );
}
