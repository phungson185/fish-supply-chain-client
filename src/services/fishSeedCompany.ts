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
} from 'types/FishSeedCompany';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import FarmedFish from '../contracts/abis/FarmedFish.json';
import { client } from './axios';
import { FishSeedPaginateType } from 'types/FishSeedCompany';

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

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
const getFarmedFishContract = async (id: string): Promise<FarmedFishType> =>
  client.get(`/fishSeedCompany/contract/${id}`);
const createBatch = async (body: CreateBatchType): Promise<any> => client.post('/fishseedcompany/createBatch', body);
const getBatchs = async (params?: BatchParamsType): Promise<BatchPaginateType> => client.get('/batchs', { params });

const handleMapGeographicOrigin = (geographicOrigin: number) => {
  switch (geographicOrigin) {
    case 0:
      return 'Brackish';
    case 1:
      return 'Fresh';
    case 2:
      return 'Marine';
    default:
      return 'Not Found';
  }
};

const handleMapMethodOfReproduction = (methodOfReproduction: number) => {
  switch (methodOfReproduction) {
    case 0:
      return 'Natural';
    case 1:
      return 'Artifical';
    default:
      return 'Not Found';
  }
};

export default {
  deployFarmedFishContract,
  createFarmedFishContract,
  getFarmedFishContracts,
  getFarmedFishContract,
  createBatch,
  getBatchs,
  addFishSeed,
  getFishSeeds,
  getFishSeed,
  updateFishSeed,
  handleMapGeographicOrigin,
  handleMapMethodOfReproduction,
};
