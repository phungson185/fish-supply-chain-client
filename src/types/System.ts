export type SystemType = {
  id: string;
  chainId: string;
  chainName: string;
  nftContractAddress: string;
  marketplaceAddress: string;
  boxContractAddress: string;
  boxPaymentContractAddress: string;
  metaverseContractAddress: string;
  userMintEnable: boolean;
  multipleMintEnable: boolean;
  isMaintainceEnabled: boolean;
};

export type SystemUpdateType = {
  id: string;
  chainId?: string;
  chainName?: string;
  nftContractAddress?: string;
  marketplaceAddress?: string;
  boxContractAddress?: string;
  boxPaymentContractAddress?: string;
  metaverseContractAddress?: string;
  userMintEnable?: boolean;
  multipleMintEnable?: boolean;
  isMaintainceEnabled?: boolean;
};
