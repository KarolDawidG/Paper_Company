interface Urls {
  MAIN_URL: string;
  REGISTER_URL: string;
  URL_LOGIN: string;
  RESET_URL: string;
  RECAPTCHA: string;
}

const URL: Urls = {
  MAIN_URL: 'http://localhost:3000',
  REGISTER_URL: "http://localhost:3001/register/",
  URL_LOGIN: "http://localhost:3000",
  RESET_URL: "http://localhost:3000/reset/",
  RECAPTCHA: "https://www.google.com/recaptcha/api/siteverify?secret=",
};

export default URL;
