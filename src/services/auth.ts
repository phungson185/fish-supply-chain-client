import { registrationContract } from 'contracts';
import { GetNonceData, GetNonceType, GetTokenType, SyncRoleType } from 'types/Auth';
import { UserType } from 'types/User';
import { client } from './axios';

const getRole = (address: string) => registrationContract().methods.GetRole(address).call();

const getNonce = (params: GetNonceType): Promise<GetNonceData> => client.get(`/authentication/nonce`, { params });

const getToken = (body: GetTokenType) => client.post(`/authentication/token`, body);

const syncRole = (body: SyncRoleType): Promise<UserType> => client.post(`/authentication/sync-role`, body);

export default {
  getNonce,
  getToken,
  getRole,
  syncRole,
};
