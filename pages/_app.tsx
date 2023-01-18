import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import NavBar from '../components/nav-bar/NavBar.component';
import store from '../redux/store';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <NavBar>
        <Component {...pageProps} />
      </NavBar>
    </Provider>
  );
};

export default App;
