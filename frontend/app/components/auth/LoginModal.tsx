import React from 'react';
import Login from './login';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
  }

  
  const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center ${isOpen ? 'animate-fadeIn' : 'animate-fadeOut'}`}>
      <div className="bg-white p-4 rounded">
        <button onClick={onClose}>Close</button>
        <Login />
      </div>
    </div>
  );
};

export default LoginModal;
