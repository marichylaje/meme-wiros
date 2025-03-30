// _app.tsx — limpio
import type { AppProps } from 'next/app'
import { ColorProvider } from '../context/ColorContext'
import { ModalProvider } from '../context/ModalContext'
import '../styles/global.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../context/AuthContext'
import { DesignProvider } from '../context/DesignContext'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <DesignProvider> {/* ⬅️ nuevo */}
        <ColorProvider>
          <ModalProvider>
            <Toaster position="top-right" />
            <Component {...pageProps} />
          </ModalProvider>
        </ColorProvider>
      </DesignProvider>
    </AuthProvider>
  )
}
