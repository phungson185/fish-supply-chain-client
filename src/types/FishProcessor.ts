import { BaseType, PaginateParamsType, PaginateType } from './Common';
import { FishSeedCompanyFishFarmerOrderType } from './FishFarmer';
import { UserType } from './User';

// contract types
export type PlaceFarmedFishPurchaseOrderType = {
  farmedFishContractAddress: string;
  FarmedFishGrowthDetailsID: string;
  FarmedFishPurchaser: string;
  FarmedFishSeller: string;
  NumberOfFishOrdered: string;
};

export type ConfirmFarmedFishPurchaseOrderType = {
  sender: string;
  farmedFishContractAddress: string;
  FarmedFishPurchaseOrderID: string;
  FarmedFishGrowthDetailsID: string;
  Accepted: boolean;
};

export type ReceiveFarmedFishOrderType = {
  sender: string;
  farmedFishContractAddress: string;
  FarmedFishPurchaseOrderID: string;
};

export type ProcessingContractType = {
  sender: string;
  registration: string;
  processedSpeciesname: string;
  ipfsHash: string;
  dateOfProcessing: number;
  catchMethod: string;
  filletsInPacket: number;
  numberOfPackets: number;
};

// api types
export type FishFarmerFishProcessorOrderType = BaseType & {
  id: string;
  fishFarmerId: FishSeedCompanyFishFarmerOrderType;
  farmedFishPurchaser: UserType;
  farmedFishSeller: UserType;
  speciesName: string;
  numberOfFishOrdered: number;
  farmedFishPurchaseOrderID: string;
  status: number;
  registrationContract: string;
  fishProcessor: UserType;
  IPFSHash: string;
  dateOfProcessing: number;
  filletsInPacket: number;
  processingContract: string;
  numberOfPackets: number;
  owner: UserType;
  geographicOrigin: number;
  methodOfReproduction: number;
  image: string;
};

export type CreateOrderType = {
  fishFarmerId: string;
  farmedFishPurchaser: string;
  farmedFishPurchaseOrderID: string;
  farmedFishSeller: string;
  numberOfFishOrdered: number;
  geographicOrigin: number;
  methodOfReproduction: number;
  speciesName: string;
  IPFSHash: string;
  image: string;
};

export type ConfirmOrderType = {
  orderId: string;
  status: number;
};

export type CreateProcesingContractType = {
  orderId: string;
  registrationContract: string;
  fishProcessor: string;
  IPFSHash: string;
  dateOfProcessing: number;
  catchMethod: string;
  filletsInPacket: number;
  processingContract: string;
  numberOfPackets: number;
};

export type FishFarmerFishProcessorOrderParamsType = PaginateParamsType & {
  status?: number;
  farmedFishPurchaser?: string;
  farmedFishSeller?: string;
};

export type FishFarmerFishProcessorOrderPaginateType = PaginateType & {
  items: FishFarmerFishProcessorOrderType[];
};
