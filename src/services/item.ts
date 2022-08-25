import { ItemMintType } from 'types/Item';
import { client } from './axios';

const mintItem = (body: ItemMintType) => client.post(`/dashboard-apis/api/items/mint`, body);

export default {
  mintItem,
};
