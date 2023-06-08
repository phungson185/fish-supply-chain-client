import { BaseType } from './Common';
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
  farmedFishContractAddress: string;
  FarmedFishGrowthDetailsUploader: string;
  FishWeight: string;
  TotalNumberOfFish: string;
  WaterTemperature: number;
  Image: string;
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
  transactionHash: string;
};

export type FishSeedCompanyFishFarmerOrderType = BaseType & {
  id: string;
  fishSeedPurchaseOrderId: string;
  fishSeedsPurchaser: UserType;
  fishSeedsSeller: UserType;
  numberOfFishSeedsOrdered: number;
  fishSeedsPurchaseOrderDetailsStatus: number;
  farmedFishId: FarmedFishType;
  totalNumberOfFish: number;
  fishWeight?: number;
  geographicOrigin: number;
  methodOfReproduction: number;
  waterTemperature: number;
  speciesName: string;
  image: string;
  IPFSHash: string;
  owner: UserType;
  updater?: UserType;
  orderable: boolean;
  farmedFishGrowthDetailsID: string;
  transactionHash?: string;
};

export type ConfirmOrderType = {
  orderId: string;
  status: number;
  numberOfFishSeedsAvailable: number;
  transactionHash: string;
};

export type UpdateGrowthDetailType = {
  transactionHash?: string;
  orderId?: string;
  totalNumberOfFish?: number;
  fishWeight?: number;
  waterTemperature?: number;
  image?: string;
  IPFSHash?: string;
  orderable?: boolean;
  farmedFishGrowthDetailsID?: string;
};

export type SummaryParamsType = {
  geographicOrigin: number;
  methodOfReproduction: number;
};

export type FishSeedCompanyFishFarmerOrderParamsType = PaginateParamsType & {
  fishSeedsPurchaseOrderDetailsStatus?: number;
  fishSeedsPurchaser?: string;
  fishSeedsSeller?: string;
};

export type FishSeedCompanyFishFarmerOrderPaginateType = PaginateType & {
  items: FishSeedCompanyFishFarmerOrderType[];
};
