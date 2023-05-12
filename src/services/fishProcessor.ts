import {
  ConfirmFarmedFishPurchaseOrderType,
  ConfirmOrderType,
  CreateOrderType,
  CreateProcesingContractType,
  FishFarmerFishProcessorOrderPaginateType,
  FishFarmerFishProcessorOrderParamsType,
  PlaceFarmedFishPurchaseOrderType,
  ProcessingContractType,
  ReceiveFarmedFishOrderType,
} from 'types/FishProcessor';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import FarmedFish from '../contracts/abis/FarmedFish.json';
import FishProcessing from '../contracts/abis/FishProcessing.json';

import { client } from './axios';

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// contract methods
const placeFarmedFishPurchaseOrder = async (body: PlaceFarmedFishPurchaseOrderType) => {
  const {
    FarmedFishPurchaser,
    FarmedFishSeller,
    NumberOfFishOrdered,
    farmedFishContractAddress,
    FarmedFishGrowthDetailsID,
  } = body;
  const farmedFishContract = new web3.eth.Contract(FarmedFish.abi as AbiItem[], farmedFishContractAddress);
  const result = await farmedFishContract.methods
    .PlaceFarmedFishPurchaseOrder(FarmedFishGrowthDetailsID, FarmedFishPurchaser, NumberOfFishOrdered, FarmedFishSeller)
    .send({
      from: FarmedFishPurchaser,
      gas: 3500000,
    });
  return result;
};

const confirmFarmedFishPurchaseOrder = async (body: ConfirmFarmedFishPurchaseOrderType) => {
  const { sender, farmedFishContractAddress, Accepted, FarmedFishPurchaseOrderID, FarmedFishGrowthDetailsID } = body;
  const farmedFishContract = new web3.eth.Contract(FarmedFish.abi as AbiItem[], farmedFishContractAddress);
  const result = await farmedFishContract.methods
    .ConfirmFarmedFishPurchaseOrder(FarmedFishPurchaseOrderID, FarmedFishGrowthDetailsID, Accepted)
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

const deployFishProcessingContract = async (body: ProcessingContractType) => {
  const {
    sender,
    registration,
    dateOfProcessing,
    ipfsHash,
    processedSpeciesname,
    catchMethod,
    filletsInPacket,
    numberOfPackets,
  } = body;
  const processingContract = new web3.eth.Contract(FishProcessing.abi as AbiItem[], sender);
  const result = await processingContract
    .deploy({
      data: FishProcessing.data.bytecode.object,
      arguments: [
        registration,
        processedSpeciesname,
        ipfsHash,
        dateOfProcessing,
        catchMethod,
        filletsInPacket,
        numberOfPackets,
      ],
    })
    .send({
      from: sender,
      gas: 3500000,
    });

  return result;
};

const getProcessedFishPackageID = async (processingContractAddress: string) => {
  const processingContract = new web3.eth.Contract(FishProcessing.abi as AbiItem[], processingContractAddress);
  const result = await processingContract.methods.GetProcessedFishPackageID().call();
  return result;
};

// api methods
const createOder = async (body: CreateOrderType) => client.post('/fishprocessor/order', body);

const getOrders = async (
  params?: FishFarmerFishProcessorOrderParamsType,
): Promise<FishFarmerFishProcessorOrderPaginateType> => client.get('/fishprocessor/orders', { params });

const confirmOrder = async ({ orderId, ...body }: ConfirmOrderType) =>
  client.put(`/fishprocessor/orders/${orderId}/confirm`, body);

const createProcessingContract = async (body: CreateProcesingContractType) =>
  client.post('/fishprocessor/createProcessingContract', body);

export default {
  placeFarmedFishPurchaseOrder,
  confirmFarmedFishPurchaseOrder,
  receiveFarmedFishOrder,
  deployFishProcessingContract,
  getProcessedFishPackageID,

  createOder,
  getOrders,
  confirmOrder,
  createProcessingContract,
};
