import { PaginateParamsType, PaginateType } from './Common';
import { FishProcessorDistributorOrderType } from './Distributor';
import { UserType } from './User';

// contract types
export type PlaceRetailerPurchaseOrderType = {
  fishProcessorContractAddress: string;
  buyer: string;
  seller: string;
  ProcessedFishPurchaseOrderID: string;
  NumberOfFishPackagesOrdered: number;
};

export type ConfirmRetailerPurchaseOrderType = {
  sender: string;
  fishProcessingContractAddress: string;
  RetailerPurchaseOrderID: string;
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
};

export type DistributorRetailerOrderType = {
  id: string;
  distributorId: FishProcessorDistributorOrderType;
  numberOfFishPackagesOrdered: number;
  retailerPurchaseOrderID: string;
  buyer: UserType;
  seller: UserType;
  owner: UserType;
  status: number;
  processedFishPurchaseOrderID: string;
};

export type ConfirmOrderType = {
  orderId: string;
  status: number;
};

export type DistributorRetailerOrderParamsType = PaginateParamsType & {};

export type DistributorRetailerOrderPaginateType = PaginateType & {
  items: DistributorRetailerOrderType[];
};
