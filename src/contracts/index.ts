import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import SupplyChain from './abis/Admin.json';

export const web3 = new Web3();

export const adminContract = () =>
  new web3.eth.Contract(SupplyChain.output.abi as AbiItem[], '0x5F2A1ac1be1926988A51Ef1ec74A44b4eC448dF2');
