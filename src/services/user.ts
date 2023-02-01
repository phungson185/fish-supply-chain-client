import { UserType, UserUpdateType } from 'types/User';
import { client } from './axios';

const getProfile = async (): Promise<UserType> => client.get(`/user`);

const updateProfile = async (body: UserUpdateType): Promise<UserType> => client.put(`/user`, body);

export default {
  getProfile,
  updateProfile,
};
