import { AppProps } from 'next/app';
import { theme } from '@enterslash/enterus/utils';
import { ConfigProvider } from '@enterslash/react-ui';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/index.css';
import Login from './auth/login';
import { useEffect, useState } from 'react';
import { getLocal } from '@enterslash/utils';
import { useAuthStore } from '../store/authStore';
import icon from '../assets/favicon.png';

function CustomApp({ Component, pageProps }: AppProps) {
  const [isReady, setIsReady] = useState(false);
  const { isAuthenticated, setAuthenticated } = useAuthStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsReady(true);
      const token = getLocal('token');
      if (token) {
        setAuthenticated(true);
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>Welcome to admin!</title>
        <link rel="shortcut icon" href={icon.src} />
      </Head>
      <main className="app">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: theme.primary,
            },
          }}
        >
          <ToastContainer />
          {isReady ? (
            !isAuthenticated ? (
              <Login />
            ) : (
              <Component {...pageProps} />
            )
          ) : null}
        </ConfigProvider>
      </main>
    </>
  );
}

export default CustomApp;
