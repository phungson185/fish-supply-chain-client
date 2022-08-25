import {
  SyncEventBodyType,
  EventAirDropItemType,
  EventMarketplaceSoldItemType,
  EventExternalTransferredItemType,
} from 'types/EventSync';
import { client } from './axios';

const syncMetaverse = (body: SyncEventBodyType): Promise<EventAirDropItemType[]> =>
  client.post(`/dashboard-apis/api/dashboard/mq/sync-metaverse`, body);
const syncMarketplace = (body: SyncEventBodyType): Promise<EventMarketplaceSoldItemType[]> =>
  client.post(`/dashboard-apis/api/dashboard/mq/sync-marketplace`, body);
const syncTransfer = (body: SyncEventBodyType): Promise<EventExternalTransferredItemType[]> =>
  client.post(`/dashboard-apis/api/dashboard/mq/sync-nft-transfer`, body);

export default {
  syncMetaverse,
  syncMarketplace,
  syncTransfer,
};
