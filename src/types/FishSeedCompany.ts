import { PaginateParamsType, PaginateType } from './Common';
import { UserType } from './User';

export type FarmedFishContractType = {
  registration: string;
  Speciesname: string;
  Geographicorigin: string;
  NumberOfFishSeedsavailable: number;
  AquacultureWatertype: string;
  IPFShash: string;
};

export type CreateFarmedFishContractType = {
  farmedFishContract: string;
  speciesName: string;
  geographicOrigin: string;
  numberOfFishSeedsAvailable: number;
  aquacultureWaterType: string;
  IPFSHash: string;
};

export type FarmedFishType = {
  id: string;
  farmedFishContract: string;
  speciesName: string;
  geographicOrigin: string;
  numberOfFishSeedsAvailable: number;
  aquacultureWaterType: string;
  IPFSHash: string;
  owner: UserType;
};

export type CreateBatchType = {
  farmedFishId: string;
  type: number;
};

export type FarmedFishContractParamsType = PaginateParamsType & {};

export type FarmedFishContractPaginateType = PaginateType & {
  items: FarmedFishType[];
};
