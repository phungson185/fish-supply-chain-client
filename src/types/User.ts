import { PaginateParamsType, PaginateType } from './Common';

export type UserType = {
  id: string;
  nonce: number;
  username: string;
  address: string;
  isAdmin: boolean;
  emailVerfied: boolean;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type UserParamsType = PaginateParamsType & {
  address?: string;
};

export type UserPaginateType = PaginateType & {
  items: UserType[];
};

export type AccountType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  address: string;
  email: string;
  emailConfirmed: boolean;
  emailCodeValue: string;
  emailCodeSent: string;
  whitelist: boolean;
  x: any;
  y: any;
  z: any;
};

export type AccountParamsType = PaginateParamsType;

export type AccountPaginateType = PaginateType & {
  items: AccountType[];
};

export type AccountSetWhiteList = {
  address: string;
  isWhitelisted: boolean;
};
