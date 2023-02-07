import { PaginateParamsType, PaginateType } from './Common';
import { FarmedFishType } from './FishSeedCompany';
import { FishSeedCompanyFishFarmerOrderType } from './FishFarmer';

export type BatchType = {
  id: string;
  type: number;
  farmedFishId: FarmedFishType;
  fishFarmerId?: FishSeedCompanyFishFarmerOrderType;
  fishProcessorId?: string;
  distributorId?: string;
  retailerId?: string;
  updatedAt: string;
};

export type BatchParamsType = PaginateParamsType & {};

export type BatchPaginateType = PaginateType & {
  items: BatchType[];
};
