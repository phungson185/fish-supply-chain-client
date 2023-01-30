import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import Registration from './abis/Registration.json';

export const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

export const registrationContract = () =>
  new web3.eth.Contract(Registration.output.abi as AbiItem[], '0x30f614a9e9cb2f14d0c2614efc7b5bc1f4a657d5');
