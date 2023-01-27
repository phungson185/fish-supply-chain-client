import { PaginateParamsType, PaginateType } from './Common';
import { UserType } from './User';

export type PlaceFishSeedsPurchaseOrderType = {
  farmedFishContractAddress: string;
  FishSeedsPurchaser: string;
  FishSeedsSeller: string;
  NumberOfFishSeedsOrdered: number;
};

export type CreateOrderType = {
  farmedFishId: string;
  fishSeedPurchaseOrderId: string;
  fishSeedsPurchaser: string;
  fishSeedsSeller: string;
  numberOfFishSeedsOrdered: number;
  fishSeedsPurchaseOrderDetailsStatus: string;
};

export type FishSeedCompanyFishFarmerOrderType = {
  id: string;
  fishSeedPurchaseOrderId: string;
  fishSeedsPurchaser: UserType;
  fishSeedsSeller: UserType;
  numberOfFishSeedsOrdered: number;
  fishSeedsPurchaseOrderDetailsStatus: number;
};

export type FishSeedCompanyFishFarmerOrderParamsType = PaginateParamsType & {};

export type FishSeedCompanyFishFarmerOrderPaginateType = PaginateType & {
  items: FishSeedCompanyFishFarmerOrderType[];
};
