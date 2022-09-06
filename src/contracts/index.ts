import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import SupplyChain from './abis/Admin.json';

export const web3 = new Web3();

export const adminContract = () =>
  new web3.eth.Contract(SupplyChain.output.abi as AbiItem[], '0x4C1f7ec1bE245F9F3b6d7FccEC05635F88565635');
