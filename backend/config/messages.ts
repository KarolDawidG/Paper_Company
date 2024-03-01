const MESSAGES: Record<string, string> = {
  // Successful operations
  SERVER_STARTED: "Serwer pomyślnie uruchomiony na porcie",
  SUCCESSFUL_OPERATION: "Operacja zakończona sukcesem.",
  SUCCESSFUL_LOGOUT: "Wylogowanie zakończone powodzeniem.",
  SUCCESSFUL_RESET: "Hasło zostało pomyślnie zresetowane.",
  SUCCESSFUL_SIGN_UP: "Rejestracja zakończona sukcesem. Witamy w naszej społeczności.",
  EMAIL_SUCCESS: "Link do resetowania hasła został wysłany na podany adres email, o ile znajduje się on w naszych rekordach.",

  // Errors and validation messages
  INCORRECT_USERNAME: "Nazwa użytkownika musi zawierać przynajmniej 6 znaków.",
  ERROR_GET_CONNECTION: "Napotkano błąd połączenia.",
  SESSION_EXPIRED: "Sesja wygasła. Proszę zalogować się ponownie.",
  USER_NOT_LOGGED_IN: "Działanie odrzucone. Wymagana autentykacja użytkownika.",
  UNPROCESSABLE_ENTITY: "Nieprawidłowe dane logowania. Proszę sprawdzić swoje dane logowania.",
  INVALID_EMAIL: "Adres email jest nieprawidłowy. Proszę podać prawidłowy adres email.",
  INVALID_PASS: "Hasło musi mieć od 8 do 16 znaków, zawierać jedną wielką literę i cyfrę.",
  EMAIL_USER_EXIST: "Email i nazwa użytkownika już zarejestrowane. Proszę wybrać inne dane logowania.",
  EMAIL_EXIST: "Adres email jest już w użyciu. Proszę wybrać inny.",
  USER_EXIST: "Nazwa użytkownika jest już zajęta. Proszę wybrać inną.",
  SQL_INJECTION_ALERT: "Ostrzeżenie bezpieczeństwa: Wykryto próbę ataku SQL Injection.",
  INTERNET_DISCONNECTED: "Utracono połączenie z internetem. Proszę sprawdzić ustawienia sieciowe.",

  // Server errors and permissions
  INVALID_REQUEST: "Żądanie jest nieprawidłowe.",
  SERVER_ERROR: "Napotkano błąd serwera. Proszę skontaktować się z administratorem w celu uzyskania wsparcia.",
  UNKNOW_ERROR: "Wystąpił nieznany błąd.",
  FORBIDDEN: "Dostęp zabroniony. Niewystarczające uprawnienia do żądanego zasobu.",
  CAPTCHA_ERROR: "Nie udało się zweryfikować reCAPTCHA.",

  // Authorization
  JWT_ERROR: "Autoryzacja nie powiodła się z powodu nieprawidłowego podpisu JsonWebToken.",
  NO_REFRESH_TOKEN: "Brak tokenu odświeżania.",
  INVALID_REFRESH_TOKEN: "Token odświeżania jest nieprawidłowy.",
  AUTHORIZATION_LVL: "Poziom autoryzacji: ",
};

export default MESSAGES;