import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import Registration from './abis/Registration.json';
import { web3 } from 'services';

// bsc testnet

export const registrationContract = () =>
  new web3.eth.Contract(Registration.output.abi as AbiItem[], '0x9daa0177cf81Ba366A9166ffd7656Ad99e0c0935');
