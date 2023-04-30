import {
    ConfirmOrderType,
  ConfirmRetailerPurchaseOrderType,
  CreateOrderType,
  DistributorRetailerOrderPaginateType,
  DistributorRetailerOrderParamsType,
  PlaceRetailerPurchaseOrderType,
  ReceiveRetailerOrderType,
} from 'types/Retailer';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import FishProcessing from '../contracts/abis/FishProcessing.json';
import { client } from './axios';

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// contract methods
const placeProcessedFishPurchaseOrder = async (body: PlaceRetailerPurchaseOrderType) => {
  const { NumberOfFishPackagesOrdered, ProcessedFishPurchaseOrderID, buyer, fishProcessorContractAddress, seller } =
  body;
  const processingContract = new web3.eth.Contract(FishProcessing.abi as AbiItem[], fishProcessorContractAddress);
  const result = await processingContract.methods
    .PlaceRetailerPurchaseOrder(buyer, seller, ProcessedFishPurchaseOrderID, NumberOfFishPackagesOrdered)
    .send({
      from: buyer,
      gas: 3500000,
    });
  return result;
};

const confirmRetailerPurchaseOrder = async (body: ConfirmRetailerPurchaseOrderType) => {
  const { sender, RetailerPurchaseOrderID, accepted, fishProcessingContractAddress } = body;
  const processingContract = new web3.eth.Contract(FishProcessing.abi as AbiItem[], fishProcessingContractAddress);
  const result = await processingContract.methods.ConfirmRetailerPurchaseOrder(RetailerPurchaseOrderID, accepted).send({
    from: sender,
    gas: 3500000,
  });
  return result;
};

const receiveRetailerOrder = async (body: ReceiveRetailerOrderType) => {
  const { sender, fishProcessingContractAddress, RetailerPurchaseOrderID } = body;
  const processingContract = new web3.eth.Contract(FishProcessing.abi as AbiItem[], fishProcessingContractAddress);
  const result = await processingContract.methods.ReceiveRetailerOrder(RetailerPurchaseOrderID).send({
    from: sender,
    gas: 3500000,
  });
  return result;
};

// api methods
const createOder = async (body: CreateOrderType) => client.post('/retailer/order', body);

const getOrders = async (params?: DistributorRetailerOrderParamsType): Promise<DistributorRetailerOrderPaginateType> =>
  client.get('/retailer/orders', { params });

const confirmOrder = async ({ orderId, ...body }: ConfirmOrderType) =>
  client.put(`/retailer/orders/${orderId}/confirm`, body);

export default {
  placeProcessedFishPurchaseOrder,
  confirmRetailerPurchaseOrder,
  receiveRetailerOrder,

  createOder,
  getOrders,
  confirmOrder,
};