import React, { useEffect, useMemo, useState } from 'react';
import { Sidebars } from '@/app/components/Sidebars';
import type { AppProps } from 'next/app';
import { ThemeProvider, CssBaseline, Box, useMediaQuery } from '@mui/material';
import {lightTheme, darkTheme} from '@/app/theme/theme';
import { useRouter } from 'next/router';
import Footer from '@/app/components/Footer';
import TopBar from '@/app/components/TopBar';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isSidebarPage = !router.pathname.startsWith('/click-link');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {noSsr: true});
  const [mode, setMode] = useState<'light' | 'dark'>();

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


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      {isSidebarPage ? (
        <Sidebars>
          <Box display="flex" flexDirection="column" minHeight="100vh">
            <TopBar toggleTheme={toggleTheme} mode={mode}/>
            <Box component='main' flexGrow={1}>
              <Component {...pageProps} />
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
