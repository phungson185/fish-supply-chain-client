export type AirdropEventCommonType = {
  fromDate: number;
  toDate: number;
  name: string;
  description: string;
  condition: string;
  itemImage: string;
  id: string;
  itemVideo?: string;
};

export type AirdropEventCreateOrUpdateType = AirdropEventCommonType & {
  itemId?: string;
  joinLink?: string;
  onchainId?: string;
  whitelistContract?: string;
  parentId?: string;
};

export type AirdropEventType = AirdropEventCommonType & {
  parentId: string;
  createdAt: string;
  updatedAt: string;
  joinLink: string;
  onchainId?: string;
  whitelistContract?: string;
  events?: AirdropEventType[];
};

export type AirdropEventParamsType = {
  parentId: string;
};
