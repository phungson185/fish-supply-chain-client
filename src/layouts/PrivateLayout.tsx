import { Button } from '@mui/material';
import { ScrollButton } from 'components';
import { AppHeader } from 'containers';
import { useNotification, useWindowSize } from 'hooks';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { saveSystem } from 'reducers/system';
import { getRoute } from 'routes';
import { systemService, walletService } from 'services';

const PrivateLayout = () => {
  useNotification();
  const { isMobile } = useWindowSize();
  const dispatch = useDispatch();
  const { isLoggedIn, role } = useSelector(profileSelector);
  const privateRoute = getRoute(role);

  useQuery('systemService.getSystemConfig', () => systemService.getSystemConfig(), {
    onSuccess: (data) => {
      dispatch(saveSystem(data));
    },
    enabled: isLoggedIn,
  });

  return (
    <div className='App'>
      <main style={{ marginLeft: isMobile ? '0' : '280px' }}>
        <AppHeader />
        <div className='sm:px-6 px-4 py-4 pt-4'>
          {isLoggedIn ? (
            <Routes>
              {Object.values(privateRoute).map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
              <Route path='/*' element={<Navigate to={privateRoute.home.path} />} />
            </Routes>
          ) : (
            <div className='flex justify-center p-10'>
              <Button variant='contained' size='large' onClick={() => walletService.connectWallet()}>
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
