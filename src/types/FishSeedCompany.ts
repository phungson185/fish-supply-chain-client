import { PaginateParamsType, PaginateType } from "./Common";

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
  enabled: boolean;
};

export type FarmedFishContractParamsType = PaginateParamsType & {
};

export type FarmedFishContractPaginateType = PaginateType & {
  items: FarmedFishType[];
};