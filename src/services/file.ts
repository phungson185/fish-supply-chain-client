import { client } from './axios';

const uploadFile = (body: FormData): Promise<any> => client.post(`/dashboard-apis/api/upload`, body);

export default {
  uploadFile,
};
