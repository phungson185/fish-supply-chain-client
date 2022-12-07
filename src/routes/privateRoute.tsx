import { RegistrationView } from 'views/Registration';
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
    path: '/registration',
    name: 'Registration',
    element: <RegistrationView />,
  },
};

export default privateRoute;
