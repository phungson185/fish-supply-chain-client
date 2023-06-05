import { BaseType, PaginateParamsType, PaginateType } from './Common';
import { FishFarmerFishProcessorOrderType } from './FishProcessor';
import { UserType } from './User';

export type FishProcessingType = BaseType & {
  id: string;
  fishProcessorId: FishFarmerFishProcessorOrderType;
  processedSpeciesName: string;
  registrationContract: string;
  fishProcessor: UserType;
  IPFSHash: string;
  dateOfProcessing: number;
  dateOfExpiry: number;
  farmedFishPurchaseOrderID: string;
  filletsInPacket: number;
  numberOfPackets: number;
  processingContract: string;
  image: string;
  description: string;
  listing: boolean;
  disable: boolean;
  qrCode: string;
};

export type ProcessingContractParamsType = PaginateParamsType & {
  isHavePackets?: boolean;
  fishProcessor?: string;
  fishProcessorId?: string;
  disable?: boolean;
  listing?: boolean;
};

export type ProcessingContractPaginateType = PaginateType & {
  items: FishProcessingType[];
};
