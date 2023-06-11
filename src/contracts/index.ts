import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import Registration from './abis/Registration.json';
import { web3 } from 'services';

// bsc testnet

export const registrationContract = () =>
  new web3.eth.Contract(Registration.output.abi as AbiItem[], '0xA31D300fC786B9af33b38C27679d32b7cEDB061A');
