import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import Registration from './abis/Registration.json';

export const web3 = new Web3();

export const registrationContract = () =>
  new web3.eth.Contract(Registration.output.abi as AbiItem[], '0x7A7f59D2A2063056d6980E5653685233E8b7fC64');
