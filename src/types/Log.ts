import { BaseType, PaginateParamsType, PaginateType } from './Common';
import { UserType } from './User';

export enum TransactionType {
  // UPDATE_FISH_SEED = 0,
  // DEPLOY_CONTRACT = 1,
  // UPDATE_ORDER_STATUS = 2,
  // UPDATE_FISH_GROWTH = 3,
  // UPDATE_PROCESSING_CONTRACT = 4,
  // UPDATE_PRODUCT = 5,
  // CREATE_ORDER = 6,
  FISH_SEED = 1,
  CONTRACT = 2,
  FISH_GROWTH = 3,
  ORDER = 4,
  PRODUCT = 5,
}

export type MapLogType = {
  label: string;
  color: string;
};

export type LogType = BaseType & {
  id: string;
  transactionHash?: string;
  transactionType: number;
  logType: number;
  owner: UserType;
  oldData: string;
  newData: string;
  message: string;
  title: string;
};

export type LogParamsType = PaginateParamsType & {
  objectId?: string;
  transactionType?: number;
};

export type LogPaginateType = PaginateType & {
  items: LogType[];
};
