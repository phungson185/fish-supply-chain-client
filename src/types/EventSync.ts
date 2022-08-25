export type EventAirDropItemType = {
  tokenId: string;
  to: string;
  block: string;
  transactionHash: string;
  amount: number;
  type: number;
  contract: string;
  onchainId: string;
};

export type EventMarketplaceSoldItemType = {
  tokenId: string;
  seller: string;
  buyer: string;
  priceInWei: string;
  feeInWei: string;
  block: string;
  transactionHash: string;
  paymentToken: string;
};

export type EventExternalTransferredItemType = {
  tokenId: string;
  from: string;
  to: string;
  block: string;
  transactionHash: string;
};

export type SyncEventBodyType = {
  fromBlock: string;
  toBlock: string;
};
