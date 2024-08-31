const MESSAGES: Record<string, string> = {
  // Successful operations
  SERVER_STARTED: "Server successfully started on port",
  SUCCESSFUL_OPERATION: "Operation completed successfully.",
  SUCCESSFUL_LOGOUT: "Logout completed successfully.",
  SUCCESSFUL_RESET: "Password has been successfully reset.",
  SUCCESSFUL_SIGN_UP: "Registration completed successfully. Welcome to our community.",
  EMAIL_SUCCESS: "A password reset link has been sent to the provided email address, if it exists in our records.",

  // Errors and validation messages
  INCORRECT_USERNAME: "The username must be at least 6 characters long.",
  ERROR_GET_CONNECTION: "Encountered a connection error.",
  SESSION_EXPIRED: "Session expired. Please log in again.",
  USER_NOT_LOGGED_IN: "Action rejected. User authentication is required.",
  UNPROCESSABLE_ENTITY: "Invalid login credentials. Please check your login details.",
  INVALID_EMAIL: "The email address is invalid. Please provide a valid email address.",
  INVALID_PASS: "The password must be between 8 and 16 characters long, and include one uppercase letter and a digit.",
  EMAIL_USER_EXIST: "Email and username are already registered. Please choose different login credentials.",
  EMAIL_EXIST: "The email address is already in use. Please choose another.",
  USER_EXIST: "The username is already taken. Please choose another.",
  SQL_INJECTION_ALERT: "Security warning: SQL Injection attempt detected.",
  INTERNET_DISCONNECTED: "Internet connection lost. Please check your network settings.",
  EMAIL_NOT_FOUND: "E-mail not found.",
  MISSING_ID_USER: "Missing ID user",
  USER_NOT_FOUND: "User not found",

  // Server errors and permissions
  INVALID_REQUEST: "The request is invalid.",
  SERVER_ERROR: "Server encountered an error. Please contact the administrator for support.",
  UNKNOW_ERROR: "An unknown error occurred.",
  FORBIDDEN: "Access denied. Insufficient permissions for the requested resource.",
  CAPTCHA_ERROR: "Failed to verify reCAPTCHA.",
  NOT_FOUND: "Resource not found.",
  BAD_REQUEST: "Invalid request. Check the data and try again.",

  // Authorization
  JWT_ERROR: "Authorization failed due to an invalid JsonWebToken signature.",
  NO_REFRESH_TOKEN: "No refresh token provided.",
  INVALID_REFRESH_TOKEN: "The refresh token is invalid.",
  AUTHORIZATION_LVL: "Authorization level: ",
};

export default MESSAGES;
