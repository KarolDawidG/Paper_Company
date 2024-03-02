import { Sidebars } from '@/app/components/Sidebars';
import type { AppProps } from 'next/app';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from '@/app/theme/theme';
import { useRouter } from 'next/router';
import Footer from '@/app/components/Footer';
import TopBar from '@/app/components/TopBar';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isSidebarPage = !router.pathname.startsWith('/click-link');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      {isSidebarPage ? (
        <Sidebars>
          <Box display="flex" flexDirection="column" minHeight="100vh">
            <TopBar />
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
