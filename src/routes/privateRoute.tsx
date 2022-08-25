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
    path: '/dashboard',
    name: 'Dashboard',
    element: <></>,
  },
};

export default privateRoute;
