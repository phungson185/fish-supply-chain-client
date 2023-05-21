import { BaseType, PaginateParamsType, PaginateType } from './Common';
import { FishProcessorDistributorOrderType } from './Distributor';
import { UserType } from './User';

// contract types
export type PlaceRetailerPurchaseOrderType = {
  fishProcessingContractAddress: string;
  buyer: string;
  seller: string;
  ProcessedFishPurchaseOrderID: string;
  NumberOfFishPackagesOrdered: number;
};

export type ConfirmRetailerPurchaseOrderType = {
  sender: string;
  fishProcessingContractAddress: string;
  RetailerPurchaseOrderID: string;
  ProcessedFishPurchaseOrderID: string;
  accepted: boolean;
};

export type ReceiveRetailerOrderType = {
  sender: string;
  fishProcessingContractAddress: string;
  RetailerPurchaseOrderID: string;
};

// api types

export type CreateOrderType = {
  buyer: string;
  seller: string;
  retailerPurchaseOrderID: string;
  numberOfFishPackagesOrdered: number;
  processedFishPurchaseOrderID: string;
  distributorId: string;
  speciesName: string;
  description: string;
  dateOfProcessing: number;
  dateOfExpiry: number;
  numberOfPackets: number;
  filletsInPacket: number;
  IPFSHash: string;
  image: string;
};

export type DistributorRetailerOrderType = BaseType & {
  id: string;
  distributorId: FishProcessorDistributorOrderType;
  numberOfFishPackagesOrdered: number;
  retailerPurchaseOrderID: string;
  buyer: UserType;
  seller: UserType;
  owner: UserType;
  status: number;
  processedFishPurchaseOrderID: string;
  speciesName: string;
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
  listing: boolean;
};

export type ProfileInventoryType = {
  user: UserType;
  retailer: number;
};

export type DistributorRetailerOrderParamsType = PaginateParamsType & {};

export type DistributorRetailerOrderPaginateType = PaginateType & {
  items: DistributorRetailerOrderType[];
};
