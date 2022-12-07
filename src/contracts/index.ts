import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import Registration from './abis/Registration.json';

export const web3 = new Web3();

export const registrationContract = () =>
  new web3.eth.Contract(Registration.output.abi as AbiItem[], '0xE4EF29C86dA632547fF350095aaA27E1824cFe2B');
