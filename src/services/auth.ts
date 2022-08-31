import { adminContract } from 'contracts';

const getProfile = (address: string) => adminContract().methods.hasAdminRole(address).call();
export default {
  getProfile,
};
