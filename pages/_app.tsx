import { ColorProvider } from '../context/ColorContext';
import type { AppProps } from 'next/app';
import { UserProvider } from '../context/UserContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ColorProvider>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ColorProvider>
  );
}
