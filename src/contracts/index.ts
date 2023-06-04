import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import Registration from './abis/Registration.json';
import { web3 } from 'services';

// bsc testnet

export const registrationContract = () =>
  new web3.eth.Contract(Registration.output.abi as AbiItem[], '0x51BB0F3Ec73057D793E7FD6ffc585D0Ac08A5777');
