import { BatchPaginateType, BatchParamsType } from 'types/Batch';
import {
  AddFishSeedType,
  CreateBatchType,
  CreateFarmedFishContractType,
  FarmedFishContractPaginateType,
  FarmedFishContractParamsType,
  FarmedFishContractType,
  FarmedFishType,
  FishSeedParamsType,
  FishSeedType,
  SummaryParamsType,
  UpdateFarmedFishContractType,
  UpdateFarmedFishType,
} from 'types/FishSeedCompany';
import { AbiItem } from 'web3-utils';
import FarmedFish from '../contracts/abis/FarmedFish.json';
import { client } from './axios';
import { FishSeedPaginateType } from 'types/FishSeedCompany';
import { gasPriceWei, web3 } from 'services';

const deployFarmedFishContract = async ({
  address,
  contract,
}: {
  address: string;
  contract: FarmedFishContractType;
}) => {
  const farmedFishContract = new web3.eth.Contract(FarmedFish.abi as AbiItem[], address);
  const {
    registration,
    Geographicorigin,
    NumberOfFishSeedsavailable,
    Speciesname,
    IPFShash,
    Images,
    MethodOfReproduction,
    WaterTemperature,
  } = contract;
  const result = await farmedFishContract
    .deploy({
      data: FarmedFish.data.bytecode.object,
      arguments: [
        registration,
        Speciesname,
        Geographicorigin,
        NumberOfFishSeedsavailable,
        IPFShash,
        MethodOfReproduction,
        Images,
        WaterTemperature,
      ],
    })
    .send({
      from: address,
      gas: 4000000,
      gasPrice: gasPriceWei,
    });
  return result;
};

const updateFarmedfishContract = async (body: UpdateFarmedFishContractType) => {
  const {
    FarmedFishContract,
    FishSeedUploader,
    Geographicorigin,
    Images,
    MethodOfReproduction,
    NumberOfFishSeedsavailable,
    Speciesname,
    WaterTemperature,
    IPFShash,
  } = body;
  const farmedFishContract = new web3.eth.Contract(FarmedFish.abi as AbiItem[], FarmedFishContract);
  const result = await farmedFishContract.methods
    .UpdateFishSeed(
      FishSeedUploader,
      Speciesname,
      Geographicorigin,
      NumberOfFishSeedsavailable,
      IPFShash,
      MethodOfReproduction,
      Images,
      WaterTemperature,
    )
    .send({
      from: FishSeedUploader,
      gas: 3500000,
      gasPrice: gasPriceWei,
    });
  return result;
};

const addFishSeed = async (body: AddFishSeedType): Promise<any> => client.post('/fishseedcompany/addFishSeed', body);
const getFishSeeds = async (params?: FishSeedParamsType): Promise<FishSeedPaginateType> =>
  client.get('/fishSeedCompany/getFishSeeds', { params });
const getFishSeed = ({ id }: { id: string }): Promise<FishSeedType> => client.get(`/fishseedcompany/getFishSeed/${id}`);
const updateFishSeed = ({ id, body }: { id: string; body: AddFishSeedType }): Promise<FishSeedType> =>
  client.put(`/fishseedcompany/updateFishSeed/${id}`, body);

const createFarmedFishContract = async (body: CreateFarmedFishContractType): Promise<FarmedFishType> =>
  client.post('/fishseedcompany/createFarmedFishContract', body);
const getFarmedFishContracts = async (params?: FarmedFishContractParamsType): Promise<FarmedFishContractPaginateType> =>
  client.get('/fishSeedCompany/contracts', { params });
const getFarmedFishContract = async ({ id }: { id: string }): Promise<FarmedFishType> =>
  client.get(`/fishSeedCompany/contract/${id}`);
const updateFarmedFishContract = async ({
  id,
  body,
}: {
  id: string;
  body: UpdateFarmedFishType;
}): Promise<FarmedFishType> => client.put(`/fishSeedCompany/contract/${id}`, body);
const createBatch = async (body: CreateBatchType): Promise<any> => client.post('/fishseedcompany/createBatch', body);
const getBatchs = async (params?: BatchParamsType): Promise<BatchPaginateType> => client.get('/batchs', { params });
const summaryCommon = async (): Promise<any> => client.get(`/fishSeedCompany/summaryCommon`);
const summaryMostOrder = async (params: SummaryParamsType): Promise<any> =>
  client.get(`/fishSeedCompany/summaryMostOrder/${params.geographicOrigin}/${params.methodOfReproduction}`);

const handleMapGeographicOrigin = (geographicOrigin: number) => {
  switch (geographicOrigin) {
    case 0:
      return {
        label: 'Brackish',
        color: 'primary',
      };
    case 1:
      return {
        label: 'Fresh',
        color: 'secondary',
      };
    case 2:
      return {
        label: 'Marine',
        color: 'info',
      };
    default:
      return {
        label: 'Not Found',
        color: 'error',
      };
  }
};

const handleMapMethodOfReproduction = (methodOfReproduction: number) => {
  switch (methodOfReproduction) {
    case 0:
      return {
        label: 'Natural',
        color: 'warning',
      };
    case 1:
      return {
        label: 'Artificial',
        color: 'success',
      };
    default:
      return {
        label: 'Not Found',
        color: 'error',
      };
  }
};

export default {
  deployFarmedFishContract,
  createFarmedFishContract,
  getFarmedFishContracts,
  getFarmedFishContract,
  updateFarmedfishContract,
  updateFarmedFishContract,
  createBatch,
  getBatchs,
  addFishSeed,
  getFishSeeds,
  getFishSeed,
  updateFishSeed,
  handleMapGeographicOrigin,
  handleMapMethodOfReproduction,
  summaryCommon,
  summaryMostOrder,
};
