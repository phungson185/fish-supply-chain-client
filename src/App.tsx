import { AppContainer } from 'containers';
import { default as jwtDecode } from 'jwt-decode';
import { PrivateLayout } from 'layouts';
import { useEffect, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { store } from 'reducers';
import { signIn } from 'reducers/profile';
import { walletService } from 'services';

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const profile = JSON.parse(localStorage.getItem('profile')!);
      jwtDecode(profile.accessToken);
      store.dispatch(signIn(profile));
      walletService.connectProvider();
    } catch {
    } finally {
      setIsReady(true);
    }
  }, []);

  return (
    <ReduxProvider store={store}>
      <AppContainer>
        <BrowserRouter>
          {isReady && (
            <Routes>
              <Route path='/*' element={<PrivateLayout />} />
            </Routes>
          )}
        </BrowserRouter>
      </AppContainer>
    </ReduxProvider>
  );
};

export default App;
