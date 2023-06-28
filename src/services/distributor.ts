import {
  ConfirmOrderType,
  ConfirmProcessedFishPurchaseOrderType,
  CreateOrderType,
  FishProcessorDistributorOrderPaginateType,
  FishProcessorDistributorOrderParamsType,
  PlaceProcessedFishPurchaseOrderType,
  ProfileInventoryType,
  ReceiveProcessedFishOrderType,
  UpdateOrderType,
} from 'types/Distributor';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import FishProcessing from '../contracts/abis/FishProcessing.json';
import { client } from './axios';
import { gasPriceWei, web3 } from 'services';

// contract methods
const placeProcessedFishPurchaseOrder = async (body: PlaceProcessedFishPurchaseOrderType) => {
  const { Receiver, orderer, quantityoffishpackageordered, fishProcessingContractAddress } = body;
  const processingContract = new web3.eth.Contract(FishProcessing.abi as AbiItem[], fishProcessingContractAddress);
  const result = await processingContract.methods
    .PlaceProcessedFishPurchaseOrder(orderer, quantityoffishpackageordered, Receiver)
    .send({
      from: orderer,
      gas: 3500000,
      gasPrice: gasPriceWei,
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
      gasPrice: gasPriceWei,
    });
  return result;
};

const receiveProcessedFishOrder = async (body: ReceiveProcessedFishOrderType) => {
  const { sender, fishProcessingContractAddress, ProcessedFishPurchaseOrderID } = body;
  const processingContract = new web3.eth.Contract(FishProcessing.abi as AbiItem[], fishProcessingContractAddress);
  const result = await processingContract.methods.ReceiveProcessedFishOrder(ProcessedFishPurchaseOrderID).send({
    from: sender,
    gas: 3500000,
    gasPrice: gasPriceWei,
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

const updateOrder = async ({ orderId, ...body }: UpdateOrderType) =>
  client.put(`/distributor/orders/${orderId}/update`, body);

const getProfileInventory = async ({ id }: { id?: string }): Promise<ProfileInventoryType> =>
  client.get(`/distributor/get-profile-inventory/${id}`);
const summaryCommon = async (): Promise<any> => client.get(`/distributor/summaryCommon`);

export default {
  placeProcessedFishPurchaseOrder,
  confirmProcessedFishPurchaseOrder,
  receiveProcessedFishOrder,
  getProfileInventory,

  createOder,
  getOrders,
  confirmOrder,
  updateOrder,
  summaryCommon,
};
