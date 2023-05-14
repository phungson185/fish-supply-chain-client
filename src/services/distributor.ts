import {
  ConfirmOrderType,
  ConfirmProcessedFishPurchaseOrderType,
  CreateOrderType,
  FishProcessorDistributorOrderPaginateType,
  FishProcessorDistributorOrderParamsType,
  PlaceProcessedFishPurchaseOrderType,
  ReceiveProcessedFishOrderType,
} from 'types/Distributor';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import FishProcessing from '../contracts/abis/FishProcessing.json';
import { client } from './axios';

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// contract methods
const placeProcessedFishPurchaseOrder = async (body: PlaceProcessedFishPurchaseOrderType) => {
  const { Receiver, orderer, quantityoffishpackageordered, fishProcessingContractAddress } = body;
  const processingContract = new web3.eth.Contract(FishProcessing.abi as AbiItem[], fishProcessingContractAddress);
  const result = await processingContract.methods
    .PlaceProcessedFishPurchaseOrder(orderer, quantityoffishpackageordered, Receiver)
    .send({
      from: orderer,
      gas: 3500000,
    });
  return result;
};

const confirmProcessedFishPurchaseOrder = async (body: ConfirmProcessedFishPurchaseOrderType) => {
  const { sender, fishProcessingContractAddress, Accepted, ProcessedFishPurchaseOrderID } = body;
  const processingContract = new web3.eth.Contract(FishProcessing.abi as AbiItem[], fishProcessingContractAddress);
  const result = await processingContract.methods
    .ConfirmProcessedFishPurchaseOrder(ProcessedFishPurchaseOrderID, Accepted)
    .send({
      from: sender,
      gas: 3500000,
    });
  return result;
};

const receiveProcessedFishOrder = async (body: ReceiveProcessedFishOrderType) => {
  const { sender, fishProcessingContractAddress, ProcessedFishPurchaseOrderID } = body;
  const processingContract = new web3.eth.Contract(FishProcessing.abi as AbiItem[], fishProcessingContractAddress);
  const result = await processingContract.methods.ReceiveProcessedFishOrder(ProcessedFishPurchaseOrderID).send({
    from: sender,
    gas: 3500000,
  });
  return result;
};

// api methods
const createOder = async (body: CreateOrderType) => client.post('/distributor/order', body);

const getOrders = async (
  params?: FishProcessorDistributorOrderParamsType,
): Promise<FishProcessorDistributorOrderPaginateType> => client.get('/distributor/orders', { params });

const confirmOrder = async ({ orderId, ...body }: ConfirmOrderType) =>
  client.put(`/distributor/orders/${orderId}/confirm`, body);

export default {
  placeProcessedFishPurchaseOrder,
  confirmProcessedFishPurchaseOrder,
  receiveProcessedFishOrder,

  createOder,
  getOrders,
  confirmOrder,
};
