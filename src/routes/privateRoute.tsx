import { Batches } from 'views/Batch';
import { Contracts } from 'views/FishSeedCompany';
import { FishSeedCompanyFishFarmerOrders } from 'views/FishSeedCompany-FishFamer-Orders';
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

const fdaRoute: PrivateRouteType = {
  home: {
    path: '/',
    name: '',
    element: <></>,
  },
  registration: {
    path: '/registration',
    name: 'Registration',
    element: <RegistrationView />,
  },
};

const fishSeedCompanyRoute: PrivateRouteType = {
  home: {
    path: '/',
    name: '',
    element: <></>,
  },
  batch: {
    path: '/batches',
    name: 'Batches',
    element: <Batches />,
  },
  contracts: {
    path: '/contracts',
    name: 'Contracts',
    element: <Contracts />,
  },
  orders: {
    path: '/orders',
    name: 'Orders',
    element: <FishSeedCompanyFishFarmerOrders />,
  },
};

const fishFarmerRoute: PrivateRouteType = {
  home: {
    path: '/',
    name: '',
    element: <></>,
  },
  batch: {
    path: '/batches',
    name: 'Batches',
    element: <Batches />,
  },
  orders: {
    path: '/orders',
    name: 'Orders',
    element: <FishSeedCompanyFishFarmerOrders />,
  },
};

const fishProcessorRoute: PrivateRouteType = {
  home: {
    path: '/',
    name: '',
    element: <></>,
  },
};

const distributorRoute: PrivateRouteType = {
  home: {
    path: '/',
    name: '',
    element: <></>,
  },
};

const retailerRoute: PrivateRouteType = {
  home: {
    path: '/',
    name: '',
    element: <></>,
  },
};

const consumerRoute: PrivateRouteType = {
  home: {
    path: '/',
    name: '',
    element: <></>,
  },
};

const wildCaughtFisherRoute: PrivateRouteType = {
  home: {
    path: '/',
    name: '',
    element: <></>,
  },
};

export const getRoute = (role: string) => {
  if (role === 'FDA') {
    return fdaRoute;
  } else if (role === 'Fish Farmer') {
    return fishFarmerRoute;
  } else if (role === 'Fish Seed Company') {
    return fishSeedCompanyRoute;
  } else if (role === 'Fish Processor') {
    return fishProcessorRoute;
  } else if (role === 'Distributor') {
    return distributorRoute;
  } else if (role === 'Retailer') {
    return retailerRoute;
  } else if (role === 'Consumer') {
    return consumerRoute;
  } else if (role === 'Wild Caught Fisher') {
    return wildCaughtFisherRoute;
  } else {
    return {};
  }
};
