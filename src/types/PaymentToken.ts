import { PaginateParamsType, PaginateType } from './Common';

export type PaymentTokenType = {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  contractAddress: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PaymentTokenParamsType = PaginateParamsType & {
  search?: string;
  orderBy?: string;
  desc?: boolean;
};

export type PaymentTokenPaginateType = PaginateType & {
  items: PaymentTokenType[];
};

export type PaymentTokenUpdateOrCreateType = {
  id?: string;
  name: string;
  symbol: string;
  decimals: number;
  contractAddress: string;
  enabled: boolean;
};
