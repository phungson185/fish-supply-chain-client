import { registrationContract } from 'contracts';

const isFDA = (address: string) => registrationContract().methods.isFDA(address).call();
export default {
  isFDA,
};
