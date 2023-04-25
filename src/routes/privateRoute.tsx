import { Batches, BatchDetail } from 'views/Batch';
import { ContractDetail, Contracts, FishSeedDetail, FishSeeds } from 'views/FishSeedCompany';
import { FishSeedCompanyFishFarmerOrders } from 'views/FishSeedCompany-FishFamer-Orders';
import { RegistrationView } from 'views/Registration';
import { ProfileUpdate } from 'views/Profile';
import FishGrowthDetails from 'views/FishFarmer/FishGrowthDetails';
import { FishFarmerFishProcessorOrders } from 'views/FishFarmer-FishProcessor-Orders';
import { FishProcessor } from 'views/FishProcessor';
import { FishProcessorDistributorOrders } from 'views/FishProcessor - Distributor - Orders';
import { DistributorRetailerOrders } from 'views/Distributor-Retailer-Orders';

type RouteType = {
  path: string;
  url?: (query: any) => string;
  name: string;
  element: JSX.Element;
};

type PrivateRouteType = {
  [key: string]: RouteType;
};

const baseRoute: PrivateRouteType = {
  home: {
    path: '/',
    name: '',
    element: <></>,
  },
  profile: {
    path: '/profile',
    name: 'Profile',
    element: <ProfileUpdate />,
  },
  batchDetail: {
    path: '/batch/:id',
    name: 'Batch detail',
    url: ({ id }: { id: string }) => `/batch/${id}`,
    element: <BatchDetail />,
  },
};

const fdaRoute: PrivateRouteType = {
  ...baseRoute,
  registration: {
    path: '/registration',
    name: 'Registration',
    element: <RegistrationView />,
  },
};

const fishSeedCompanyRoute: PrivateRouteType = {
  ...baseRoute,
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
  contractDetail: {
    path: '/contract/:id',
    name: 'Contract detail',
    url: ({ id }: { id: string }) => `/contract/${id}`,
    element: <ContractDetail />,
  },
  fishSeeds: {
    path: '/fish-seeds',
    name: 'Fish seeds',
    element: <FishSeeds />,
  },
  fishSeedDetail: {
    path: '/fish-seed/:id',
    name: 'Fish seed detail',
    url: ({ id }: { id: string }) => `/fish-seed/${id}`,
    element: <FishSeedDetail />,
  },
  orders: {
    path: '/orders',
    name: 'Orders',
    element: <FishSeedCompanyFishFarmerOrders />,
  },
};

const fishFarmerRoute: PrivateRouteType = {
  ...baseRoute,
  batch: {
    path: '/batches',
    name: 'Batches',
    element: <Batches />,
  },
  growthDetails: {
    path: '/growthDetails',
    name: 'Growth Details',
    element: <FishGrowthDetails />,
  },
  fishSeedCompanyFishFarmerOrders: {
    path: '/fishSeedCompanyFishFarmerOrders',
    name: 'FishSeedCompany - FishFarmer - Orders',
    element: <FishSeedCompanyFishFarmerOrders />,
  },
  fishFarmerFishProcessorOrders: {
    path: '/fishFarmerFishProcessorOrders',
    name: 'FishFarmer - FishProcessor - Orders',
    element: <FishFarmerFishProcessorOrders />,
  },
};

const fishProcessorRoute: PrivateRouteType = {
  ...baseRoute,
  batch: {
    path: '/batches',
    name: 'Batches',
    element: <Batches />,
  },
  fishFarmerFishProcessorOrders: {
    path: '/fishFarmerFishProcessorOrders',
    name: 'FishFarmer - FishProcessor - Orders',
    element: <FishFarmerFishProcessorOrders />,
  },
  distributorFishProcessorOrders: {
    path: '/distributorFishProcessorOrders',
    name: 'Distributor - FishProcessor - Orders',
    element: <FishProcessorDistributorOrders />,
  },
  processingContract: {
    path: '/processingContract',
    name: 'Processing Contract',
    element: <FishProcessor />,
  },
};

const distributorRoute: PrivateRouteType = {
  ...baseRoute,
  batch: {
    path: '/batches',
    name: 'Batches',
    element: <Batches />,
  },
  distributorFishProcessorOrders: {
    path: '/distributorFishProcessorOrders',
    name: 'Distributor - FishProcessor - Orders',
    element: <FishProcessorDistributorOrders />,
  },
  retailerDistributionOrders: {
    path: '/retailerDistributionOrders',
    name: 'Retailer - Distribution - Orders',
    element: <DistributorRetailerOrders />,
  },
};

const retailerRoute: PrivateRouteType = {
  ...baseRoute,
  batch: {
    path: '/batches',
    name: 'Batches',
    element: <Batches />,
  },
  retailerDistributionOrders: {
    path: '/retailerDistributionOrders',
    name: 'Retailer - Distribution - Orders',
    element: <DistributorRetailerOrders />,
  },
};

const consumerRoute: PrivateRouteType = {
  ...baseRoute,
};

const wildCaughtFisherRoute: PrivateRouteType = {
  ...baseRoute,
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
