import { PaginateParamsType, PaginateType } from './Common';

export type UserType = {
  id: string;
  address: string;
  userAddress: string;
  role: string;
  emailVerfied: boolean;
  email: string;
  bio: string;
  phone: string;
  avatar: string;
  cover: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
};

export type UserUpdateType = {
  userId?: string;
  userAddress?: string;
  email?: string;
  bio?: string;
  phone?: string;
  avatar?: string;
  cover?: string;
  name?: string;
  active?: boolean;
};

export type GetAllUserType = PaginateParamsType & {};

export type UserParamsType = PaginateParamsType & {
  address?: string;
};

export type UserPaginateType = PaginateType & {
  items: UserType[];
};

export type AccountParamsType = PaginateParamsType;
