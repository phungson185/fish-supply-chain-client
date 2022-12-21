import { PaginateParamsType, PaginateType } from './Common';

export type UserType = {
  id: string;
  nonce: number;
  address: string;
  role: string;
  emailVerfied: boolean;
  email: string;
  bio: string;
  phone: string;
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
