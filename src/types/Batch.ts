import { BaseType, PaginateParamsType, PaginateType } from './Common';
import { FarmedFishType } from './FishSeedCompany';
import { FishSeedCompanyFishFarmerOrderType } from './FishFarmer';
import { FishProcessorDistributorOrderType } from './Distributor';
import { DistributorRetailerOrderType } from './Retailer';
import { FishProcessingType } from './FishProcessing';

export type BatchType = BaseType & {
  id: string;
  success: boolean;
  lastChainPoint: string;
  farmedFishId: FarmedFishType;
  fishFarmerId?: FishSeedCompanyFishFarmerOrderType;
  fishProcessingId?: FishProcessingType;
  distributorId?: FishProcessorDistributorOrderType;
  retailerId?: DistributorRetailerOrderType;
  qrCode: string;
};

export type BatchParamsType = PaginateParamsType & {};

export type BatchPaginateType = PaginateType & {
  items: BatchType[];
};
