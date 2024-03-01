import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#5E97F3', // Niebieski kolor, dobrze pasuje do nowoczesnych interfejsów
    },
    secondary: {
      main: '#FFC107', // Amberski dla akcentów
    },
    background: {
      default: '#f4f5f7', // Jasne tło, dla subtelnego wyglądu
      paper: '#ffffff',
    },
    text: {
      primary: '#333333', // Ciemnoszary tekst dla lepszej czytelności
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    button: {
      textTransform: 'none', // Wyłącza automatyczne wielkie litery na przyciskach
    },
    h1: {
      fontSize: '2.2rem',
    },
    h2: {
      fontSize: '1.8rem',
    },
    // Dalsze dostosowanie typografii...
  },
  shape: {
    borderRadius: 8, // Zaokrąglenie rogów dla komponentów
  },
  // Możesz także dostosować inne aspekty motywu, takie jak przejścia, cienie, itp.
});

export default theme;
