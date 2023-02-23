import {
  ConfirmFarmedFishPurchaseOrderType,
  ConfirmOrderType,
  CreateOrderType,
  FishFarmerFishProcessorOrderPaginateType,
  FishFarmerFishProcessorOrderParamsType,
  PlaceFarmedFishPurchaseOrderType,
  ReceiveFarmedFishOrderType,
} from 'types/FishProcessor';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import FarmedFish from '../contracts/abis/FarmedFish.json';
import { client } from './axios';

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// contract methods
const placeFarmedFishPurchaseOrder = async (body: PlaceFarmedFishPurchaseOrderType) => {
  const { FarmedFishPurchaser, FarmedFishSeller, NumberOfFishOrdered, speciesname, farmedFishContractAddress } = body;
  const farmedFishContract = new web3.eth.Contract(FarmedFish.abi as AbiItem[], farmedFishContractAddress);
  const result = await farmedFishContract.methods
    .PlaceFarmedFishPurchaseOrder(FarmedFishPurchaser, NumberOfFishOrdered, speciesname, FarmedFishSeller)
    .send({
      from: FarmedFishPurchaser,
      gas: 3500000,
    });
  return result;
};

const confirmFarmedFishPurchaseOrder = async (body: ConfirmFarmedFishPurchaseOrderType) => {
  const { sender, farmedFishContractAddress, Accepted, FarmedFishPurchaseOrderID } = body;
  const farmedFishContract = new web3.eth.Contract(FarmedFish.abi as AbiItem[], farmedFishContractAddress);
  const result = await farmedFishContract.methods
    .ConfirmFarmedFishPurchaseOrder(FarmedFishPurchaseOrderID, Accepted)
    .send({
      from: sender,
      gas: 3500000,
    });
  return result;
};

const receiveFarmedFishOrder = async (body: ReceiveFarmedFishOrderType) => {
  const { sender, farmedFishContractAddress, FarmedFishPurchaseOrderID } = body;
  const farmedFishContract = new web3.eth.Contract(FarmedFish.abi as AbiItem[], farmedFishContractAddress);
  const result = await farmedFishContract.methods.ReceiveFarmedFishOrder(FarmedFishPurchaseOrderID).send({
    from: sender,
    gas: 3500000,
  });
  return result;
};

// api methods
const createOder = async (body: CreateOrderType) => client.post('/fishprocessor/order', body);

const getOrders = async (
  params?: FishFarmerFishProcessorOrderParamsType,
): Promise<FishFarmerFishProcessorOrderPaginateType> => client.get('/fishprocessor/orders', { params });

const confirmOrder = async ({ orderId, ...body }: ConfirmOrderType) =>
  client.put(`/fishprocessor/orders/${orderId}/confirm`, body);

// const updateGrowthDetail = async ({ orderId, ...body }: UpdateGrowthDetailType) =>
//   client.put(`/fishfarmer/updateGrowthDetails/${orderId}`, body);

export default {
  placeFarmedFishPurchaseOrder,
  confirmFarmedFishPurchaseOrder,
  receiveFarmedFishOrder,

  createOder,
  getOrders,
  confirmOrder,
};
