import { SystemType } from 'types/System';
import { client } from './axios';

const getSystemConfig = (): Promise<SystemType> => client.get(`/system`);

export default {
  getSystemConfig,
};
