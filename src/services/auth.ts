import { registrationContract } from 'contracts';

const getRole = (address: string) => registrationContract().methods.GetRole(address).call();
export default {
  getRole,
};
