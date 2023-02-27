import { PaginateParamsType, PaginateType } from './Common';
import { FishFarmerFishProcessorOrderType } from './FishProcessor';
import { UserType } from './User';

// contract types
export type PlaceProcessedFishPurchaseOrderType = {
  fishProcessorContractAddress: string;
  orderer: string;
  ProcessedFishPackageId: string;
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
  orderer: string;
  receiver: string;
  processedFishPackageId: string;
  quantityOfFishPackageOrdered: number;
  processedFishPurchaseOrderId: string;
  processorId: string;
};

export type FishProcessorDistributorOrderType = {
  id: string;
  processorId: FishFarmerFishProcessorOrderType;
  quantityOfFishPackageOrdered: number;
  processedFishPackageId: string;
  orderer: UserType;
  receiver: UserType;
  owner: UserType;
  status: number;
  processedFishPurchaseOrderId: string;
};

export type ConfirmOrderType = {
  orderId: string;
  status: number;
};

export type FishProcessorDistributorOrderParamsType = PaginateParamsType & {};

export type FishProcessorDistributorOrderPaginateType = PaginateType & {
  items: FishProcessorDistributorOrderType[];
};
