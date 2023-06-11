import { AccountManagement } from 'views/AccountManagement';
import { BatchDetail, Batches } from 'views/Batch';
import { DistributorInventory, DistributorProducts, DistributorSummary } from 'views/Distributor';
import { DistributorRetailerOrders } from 'views/Distributor-Retailer-Orders';
import { FishFarmerSummary, FishGrowthDetail, FishGrowths } from 'views/FishFarmer';
import { FishFarmerFishProcessorOrders } from 'views/FishFarmer-FishProcessor-Orders';
import { Fishes, ProcessorInventory, ProcessorProducts, ProcessorSummary } from 'views/FishProcessor';
import { FishProcessorDistributorOrders } from 'views/FishProcessor - Distributor - Orders';
import { ContractDetail, Contracts, FishSeedCompanySummary, FishSeedDetail, FishSeeds } from 'views/FishSeedCompany';
import { FishSeedCompanyFishFarmerOrders } from 'views/FishSeedCompany-FishFamer-Orders';
import { ProfileUpdate } from 'views/Profile';
import { RegistrationView } from 'views/Registration';
import { RetailerInventory, RetailerProducts, RetailerSummary } from 'views/Retailer';

type RouteType = {
  path: string;
  url?: (query: any) => string;
  name: string;
  element: JSX.Element;
  disabled?: boolean;
};

type PrivateRouteType = {
  [key: string]: RouteType;
};

type PublicRouteType = {
  [key: string]: RouteType;
};

export const publicRoute: PublicRouteType = {
  batchDetail: {
    path: '/batch/:id',
    name: 'Batch detail',
    url: ({ id }: { id: string }) => `/batch/${id}`,
    element: <BatchDetail />,
    disabled: true,
  },
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
    disabled: true,
  },
};

const fdaRoute: PrivateRouteType = {
  ...baseRoute,
  registration: {
    path: '/registration',
    name: 'Registration',
    element: <RegistrationView />,
  },
  accountManagement: {
    path: '/account-management',
    name: 'Account management',
    element: <AccountManagement />,
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
    disabled: true,
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
    disabled: true,
  },
  orders: {
    path: '/orders',
    name: 'Fish seed company - Fish farmer - Orders',
    element: <FishSeedCompanyFishFarmerOrders />,
  },
  summary: {
    path: '/summary',
    name: 'Summary',
    element: <FishSeedCompanySummary />,
  },
};

const fishFarmerRoute: PrivateRouteType = {
  ...baseRoute,
  batch: {
    path: '/batches',
    name: 'Batches',
    element: <Batches />,
  },
  growths: {
    path: '/fish-growths',
    name: 'Fish growths',
    element: <FishGrowths />,
  },
  growthDetail: {
    path: '/fish-growth/:id',
    name: 'Fish growth detail',
    url: ({ id }: { id: string }) => `/fish-growth/${id}`,
    element: <FishGrowthDetail />,
    disabled: true,
  },
  contractDetail: {
    path: '/contract/:id',
    name: 'Contract detail',
    url: ({ id }: { id: string }) => `/contract/${id}`,
    element: <ContractDetail />,
    disabled: true,
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
  summary: {
    path: '/summary',
    name: 'Summary',
    element: <FishFarmerSummary />,
  },
};

const fishProcessorRoute: PrivateRouteType = {
  ...baseRoute,
  batch: {
    path: '/batches',
    name: 'Batches',
    element: <Batches />,
  },
  fishes: {
    path: '/fishes',
    name: 'Fishes',
    element: <Fishes />,
  },
  processorProducts: {
    path: '/products',
    name: 'Products',
    element: <ProcessorProducts />,
  },
  processorInventory: {
    path: '/inventory',
    name: 'Inventory',
    element: <ProcessorInventory />,
  },
  growthDetail: {
    path: '/fish-growth/:id',
    name: 'Fish growth detail',
    url: ({ id }: { id: string }) => `/fish-growth/${id}`,
    element: <FishGrowthDetail />,
    disabled: true,
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
  summary: {
    path: '/summary',
    name: 'Summary',
    element: <ProcessorSummary />,
  },
};

const distributorRoute: PrivateRouteType = {
  ...baseRoute,
  batch: {
    path: '/batches',
    name: 'Batches',
    element: <Batches />,
  },
  processorProducts: {
    path: '/products/:fishProcessor',
    name: 'Inventory',
    url: ({ fishProcessor }: { fishProcessor: any }) => `/products/${fishProcessor.id}`,
    element: <ProcessorProducts />,
    disabled: true,
  },
  distributorProducts: {
    path: '/products',
    name: 'Products',
    element: <DistributorProducts />,
  },
  distributorInventory: {
    path: '/inventory',
    name: 'Inventory',
    element: <DistributorInventory />,
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
  summary: {
    path: '/summary',
    name: 'Summary',
    element: <DistributorSummary />,
  },
};

const retailerRoute: PrivateRouteType = {
  ...baseRoute,
  batch: {
    path: '/batches',
    name: 'Batches',
    element: <Batches />,
  },
  distributorProducts: {
    path: '/products/:id',
    name: 'Inventory',
    url: ({ owner }: { owner: any }) => `/products/${owner.id}`,
    element: <DistributorProducts />,
    disabled: true,
  },
  retailerProducts: {
    path: '/products',
    name: 'Products',
    element: <RetailerProducts />,
  },
  retailerInventory: {
    path: '/inventory',
    name: 'Inventory',
    element: <RetailerInventory />,
  },
  retailerDistributionOrders: {
    path: '/retailerDistributionOrders',
    name: 'Retailer - Distribution - Orders',
    element: <DistributorRetailerOrders />,
  },
  summary: {
    path: '/summary',
    name: 'Summary',
    element: <RetailerSummary />,
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
