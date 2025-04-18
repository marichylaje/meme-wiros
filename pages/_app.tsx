// pages/_app.tsx
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ColorProvider } from '../context/ColorContext'
import { ModalProvider } from '../context/ModalContext'
import '../styles/global.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../context/AuthContext'
import { DesignProvider } from '../context/DesignContext'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Diseña tu vaso</title>
        <link rel="icon" href="/logo.png" type="image/png" />
      </Head>

      <AuthProvider>
        <DesignProvider>
          <ColorProvider>
            <ModalProvider>
              <Toaster position="top-right" />
              <Component {...pageProps} />
            </ModalProvider>
          </ColorProvider>
        </DesignProvider>
      </AuthProvider>
    </>
  )
}
