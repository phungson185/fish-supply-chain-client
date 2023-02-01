import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import Registration from './abis/Registration.json';

export const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

export const registrationContract = () =>
  new web3.eth.Contract(Registration.output.abi as AbiItem[], '0xfb277a5cada1b4082ec1e921f90978a2563e5c06');
