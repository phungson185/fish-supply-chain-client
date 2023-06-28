import {
  ConfirmFishSeedsPurchaseOrderType,
  ConfirmOrderType,
  CreateOrderType,
  FishSeedCompanyFishFarmerOrderPaginateType,
  FishSeedCompanyFishFarmerOrderParamsType,
  FishSeedCompanyFishFarmerOrderType,
  PlaceFishSeedsPurchaseOrderType,
  ReceiveFishSeedsOrderType,
  SummaryParamsType,
  UpdateFarmedFishGrowthDetailsType,
  UpdateGrowthDetailType,
} from 'types/FishFarmer';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import FarmedFish from '../contracts/abis/FarmedFish.json';
import { client } from './axios';
import { gasPriceWei, web3 } from 'services';

// contract methods
const placeFishSeedsPurchaseOrder = async (body: PlaceFishSeedsPurchaseOrderType) => {
  const { FishSeedsPurchaser, FishSeedsSeller, NumberOfFishSeedsOrdered, farmedFishContractAddress } = body;
  const farmedFishContract = new web3.eth.Contract(FarmedFish.abi as AbiItem[], farmedFishContractAddress);
  const result = await farmedFishContract.methods
    .PlaceFishSeedsPurchaseOrder(FishSeedsPurchaser, FishSeedsSeller, NumberOfFishSeedsOrdered)
    .send({
      from: FishSeedsPurchaser,
      gas: 3500000,
      gasPrice: gasPriceWei,
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
      gasPrice: gasPriceWei,
    });
  return result;
};

const receiveFishSeedsOrder = async (body: ReceiveFishSeedsOrderType) => {
  const { sender, FishSeedsPurchaseOrderID, farmedFishContractAddress } = body;
  const farmedFishContract = new web3.eth.Contract(FarmedFish.abi as AbiItem[], farmedFishContractAddress);
  const result = await farmedFishContract.methods.ReceiveFishSeedsOrder(FishSeedsPurchaseOrderID).send({
    from: sender,
    gas: 3500000,
    gasPrice: gasPriceWei,
  });
  return result;
};

const updateFarmedFishGrowthDetails = async (body: UpdateFarmedFishGrowthDetailsType) => {
  const {
    farmedFishContractAddress,
    FarmedFishGrowthDetailsUploader,
    FishWeight,
    TotalNumberOfFish,
    WaterTemperature,
    Image,
    IPFShash,
  } = body;
  const farmedFishContract = new web3.eth.Contract(FarmedFish.abi as AbiItem[], farmedFishContractAddress);
  const result = await farmedFishContract.methods
    .UpdateFarmedFishGrowthDetails(
      FarmedFishGrowthDetailsUploader,
      FishWeight,
      TotalNumberOfFish,
      WaterTemperature,
      Image,
      IPFShash,
    )
    .send({
      from: FarmedFishGrowthDetailsUploader,
      gas: 3500000,
      gasPrice: gasPriceWei,
    });
  return result;
};

// api methods
const createOder = async (body: CreateOrderType) => client.post('/fishfarmer/order', body);

const getOrder = async ({ id }: { id: string }): Promise<FishSeedCompanyFishFarmerOrderType> =>
  client.get(`/fishfarmer/order/${id}`);

const getOrders = async (
  params?: FishSeedCompanyFishFarmerOrderParamsType,
): Promise<FishSeedCompanyFishFarmerOrderPaginateType> => client.get('/fishfarmer/orders', { params });

const confirmOrder = async ({ orderId, ...body }: ConfirmOrderType) =>
  client.put(`/fishfarmer/orders/${orderId}/confirm`, body);

const updateGrowthDetail = async ({ orderId, ...body }: UpdateGrowthDetailType) =>
  client.put(`/fishfarmer/updateGrowthDetails/${orderId}`, body);
const summaryCommon = async (): Promise<any> => client.get(`/fishfarmer/summaryCommon`);
const summaryMostOrder = async (params: SummaryParamsType): Promise<any> =>
  client.get(`/fishfarmer/summaryMostOrder/${params.geographicOrigin}/${params.methodOfReproduction}`);

export default {
  placeFishSeedsPurchaseOrder,
  confirmFishSeedsPurchaseOrder,
  receiveFishSeedsOrder,
  updateFarmedFishGrowthDetails,

  confirmOrder,
  createOder,
  getOrder,
  getOrders,
  updateGrowthDetail,
  summaryCommon,
  summaryMostOrder,
};
