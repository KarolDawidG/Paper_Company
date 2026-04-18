import axios from "axios";
import { decodeJwt } from "jose";
import { base_URL } from "../components/utils/links";

export const refreshAccessToken = async () => {
  try {
    const idUser = localStorage.getItem("idUser");
    const refreshToken = localStorage.getItem("refreshToken");

    // 27.2.1: Frontend wysyła teraz idUser i refreshToken, zgodnie z nowym kontraktem backendu.
    if (!idUser || !refreshToken) {
      return null;
    }

    const response = await axios.post(`${base_URL}auth/refresh`, {
      idUser,
      refreshToken,
    });

    if (response.data.token) {
      const newAccessToken = response.data.token;
      const newRefreshToken = response.data.refreshToken;

      // 27.2.2: Po refreshu aktualizujemy lokalny stan sesji, a nie tylko sam access token.
      localStorage.setItem("token", newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      const decodedToken: any = decodeJwt(newAccessToken);
      if (decodedToken?.role) {
        localStorage.setItem("role", decodedToken.role);
      }

      return newAccessToken;
    }
  } catch (error) {
    console.error("Błąd przy odświeżaniu tokena:", error);

    // 27.2.3: Czyścimy lokalną sesję, gdy refresh się nie powiedzie, żeby UI nie trzymał martwego stanu.
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("idUser");
    return null;
  }
};
