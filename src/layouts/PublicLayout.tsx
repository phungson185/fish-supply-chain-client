import { Button } from '@mui/material';
import { ScrollButton } from 'components';
import { AppHeader } from 'containers';
import { useNotification, useWindowSize } from 'hooks';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { saveSystem } from 'reducers/system';
import { getRoute, publicRoute } from 'routes';
import { systemService, walletService } from 'services';
import { BatchDetail } from 'views/Batch';

const PublicLayout = () => {
  useNotification();
  return (
    <div className='App'>
      <main>
        <div className='sm:px-6 px-4 py-4 pt-4'>
          <Routes>
            {Object.values(publicRoute).map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
          </Routes>
        </div>
        <ScrollButton />
      </main>
    </div>
  );
};

export default PublicLayout;
