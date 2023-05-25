import Web3 from 'web3';

export { default as queryClient } from './client';
export { default as authService } from './auth';
export { default as walletService } from './wallet';
export { default as registrationService } from './registration';
export { default as fishSeedCompanyService } from './fishSeedCompany';
export { default as fishFarmerService } from './fishFarmer';
export { default as fishProcessorService } from './fishProcessor';
export { default as distributorService } from './distributor';
export { default as retailerService } from './retailer';
export { default as systemService } from './system';
export { default as fileService } from './file';
export { default as userService } from './user';
export { default as batchService } from './batch';
export { default as logService } from './log';

export const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
