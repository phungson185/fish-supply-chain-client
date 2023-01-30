import {
  ConfirmFishSeedsPurchaseOrderType,
  ConfirmOrderType,
  CreateOrderType,
  FishSeedCompanyFishFarmerOrderPaginateType,
  FishSeedCompanyFishFarmerOrderParamsType,
  PlaceFishSeedsPurchaseOrderType,
  ReceiveFishSeedsOrderType,
} from 'types/FishFarmer';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import FarmedFish from '../contracts/abis/FarmedFish.json';
import { client } from './axios';

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// contract methods
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

const confirmFishSeedsPurchaseOrder = async (body: ConfirmFishSeedsPurchaseOrderType) => {
  const { sender, FishSeedsPurchaseOrderID, accepted, farmedFishContractAddress } = body;
  const farmedFishContract = new web3.eth.Contract(FarmedFish.abi as AbiItem[], farmedFishContractAddress);
  const result = await farmedFishContract.methods
    .ConfirmFishSeedsPurchaseOrder(FishSeedsPurchaseOrderID, accepted)
    .send({
      from: sender,
      gas: 3500000,
    });
  return result;
};

const receiveFishSeedsOrder = async (body: ReceiveFishSeedsOrderType) => {
  const { sender, FishSeedsPurchaseOrderID, farmedFishContractAddress } = body;
  console.log(FishSeedsPurchaseOrderID, farmedFishContractAddress);
  const farmedFishContract = new web3.eth.Contract(FarmedFish.abi as AbiItem[], farmedFishContractAddress);
  const result = await farmedFishContract.methods.ReceiveFishSeedsOrder(FishSeedsPurchaseOrderID).send({
    from: sender,
    gas: 3500000,
  });
  return result;
};

// api methods
const createOder = async (body: CreateOrderType) => client.post('/fishfarmer/order', body);

const getOrders = async (
  params?: FishSeedCompanyFishFarmerOrderParamsType,
): Promise<FishSeedCompanyFishFarmerOrderPaginateType> => client.get('/fishfarmer/orders', { params });

const confirmOrder = async ({ orderId, ...body }: ConfirmOrderType) =>
  client.put(`/fishfarmer/orders/${orderId}/confirm`, body);

export default {
  placeFishSeedsPurchaseOrder,
  confirmFishSeedsPurchaseOrder,
  receiveFishSeedsOrder,

  confirmOrder,
  createOder,
  getOrders,
};
