const MESSAGES = {
  // Successful operations
  SERVER_STARTED: "Server Started correctly on port",
  SUCCESSFUL_OPERATION: "Operation successful. Congratulations!",
  SUCCESSFUL_LOGOUT: "Logout completed successfully. Farewell!",
  SUCCESSFUL_RESET: "Password has been reset successfully.",
  SUCCESSFUL_SIGN_UP:
    "Welcome aboard! You are now officially part of our community.",
  EMAIL_SUCCESS:
    "If the email address exists, a password reset link will be sent.",

  // Errors and validation messages
  INCORRECT_USERNAME: "The username should contain at least 6 characters.",
  ERROR_GET_CONNECTION:
    "An unexpected glitch occurred while attempting to connect.",
  SESSION_EXPIRED:
    "Your session has expired. Please log in again to continue your adventure.",
  USER_NOT_LOGGED_IN: "Hold up! The user is not logged in.",
  UNPROCESSABLE_ENTITY:
    "Invalid login details. Please ensure you have entered the correct login and password.",
  INVALID_EMAIL: "Invalid email address. Please provide a valid one.",
  INVALID_PASS:
    "The password should contain at least 8 and max 16 characters, one capital letter and a number!",
  EMAIL_USER_EXIST:
    "The provided email and username are already in use. Please choose different ones.",
  EMAIL_EXIST: "The email address is already taken. Please choose another one.",
  USER_EXIST: "The username already exists. Please select a different one.",
  SQL_INJECTION_ALERT:
    "Attempted SQL Injection attack detected! Security alert raised.",
  INTERNET_DISCONNECTED:
    "You seem to have lost internet connection. Please check your connectivity.",

  // Server errors and permissions
  INVALID_REQUEST: "Invalid request to the server.",
  SERVER_ERROR:
    "An unknown server error occurred. Please contact your admin for assistance.",
  UNKNOW_ERROR: "An unknown error occurred.",
  FORBIDDEN:
    "Access to this resource is restricted. You do not have the necessary permissions.",
  CAPTCHA_ERROR: "Error verifying reCAPTCHA",

  // Authorization
  JWT_ERROR: "JsonWebTokenError: Invalid signature. Authorization failed.",
  NO_REFRESH_TOKEN: "Refresh token missing.",
  INVALID_REFRESH_TOKEN: "Invalid refresh token provided.",
  AUTHORIZATION_LVL: "Authorization level: ",
};

module.exports = MESSAGES;
