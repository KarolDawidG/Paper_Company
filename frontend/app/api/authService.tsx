import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.log('Brak refreshTokena w localStorage');
      return null;
    }

    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      return response.data.token;
    }
  } catch (error) {
    console.error('Błąd przy odświeżaniu tokena:', error);
    return null;
  }
};
