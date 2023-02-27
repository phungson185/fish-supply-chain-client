import { BatchPaginateType, BatchParamsType } from 'types/Batch';
import {
  CreateBatchType,
  CreateFarmedFishContractType,
  FarmedFishContractPaginateType,
  FarmedFishContractParamsType,
  FarmedFishContractType,
  FarmedFishType,
} from 'types/FishSeedCompany';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import FarmedFish from '../contracts/abis/FarmedFish.json';
import { client } from './axios';

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const deployFarmedFishContract = async ({
  address,
  contract,
}: {
  address: string;
  contract: FarmedFishContractType;
}) => {
  const farmedFishContract = new web3.eth.Contract(FarmedFish.abi as AbiItem[], address);
  const { registration, AquacultureWatertype, Geographicorigin, NumberOfFishSeedsavailable, Speciesname, IPFShash } =
    contract;
  const result = await farmedFishContract
    .deploy({
      data: FarmedFish.data.bytecode.object,
      arguments: [
        registration,
        Speciesname,
        Geographicorigin,
        NumberOfFishSeedsavailable,
        AquacultureWatertype,
        IPFShash,
      ],
    })
    .send({
      from: address,
      gas: 3500000,
    });
  return result;
};

const createFarmedFishContract = async (body: CreateFarmedFishContractType): Promise<FarmedFishType> =>
  client.post('/fishseedcompany/createFarmedFishContract', body);

const getFarmedFishContracts = async (params?: FarmedFishContractParamsType): Promise<FarmedFishContractPaginateType> =>
  client.get('/fishSeedCompany/contracts', { params });

const createBatch = async (body: CreateBatchType): Promise<any> => client.post('/fishseedcompany/createBatch', body);

const getBatchs = async (params?: BatchParamsType): Promise<BatchPaginateType> => client.get('/batchs', { params });

export default {
  deployFarmedFishContract,
  createFarmedFishContract,
  getFarmedFishContracts,
  createBatch,
  getBatchs,
};
