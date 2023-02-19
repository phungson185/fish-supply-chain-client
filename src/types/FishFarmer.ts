import { PaginateParamsType, PaginateType } from './Common';
import { FarmedFishType } from './FishSeedCompany';
import { UserType } from './User';

// contract types
export type PlaceFishSeedsPurchaseOrderType = {
  farmedFishContractAddress: string;
  FishSeedsPurchaser: string;
  FishSeedsSeller: string;
  NumberOfFishSeedsOrdered: number;
};

export type ConfirmFishSeedsPurchaseOrderType = {
  sender: string;
  farmedFishContractAddress: string;
  FishSeedsPurchaseOrderID: string;
  accepted: boolean;
};

export type ReceiveFishSeedsOrderType = {
  sender: string;
  farmedFishContractAddress: string;
  FishSeedsPurchaseOrderID: string;
};

export type UpdateFarmedFishGrowthDetailsType = {
  FarmedFishGrowthDetailsUploader: string;
  FishWeight: string;
  TotalNumberOfFish: string;
  speciesname: string;
  IPFShash: string;
};

// api types
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
  farmedFishId: FarmedFishType;
  totalNumberOfFish: number;
  fishWeight?: number;
  speciesName: string;
  IPFSHash: string;
  owner: UserType;
  updater?: UserType;
};

export type ConfirmOrderType = {
  orderId: string;
  status: number;
};

export type UpdateGrowthDetailType = {
  orderId: string;
  totalNumberOfFish: number;
  fishWeight: number;
  speciesName: string;
  IPFSHash: string;
};

export type FishSeedCompanyFishFarmerOrderParamsType = PaginateParamsType & {};

export type FishSeedCompanyFishFarmerOrderPaginateType = PaginateType & {
  items: FishSeedCompanyFishFarmerOrderType[];
};
