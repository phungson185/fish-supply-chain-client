import { registrationContract } from 'contracts';
import { RegistrationType } from 'types/Registration';

const registerFishSeedCompany = (registration: RegistrationType): Promise<any> =>
  registrationContract().methods.RegisterFishSeedCompany(registration.address).send({ from: registration.fda });
const registerFishFarmer = (registration: RegistrationType): Promise<any> =>
  registrationContract().methods.RegisterFishFarmer(registration.address).send({ from: registration.fda });
const registerFishProcessor = (registration: RegistrationType): Promise<any> =>
  registrationContract().methods.RegisterFishProcessor(registration.address).send({ from: registration.fda });
const registerDistributor = (registration: RegistrationType): Promise<any> =>
  registrationContract().methods.RegisterDistributor(registration.address).send({ from: registration.fda });
const registerRetailer = (registration: RegistrationType): Promise<any> =>
  registrationContract().methods.RegisterRetailer(registration.address).send({ from: registration.fda });
const registerConsumer = (registration: RegistrationType): Promise<any> =>
  registrationContract().methods.RegisterConsumer(registration.address).send({ from: registration.fda });
const registerWildCaughtFisher = (registration: RegistrationType): Promise<any> =>
  registrationContract().methods.RegisterWildCaughtFisher(registration.address).send({ from: registration.fda });

export default {
  registerFishSeedCompany,
  registerFishFarmer,
  registerFishProcessor,
  registerDistributor,
  registerRetailer,
  registerConsumer,
  registerWildCaughtFisher,
};
