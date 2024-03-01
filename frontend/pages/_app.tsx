import { Sidebars } from '@/app/components/Sidebars';
import '../app/globals.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Sidebars>
      <Component {...pageProps} />
    </Sidebars>
  )
}

export default MyApp;
