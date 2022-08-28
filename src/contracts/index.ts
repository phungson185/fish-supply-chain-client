import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import SupplyChain from './abis/SupplyChain.json';

export const web3 = new Web3();

export const supplyChainContract = () =>
  new web3.eth.Contract(SupplyChain.output.abi as AbiItem[], '0x9A37bD9a168B9a62c4A1052d445eEaC7dABe17a0');
