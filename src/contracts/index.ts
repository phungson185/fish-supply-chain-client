import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import SupplyChain from './abis/Admin.json';

export const web3 = new Web3();

export const adminContract = () =>
  new web3.eth.Contract(SupplyChain.output.abi as AbiItem[], '0x0EB464e1F43a20ef289bd0b1824474EC04987109');
