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

export type FishSeedParamsType = PaginateParamsType & {};
export type FishSeedPaginateType = PaginateType & {
  items: FishSeedType[];
};

export type FarmedFishContractParamsType = PaginateParamsType & {};
export type FarmedFishContractPaginateType = PaginateType & {
  items: FarmedFishType[];
};
