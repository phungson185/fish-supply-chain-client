export type GetNonceType = {
  address: string;
};

export type GetNonceData = {
  address: string;
  nonce: number;
};

export type GetTokenType = {
  address: string;
  signature: string;
};

export type GetTokenData = {
  accessToken: string;
};

export type SyncRoleType = {
  address: string;
  role: string;
};

export enum RoleType {
  fdaRole = 'FDA',
  fishFarmerRole = 'Fish Farmer',
  fishSeedCompanyRole = 'Fish Seed Company',
  fishProcessorRole = 'Fish Processor',
  distributorRole = 'Distributor',
  retailerRole = 'Retailer',
  consumerRole = 'Consumer',
  wildCaughtFisherRole = 'Wild Caught Fisher',
}
