import { CreateOrderType, FishSeedCompanyFishFarmerOrderPaginateType, FishSeedCompanyFishFarmerOrderParamsType, PlaceFishSeedsPurchaseOrderType } from 'types/FishFarmer';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import FarmedFish from '../contracts/abis/FarmedFish.json';
import { client } from './axios';

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const placeFishSeedsPurchaseOrder = async (body: PlaceFishSeedsPurchaseOrderType) => {
  const { FishSeedsPurchaser, FishSeedsSeller, NumberOfFishSeedsOrdered, farmedFishContractAddress } = body;
  const farmedFishContract = new web3.eth.Contract(FarmedFish.abi as AbiItem[], farmedFishContractAddress);
  const result = await farmedFishContract.methods
    .PlaceFishSeedsPurchaseOrder(FishSeedsPurchaser, FishSeedsSeller, NumberOfFishSeedsOrdered)
    .send({
      from: FishSeedsPurchaser,
      gas: 3500000,
    });
  return result;
};

const createOder = async (body: CreateOrderType) => client.post('/fishfarmer/order', body);

const getOrders = async (params?: FishSeedCompanyFishFarmerOrderParamsType): Promise<FishSeedCompanyFishFarmerOrderPaginateType> =>
  client.get('/fishfarmer/orders', { params });
  
export default {
  placeFishSeedsPurchaseOrder,
  createOder,
  getOrders
};
