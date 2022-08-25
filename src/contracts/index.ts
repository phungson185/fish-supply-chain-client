import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import ERC20 from './abis/ERC20.json';
import ERC721 from './abis/ERC721.json';

export const web3 = new Web3();

export const erc20Contract = (address: string) => new web3.eth.Contract(ERC20.abi as AbiItem[], address);
export const erc721Contract = (address: string) => new web3.eth.Contract(ERC721.abi as AbiItem[], address);
