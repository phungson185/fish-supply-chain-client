import { FarmedFishContractType } from 'types/FarmedFish';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import FarmedFish from '../contracts/abis/FarmedFish.json';

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
    AquacultureWatertype,
    Geographicorigin,
    NumberOfFishSeedsavailable,
    Speciesname,
    FishSeedsPCRResultreportId,
    IPFShash,
  } = contract;
  const result = await farmedFishContract
    .deploy({
      data: FarmedFish.data.bytecode.object,
      arguments: [
        registration,
        Speciesname,
        Geographicorigin,
        NumberOfFishSeedsavailable,
        FishSeedsPCRResultreportId,
        AquacultureWatertype,
        IPFShash,
      ],
    })
    .send({
      from: address,
      gas: 3000000,
    });
  return result;
};

export default {
  deployFarmedFishContract,
};
