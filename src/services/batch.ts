import { BatchType } from 'types/Batch';
import { client } from './axios';

const getBatchById = ({ id }: { id: string }): Promise<BatchType> => client.get(`/batchs/${id}`);

export default {
  getBatchById,
};
