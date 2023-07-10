import { ScrollButton } from 'components';
import { useNotification } from 'hooks';
import { Route, Routes } from 'react-router-dom';
import { publicRoute } from 'routes';

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
