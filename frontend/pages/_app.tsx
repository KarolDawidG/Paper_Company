import { Sidebars } from '@/app/components/Sidebars';
import type { AppProps } from 'next/app';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '@/app/theme/theme';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isSidebarPage = !router.pathname.startsWith('/click-link');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      {isSidebarPage ? (
        <Sidebars>
          <Component {...pageProps} />
        </Sidebars>
      ) : (
        <Component {...pageProps} />
      )}
    </ThemeProvider>
  );
}

export default MyApp;
