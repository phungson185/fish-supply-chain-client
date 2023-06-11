import { GetAllUserType, UserPaginateType, UserType, UserUpdateType } from 'types/User';
import { client } from './axios';
import { RoleType } from 'types/Auth';
import { registrationContract } from 'contracts';

const updateUserStatus = async (sender: string, address: string, role: string, active: boolean) =>
  registrationContract().methods.UpdateUserStatus(address, role, active).send({ from: sender, gas: 3500000 });

const getProfile = async (): Promise<UserType> => client.get(`/user`);

const updateProfile = async (body: UserUpdateType): Promise<UserType> => client.put(`/user`, body);

const getAllUsers = async (params?: GetAllUserType): Promise<UserPaginateType> =>
  client.get(`/user/all-users`, { params });

const updateUser = async (body: UserUpdateType): Promise<UserType> => client.post(`/user/update-user`, body);

const mapColorRole = (role: string) => {
  switch (role) {
    case RoleType.fdaRole:
      return 'primary';
    case RoleType.fishSeedCompanyRole:
      return 'secondary';
    case RoleType.fishFarmerRole:
      return 'info';
    case RoleType.fishProcessorRole:
      return 'success';
    case RoleType.distributorRole:
      return 'warning';
    case RoleType.retailerRole:
      return 'error';
    default:
      return 'default';
  }
};

export default {
  updateUserStatus,
  getProfile,
  updateProfile,
  mapColorRole,
  getAllUsers,
  updateUser,
};
