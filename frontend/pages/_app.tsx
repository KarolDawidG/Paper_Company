import React, { useEffect, useMemo, useState } from 'react';
import { Sidebars } from '@/app/components/layout/Sidebars';
import type { AppProps } from 'next/app';
import { ThemeProvider, CssBaseline, Box, useMediaQuery } from '@mui/material';
import {lightTheme, darkTheme} from '@/app/theme/theme';
import { useRouter } from 'next/router';
import Footer from '@/app/components/layout/Footer';
import TopBar from '@/app/components/layout/TopBar';
import { ToastContainer } from "react-toastify";
import useTranslation from '../app/components/language/useTranslation';
import "@uploadthing/react/styles.css";
import { ImageProvider } from '@/app/components/utils/context/ImageContext';

function MyApp({ Component, pageProps }: AppProps) {
  const [locale, setLocale] = useState('en');
  const [mode, setMode] = useState<'light' | 'dark'>();
  const t = useTranslation(locale);
  const router = useRouter();
  const isSidebarPage = !router.pathname.startsWith('/click-link');
  const isResetPasswordPage = router.asPath.startsWith('/reset/');
  const shouldDisplaySidebarLayout = isSidebarPage && !isResetPasswordPage;
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {noSsr: true});
  const theme = useMemo(()=>(mode === 'dark' ? darkTheme : lightTheme), [mode],);

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || 'en';
    const savedTheme: any = localStorage.getItem('theme') || (prefersDarkMode ? 'light' : 'dark');
    setMode(savedTheme);
    setLocale(savedLocale);
  }, [prefersDarkMode]);

  useEffect(() => {
    if (mode) {
      localStorage.setItem('theme', mode);
    }
  }, [mode]);

  

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
      {shouldDisplaySidebarLayout ? (
        <Sidebars>
          <Box display="flex" flexDirection="column" minHeight="100vh">
            <TopBar toggleTheme={toggleTheme} mode={mode} setLocale={setLocale}/>
            <Box component='main' flexGrow={1}>
              <ImageProvider>
              <Component {...pageProps} locale={locale} />
              </ImageProvider>
            </Box>
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
