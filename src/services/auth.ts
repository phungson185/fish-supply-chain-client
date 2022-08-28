import { supplyChainContract } from 'contracts';

const getProfile = (address: string) => supplyChainContract().methods.hasAdminRole(address).call();
export default {
  getProfile,
};
