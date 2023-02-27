import { PaginateParamsType, PaginateType } from './Common';
import { FishSeedCompanyFishFarmerOrderType } from './FishFarmer';
import { UserType } from './User';

// contract types
export type PlaceFarmedFishPurchaseOrderType = {
  farmedFishContractAddress: string;
  FarmedFishPurchaser: string;
  NumberOfFishOrdered: string;
  speciesname: string;
  FarmedFishSeller: string;
};

export type ConfirmFarmedFishPurchaseOrderType = {
  sender: string;
  farmedFishContractAddress: string;
  FarmedFishPurchaseOrderID: string;
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
export type FishFarmerFishProcessorOrderType = {
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
  catchMethod: string;
  filletsInPacket: number;
  processingContract: string;
  numberOfPackets: number;
  owner: UserType;
};

export type CreateOrderType = {
  fishFarmerId: string;
  farmedFishPurchaser: string;
  farmedFishPurchaseOrderID: string;
  farmedFishSeller: string;
  speciesName: string;
  numberOfFishOrdered: number;
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


export type FishFarmerFishProcessorOrderParamsType = PaginateParamsType & {};

export type FishFarmerFishProcessorOrderPaginateType = PaginateType & {
  items: FishFarmerFishProcessorOrderType[];
};
