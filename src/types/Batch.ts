import { PaginateParamsType, PaginateType } from './Common';
import { FarmedFishType } from './FishSeedCompany';
import { FishSeedCompanyFishFarmerOrderType } from './FishFarmer';
import { FishFarmerFishProcessorOrderType } from './FishProcessor';

export type BatchType = {
  id: string;
  type: number;
  farmedFishId: FarmedFishType;
  fishFarmerId?: FishSeedCompanyFishFarmerOrderType;
  fishProcessorId?: FishFarmerFishProcessorOrderType;
  distributorId?: string;
  retailerId?: string;
  updatedAt: string;
};

export type BatchParamsType = PaginateParamsType & {};

export type BatchPaginateType = PaginateType & {
  items: BatchType[];
};
