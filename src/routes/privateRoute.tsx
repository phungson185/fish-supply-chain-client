import { ManufacturerView } from 'views/Manufacturer';
type RouteType = {
  path: string;
  url?: (query: any) => string;
  name?: string;
  element: JSX.Element;
};

type PrivateRouteType = {
  [key: string]: RouteType;
};

const privateRoute: PrivateRouteType = {
  home: {
    path: '/',
    name: '',
    element: <></>,
  },
  manufacturer: {
    path: '/manufacturer',
    name: 'Manufacturer',
    element: <ManufacturerView />,
  },
};

export default privateRoute;
