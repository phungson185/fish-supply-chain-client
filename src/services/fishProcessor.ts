import {
  ConfirmFarmedFishPurchaseOrderType,
  ConfirmOrderType,
  CreateOrderType,
  CreateProcesingContractType,
  FishFarmerFishProcessorOrderPaginateType,
  FishFarmerFishProcessorOrderParamsType,
  PlaceFarmedFishPurchaseOrderType,
  ProcessingContractType,
  ProfileInventoryType,
  ReceiveFarmedFishOrderType,
  UpdateFishProcessingContractType,
  UpdateProcessingContractType,
} from 'types/FishProcessor';
import { AbiItem } from 'web3-utils';
import FarmedFish from '../contracts/abis/FarmedFish.json';
import FishProcessing from '../contracts/abis/FishProcessing.json';

import { client } from './axios';
import { ProcessingContractPaginateType, ProcessingContractParamsType } from 'types/FishProcessing';
import { gasPriceWei, web3 } from 'services';

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
      gasPrice: gasPriceWei,
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
      gasPrice: gasPriceWei,
    });
  return result;
};

const receiveFarmedFishOrder = async (body: ReceiveFarmedFishOrderType) => {
  const { sender, farmedFishContractAddress, FarmedFishPurchaseOrderID } = body;
  const farmedFishContract = new web3.eth.Contract(FarmedFish.abi as AbiItem[], farmedFishContractAddress);
  const result = await farmedFishContract.methods.ReceiveFarmedFishOrder(FarmedFishPurchaseOrderID).send({
    from: sender,
    gas: 3500000,
    gasPrice: gasPriceWei,
  });
  return result;
};

const deployFishProcessingContract = async (body: ProcessingContractType) => {
  const {
    sender,
    farmedFishPurchaseOrderID,
    registration,
    dateOfProcessing,
    dateOfExpiry,
    ipfsHash,
    processedSpeciesname,
    filletsInPacket,
    numberOfPackets,
    image,
  } = body;
  const processingContract = new web3.eth.Contract(FishProcessing.abi as AbiItem[], sender);
  const result = await processingContract
    .deploy({
      data: FishProcessing.data.bytecode.object,
      arguments: [
        farmedFishPurchaseOrderID,
        registration,
        processedSpeciesname,
        ipfsHash,
        dateOfProcessing,
        dateOfExpiry,
        filletsInPacket,
        numberOfPackets,
        image,
      ],
    })
    .send({
      from: sender,
      gas: 4000000,
      gasPrice: gasPriceWei,
    });

  return result;
};

const updateFishProcessingContract = async (body: UpdateFishProcessingContractType) => {
  const {
    sender,
    dateOfProcessing,
    dateOfExpiry,
    ipfsHash,
    processedSpeciesname,
    filletsInPacket,
    numberOfPackets,
    image,
    fishProcessingContractAddress,
  } = body;
  const processingContract = new web3.eth.Contract(FishProcessing.abi as AbiItem[], fishProcessingContractAddress);
  const result = await processingContract.methods
    .UpdateFishProcessing(
      processedSpeciesname,
      ipfsHash,
      dateOfProcessing,
      dateOfExpiry,
      filletsInPacket,
      numberOfPackets,
      image,
    )
    .send({
      from: sender,
      gas: 4000000,
      gasPrice: gasPriceWei,
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

const createProcessingContract = async (body: CreateProcesingContractType) =>
  client.post('/fishprocessor/create-processing-contract', body);

const getProcessingContracts = async (params?: ProcessingContractParamsType): Promise<ProcessingContractPaginateType> =>
  client.get('/fishprocessor/get-processing-contracts', { params });

const updateProcessingContract = async ({
  id,
  body,
}: {
  id: string;
  body?: UpdateProcessingContractType;
}): Promise<ProcessingContractPaginateType> => client.put(`/fishprocessor/processing-contract/${id}`, body);

const getProfileInventory = async ({ id }: { id?: string }): Promise<ProfileInventoryType> =>
  client.get(`/fishprocessor/get-profile-inventory/${id}`);
const summaryCommon = async (): Promise<any> => client.get(`/fishprocessor/summaryCommon`);

export default {
  placeFarmedFishPurchaseOrder,
  confirmFarmedFishPurchaseOrder,
  receiveFarmedFishOrder,
  deployFishProcessingContract,
  updateProcessingContract,
  updateFishProcessingContract,

  createOder,
  getOrders,
  confirmOrder,
  createProcessingContract,
  getProcessingContracts,
  getProfileInventory,
  summaryCommon,
};
