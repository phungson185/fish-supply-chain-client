import { client } from './axios';
import { AirdropEventType, AirdropEventCreateOrUpdateType, AirdropEventParamsType } from 'types/Airdrop';

const createAirdropEvent = ({ ...body }: AirdropEventCreateOrUpdateType) =>
  client.post(`/dashboard-apis/api/airdrop-events`, body);

const changeAirdropEvent = ({ id, ...body }: AirdropEventCreateOrUpdateType) =>
  client.put(`/dashboard-apis/api/airdrop-events/${id}`, body);

const deleteAirdropEvent = ({ id }: { id: string }) => client.delete(`/dashboard-apis/api/airdrop-events/${id}`);

const fetchAirdropEvents = (params?: AirdropEventParamsType): Promise<AirdropEventType[]> =>
  client.get(`/dashboard-apis/api/airdrop-events`, { params });

const getAirdropEventById = ({ id }: { id: string }): Promise<AirdropEventType> =>
  client.get(`/dashboard-apis/api/airdrop-events/${id}`);

export default {
  createAirdropEvent,
  changeAirdropEvent,
  deleteAirdropEvent,
  fetchAirdropEvents,
  getAirdropEventById,
};
