import type { AppProps } from 'next/app';
import NavBar from '../components/nav-bar/NavBar.component';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <NavBar />
      <Component {...pageProps} />
    </>
  );
};

export default App;
