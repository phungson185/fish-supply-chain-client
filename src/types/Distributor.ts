import { BaseType } from './Common';
import { PaginateParamsType, PaginateType } from './Common';
import { FishProcessingType } from './FishProcessing';
import { FishFarmerFishProcessorOrderType } from './FishProcessor';
import { UserType } from './User';

// contract types
export type PlaceProcessedFishPurchaseOrderType = {
  fishProcessingContractAddress: string;
  orderer: string;
  quantityoffishpackageordered: number;
  Receiver: string;
};

export type ConfirmProcessedFishPurchaseOrderType = {
  sender: string;
  fishProcessingContractAddress: string;
  ProcessedFishPurchaseOrderID: string;
  Accepted: boolean;
};

export type ReceiveProcessedFishOrderType = {
  sender: string;
  fishProcessingContractAddress: string;
  ProcessedFishPurchaseOrderID: string;
};

// api types
export type CreateOrderType = {
  fishProcessingId: string;
  speciesName: string;
  quantityOfFishPackageOrdered: number;
  filletsInPacket: number;
  processedFishPurchaseOrderId: string;
  orderer: string;
  receiver: string;
  dateOfProcessing: number;
  dateOfExpiry: number;
  IPFSHash: string;
  image: string;
  description: string;
};

export type FishProcessorDistributorOrderType = BaseType & {
  id: string;
  fishProcessingId: FishProcessingType;
  speciesName: string;
  quantityOfFishPackageOrdered: number;
  processedFishPurchaseOrderId: string;
  orderer: UserType;
  receiver: UserType;
  owner: UserType;
  status: number;
  dateOfProcessing: number;
  dateOfExpiry: number;
  numberOfPackets: number;
  filletsInPacket: number;
  IPFSHash: string;
  image: string;
  disable: boolean;
  listing: boolean;
  description: string;
};

export type ConfirmOrderType = {
  orderId: string;
  status: number;
};

export type UpdateOrderType = {
  orderId: string;
  listing?: boolean;
  numberOfPackets?: number;
};

export type FishProcessorDistributorOrderParamsType = PaginateParamsType & {
  status?: number;
  orderer?: string;
  receiver?: string;
  disable?: boolean;
  listing?: boolean;
  isHavePackets?: boolean;
};

export type ProfileInventoryType = {
  user: UserType;
  distributor: number;
};

export type FishProcessorDistributorOrderPaginateType = PaginateType & {
  items: FishProcessorDistributorOrderType[];
};
