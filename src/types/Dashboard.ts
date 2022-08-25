import { PaginateParamsType, PaginateType } from 'types/Common';

export type DashboardType = {
  totalVolume: number;
  numberOfTrace: number;
  avgPrice: number;
  ceilingPrice: number;
  floorPrice: number;
  history: HistoryPaginateType;
};

export type HistoryType = {
  amount: number;
  createdAt: string;
  fromAddress: string;
  fromUser: {
    address: string;
  };
  id: string;
  itemId: string;
  nftContract: string;
  price: {
    $numberDecimal: number;
  };
  toAddress: string;
  toUser: {
    address: string;
  };
  tokenId: string;
  type: number;
  updatedAt: string;
};

export type HistoryPaginateType = PaginateType & {
  items: HistoryType[];
};

export type DashboardParamsType = PaginateParamsType & {
  fromDate?: number;
  toDate?: number;
};

export type ServerType = {
  id: string;
  address: string;
  connections: number;
};

export type DashboardServerType = {
  servers: ServerType[];
  count: number;
};
