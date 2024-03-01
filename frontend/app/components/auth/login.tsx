import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { decodeJwt } from 'jose';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
    
      const response = await axios.post('http://localhost:3001/auth', { 
        username, 
        password });

      if (response && response.status === 200) {
        const token = response.data.token;
        const refreshToken = response.data.refreshToken;
        const idUser = response.data.idUser;

        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("idUser", idUser);

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const decodedToken: any = decodeJwt(token);
        const userRole = decodedToken.role;
        localStorage.setItem("role", userRole);


      router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Login:</label>
        <input
          id="login"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;
