import axios from "axios";
import { base_URL } from "../components/utils/links";

export const refreshAccessToken = async () => {
  try {
    const idUser = localStorage.getItem("idUser");

    const response = await axios.post(`${base_URL}auth/refresh`, { idUser });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      return response.data.token;
    }
  } catch (error) {
    console.error("Błąd przy odświeżaniu tokena:", error);
    return null;
  }
};
