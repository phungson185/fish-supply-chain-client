import { client } from './axios';

const uploadFile = (body: FormData): Promise<any> =>
  client.post(`https://pinata-upload-service.onrender.com/pinata/upload`, body);

export default {
  uploadFile,
};
