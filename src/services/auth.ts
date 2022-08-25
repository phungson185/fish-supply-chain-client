import { GetNonceData, GetNonceType, GetTokenData, GetTokenType } from 'types/Auth';
import { UserType } from 'types/User';
import { client } from './axios';

const getNonce = (params: GetNonceType): Promise<GetNonceData> =>
  client.get(`/account-apis/api/authentication/nonce`, { params });
const getToken = (body: GetTokenType): Promise<GetTokenData> =>
  client.post(`/account-apis/api/authentication/token`, body);

const getProfile = ({ address }: { address: string }): Promise<UserType> =>
  client.get(`/account-apis/api/profile/${address}`);

export default {
  getNonce,
  getToken,
  getProfile,
};
