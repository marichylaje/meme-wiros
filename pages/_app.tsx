import { ColorProvider } from '../context/ColorContext';
import type { AppProps } from 'next/app';
import '../styles/global.css';
import { Toaster } from 'react-hot-toast';
import { ModalProvider } from '../context/ModalContext';
import { SessionProvider } from 'next-auth/react';

export default function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ColorProvider>
          <ModalProvider>
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            <Component {...pageProps} />
          </ModalProvider>
      </ColorProvider>
    </SessionProvider>

  );
}
