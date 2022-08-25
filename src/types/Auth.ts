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
