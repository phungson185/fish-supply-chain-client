import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import Registration from './abis/Registration.json';
import { web3 } from 'services';

// bsc testnet

export const registrationContract = () =>
  new web3.eth.Contract(Registration.output.abi as AbiItem[], '0x0F8337BF08E5D1C70e6567D5838ecf36222Aab7B');
