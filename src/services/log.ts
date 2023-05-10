import { LogPaginateType, LogParamsType, LogType, MapLogType } from 'types/Log';
import { client } from './axios';

const getLogs = async (params?: LogParamsType): Promise<LogPaginateType> => client.get('/logs', { params });

const handleMapTransactionType = (log: number): MapLogType => {
  switch (log) {
    case 0:
      return {
        label: 'Update fish seed',
        color: 'bg-green-500',
      };
    case 1:
      return {
        label: 'Deploy contract',
        color: 'bg-blue-500',
      };
    case 2:
      return {
        label: 'Update order status',
        color: 'bg-yellow-500',
      };
    case 3:
      return {
        label: 'Update fish growth',
        color: 'bg-red-500',
      };
    default:
      return {
        label: '',
        color: '',
      };
  }
};

export default {
  getLogs,
  handleMapTransactionType,
};
