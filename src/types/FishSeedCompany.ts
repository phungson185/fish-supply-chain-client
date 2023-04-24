import { BaseType, PaginateParamsType, PaginateType } from './Common';
import { UserType } from './User';

export const GeographicOriginType = {
  BRACKISH: {
    value: 0,
    label: 'Brackish',
  },
  FRESH: {
    value: 1,
    label: 'Fresh',
  },
  MARINE: {
    value: 2,
    label: 'Marine',
  },
};

export const MethodOfReproductionType = {
  NATURAL: {
    value: 0,
    label: 'Natural',
  },
  ARTIFICAL: {
    value: 1,
    label: 'Artifical',
  },
};

export type FarmedFishContractType = {
  registration: string;
  Speciesname: string;
  Geographicorigin: string;
  NumberOfFishSeedsavailable: number;
  MethodOfReproduction: string;
  Images: string;
  WaterTemperature: number;
  IPFShash: string;
};

export type CreateFarmedFishContractType = {
  farmedFishContract: string;
  fishSeedId: string;
  speciesName: string;
  geographicOrigin: number;
  numberOfFishSeedsAvailable: number;
  methodOfReproduction: number;
  images: string[];
  waterTemperature: number;
  IPFSHash: string;
};

export type AddFishSeedType = {
  title: string;
  subTitle?: string;
  description?: string;
  geographicOrigin: number;
  methodOfReproduction: number;
  speciesName: string;
  quantity: number;
  waterTemperature: number;
  images?: string[];
  IPFSHash: string;
};

export type FishSeedType = AddFishSeedType &
  BaseType & {
    id: string;
    isMakeContract: boolean;
  };

export type FarmedFishType = {
  id: string;
  farmedFishContract: string;
  speciesName: string;
  numberOfFishSeedsAvailable: number;
  images: string[];
  waterTemperature: number;
  geographicOrigin: number;
  methodOfReproduction: number;
  IPFSHash: string;
  owner: UserType;
};

export type CreateBatchType = {
  farmedFishId: string;
  type: number;
};

export type FishSeedParamsType = PaginateParamsType & {};
export type FishSeedPaginateType = PaginateType & {
  items: FishSeedType[];
};

export type FarmedFishContractParamsType = PaginateParamsType & {};
export type FarmedFishContractPaginateType = PaginateType & {
  items: FarmedFishType[];
};
