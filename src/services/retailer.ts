import {
  ConfirmOrderType,
  ConfirmRetailerPurchaseOrderType,
  CreateOrderType,
  DistributorRetailerOrderPaginateType,
  DistributorRetailerOrderParamsType,
  PlaceRetailerPurchaseOrderType,
  ProfileInventoryType,
  ReceiveRetailerOrderType,
  UpdateNumberOfProductType,
  UpdateOrderType,
} from 'types/Retailer';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import FishProcessing from '../contracts/abis/FishProcessing.json';
import { client } from './axios';
import { gasPriceWei, web3 } from 'services';

// contract methods
const placeRetailerPurchaseOrder = async (body: PlaceRetailerPurchaseOrderType) => {
  const { NumberOfFishPackagesOrdered, ProcessedFishPurchaseOrderID, buyer, fishProcessingContractAddress, seller } =
    body;
  const processingContract = new web3.eth.Contract(FishProcessing.abi as AbiItem[], fishProcessingContractAddress);
  const result = await processingContract.methods
    .PlaceRetailerPurchaseOrder(buyer, seller, ProcessedFishPurchaseOrderID, NumberOfFishPackagesOrdered)
    .send({
      from: buyer,
      gas: 3500000,
      gasPrice: gasPriceWei,
    });
  return result;
};

const confirmRetailerPurchaseOrder = async (body: ConfirmRetailerPurchaseOrderType) => {
  const { sender, RetailerPurchaseOrderID, accepted, fishProcessingContractAddress, ProcessedFishPurchaseOrderID } =
    body;
  const processingContract = new web3.eth.Contract(FishProcessing.abi as AbiItem[], fishProcessingContractAddress);
  const result = await processingContract.methods
    .ConfirmRetailerPurchaseOrder(RetailerPurchaseOrderID, ProcessedFishPurchaseOrderID, accepted)
    .send({
      from: sender,
      gas: 3500000,
      gasPrice: gasPriceWei,
    });
  return result;
};

const receiveRetailerOrder = async (body: ReceiveRetailerOrderType) => {
  const { sender, fishProcessingContractAddress, RetailerPurchaseOrderID } = body;
  const processingContract = new web3.eth.Contract(FishProcessing.abi as AbiItem[], fishProcessingContractAddress);
  const result = await processingContract.methods.ReceiveRetailerOrder(RetailerPurchaseOrderID).send({
    from: sender,
    gas: 3500000,
    gasPrice: gasPriceWei,
  });
  return result;
};

const updateNumberOfProduct = async (body: UpdateNumberOfProductType) => {
  const { sender, RetailerPurchaseOrderID, NumberOfFishPackage, fishProcessingContractAddress } = body;
  const processingContract = new web3.eth.Contract(FishProcessing.abi as AbiItem[], fishProcessingContractAddress);
  const result = await processingContract.methods
    .UpdateQuantityOfProduct(RetailerPurchaseOrderID, NumberOfFishPackage)
    .send({
      from: sender,
      gas: 3500000,
      gasPrice: gasPriceWei,
    });
  return result;
};

// api methods
const createOder = async (body: CreateOrderType) => client.post('/retailer/order', body);

const getOrders = async (params?: DistributorRetailerOrderParamsType): Promise<DistributorRetailerOrderPaginateType> =>
  client.get('/retailer/orders', { params });

const confirmOrder = async ({ orderId, ...body }: ConfirmOrderType) =>
  client.put(`/retailer/orders/${orderId}/confirm`, body);

const updateOrder = async ({ orderId, ...body }: UpdateOrderType) =>
  client.put(`/retailer/orders/${orderId}/update`, body);

const getProfileInventory = async ({ id }: { id?: string }): Promise<ProfileInventoryType> =>
  client.get(`/retailer/get-profile-inventory/${id}`);
const summaryCommon = async (): Promise<any> => client.get(`/retailer/summaryCommon`);

const updateQuantityProduct = async (body: { orderId: string; quantity: number }) =>
  client.put(`/retailer/update-number-of-product`, body);

export default {
  placeRetailerPurchaseOrder,
  confirmRetailerPurchaseOrder,
  receiveRetailerOrder,
  updateNumberOfProduct,

  createOder,
  getOrders,
  confirmOrder,
  updateOrder,
  getProfileInventory,
  summaryCommon,
  updateQuantityProduct,
};
