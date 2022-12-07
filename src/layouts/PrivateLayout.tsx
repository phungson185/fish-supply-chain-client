import { Button } from '@mui/material';
import { ScrollButton } from 'components';
import { AppHeader } from 'containers';
import { useNotification, useWindowSize } from 'hooks';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { getRoute } from 'routes';
import { walletService } from 'services';

const PrivateLayout = () => {
  useNotification();
  const { isMobile } = useWindowSize();
  const { isLoggedIn, role } = useSelector(profileSelector);
  const { enqueueSnackbar } = useSnackbar();
  const privateRoute = getRoute(role);
  return (
    <div className='App'>
      <main style={{ marginLeft: isMobile ? '0' : '280px' }}>
        <AppHeader />
        <div className='sm:px-6 px-4 py-4 pt-10'>
          {isLoggedIn ? (
            <Routes>
              {Object.values(privateRoute).map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
              <Route path='/*' element={<Navigate to={privateRoute.home.path} />} />
            </Routes>
          ) : (
            <div className='flex justify-center p-10'>
              <Button
                variant='contained'
                size='large'
                onClick={async () => {
                  const isSuccess = await walletService.connectWallet();
                  if (!isSuccess) enqueueSnackbar('The address does not exist in the system', { variant: 'error' });
                }}
              >
                Connect Wallet
              </Button>
            </div>
          )}
        </div>
        <ScrollButton />
      </main>
    </div>
  );
};

export default PrivateLayout;
