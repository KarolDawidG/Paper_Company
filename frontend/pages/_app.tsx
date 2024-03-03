import React, { useEffect, useMemo, useState } from 'react';
import { Sidebars } from '@/app/components/Sidebars';
import type { AppProps } from 'next/app';
import { ThemeProvider, CssBaseline, Box, useMediaQuery } from '@mui/material';
import {lightTheme, darkTheme} from '@/app/theme/theme';
import { useRouter } from 'next/router';
import Footer from '@/app/components/Footer';
import TopBar from '@/app/components/TopBar';
import { ToastContainer } from "react-toastify";
import useTranslation from '../app/components/useTranslation';

function MyApp({ Component, pageProps }: AppProps) {
  const [locale, setLocale] = useState('en');
  const t = useTranslation(locale);
  const router = useRouter();
  const isSidebarPage = !router.pathname.startsWith('/click-link');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {noSsr: true});
  const [mode, setMode] = useState<'light' | 'dark'>();

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || 'en';
    setLocale(savedLocale);
  }, []);

const changeLanguage = (newLocale:string) => {
  localStorage.setItem('locale', newLocale);
  setLocale(newLocale);
};

  useEffect(() => {
    const savedTheme: any = localStorage.getItem('theme') || (prefersDarkMode ? 'light' : 'dark');
    setMode(savedTheme);
  }, [prefersDarkMode]);

  useEffect(() => {
    if (mode) {
      localStorage.setItem('theme', mode);
    }
  }, [mode]);

  const theme = useMemo(()=>(mode === 'dark' ? darkTheme : lightTheme), [mode],);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  if (!mode) {
    return <div>Loading...</div>; // TODO: dodać jakikolwiek loader
  }

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer limit={3}/>
      <CssBaseline/>
      {isSidebarPage ? (
        <Sidebars>
          <Box display="flex" flexDirection="column" minHeight="100vh">
            <TopBar toggleTheme={toggleTheme} mode={mode}/>
            <Box component='main' flexGrow={1}>
              <Component {...pageProps} />
            </Box>
              <button onClick={() => changeLanguage('en')}>English</button>
              <button onClick={() => changeLanguage('pl')}>Polski</button>
            <Footer />
          </Box>
        </Sidebars>
      ) : (
        <Component {...pageProps} />
      )}
    </ThemeProvider>
  );
}

export default MyApp;
