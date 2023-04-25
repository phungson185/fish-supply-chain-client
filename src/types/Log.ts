import { BaseType, PaginateParamsType, PaginateType } from './Common';
import { UserType } from './User';

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
  oldData: Object;
  newData: Object;
  message: string;
  title: string;
};

export type LogParamsType = PaginateParamsType & {
  objectId?: string;
};

export type LogPaginateType = PaginateType & {
  items: LogType[];
};
