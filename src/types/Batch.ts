import { PaginateParamsType, PaginateType } from './Common';
import { FarmedFishType } from './FishSeedCompany';

export type BatchType = {
  id: string;
  type: number;
  farmedFishId: FarmedFishType; 
  fishFarmerId?: string;
  fishProcessorId?: string;
  distributorId?: string;
  retailerId?: string;
};

export type BatchParamsType = PaginateParamsType & {};

export type BatchPaginateType = PaginateType & {
  items: BatchType[];
};

