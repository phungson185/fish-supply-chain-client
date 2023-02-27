import { PaginateParamsType, PaginateType } from './Common';
import { FarmedFishType } from './FishSeedCompany';
import { FishSeedCompanyFishFarmerOrderType } from './FishFarmer';
import { FishFarmerFishProcessorOrderType } from './FishProcessor';
import { FishProcessorDistributorOrderType } from './Distributor';
import { DistributorRetailerOrderType } from './Retailer';

export type BatchType = {
  id: string;
  type: number;
  farmedFishId: FarmedFishType;
  fishFarmerId?: FishSeedCompanyFishFarmerOrderType;
  fishProcessorId?: FishFarmerFishProcessorOrderType;
  distributorId?: FishProcessorDistributorOrderType;
  retailerId?: DistributorRetailerOrderType;
  updatedAt: string;
};

export type BatchParamsType = PaginateParamsType & {};

export type BatchPaginateType = PaginateType & {
  items: BatchType[];
};
