import { Breadcrumbs, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { getRoute } from 'routes';
import { NavigateNext } from '@mui/icons-material';
import { profileSelector } from 'reducers/profile';
import { useSelector } from 'react-redux';

const Breadcrumb = () => {
  const { role } = useSelector(profileSelector);
  const location = useLocation();
  const privateRoute = getRoute(role);

  const routes = (location.pathname.match(/\/[\w-]+/g) ?? [])
    .map((_, index, array) => array.slice(0, index + 1).join(''))
    .map((item) => Object.values(privateRoute).find((route) => item === route.path))
    .filter((item) => item?.name);

  return (
    <div className='flex items-center space-x-1'>
      <Breadcrumbs separator={<NavigateNext fontSize='small' className='text-primary-dark' />}>
        {routes.map((item, index) => (
          <Typography key={index} className='font-medium text-xl text-primary-dark'>
            {item?.name}
          </Typography>
        ))}
      </Breadcrumbs>
    </div>
  );
};

export default Breadcrumb;
