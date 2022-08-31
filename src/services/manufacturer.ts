import { adminContract } from 'contracts';
import { ManufacturerType } from 'types/Manufacturer';

const addManufacturer = ({ address, ...params }: ManufacturerType): Promise<any> =>
  adminContract()
    .methods.addManufacturer(
      params.manufacturerAddress,
      params.manufacturerName,
      params.manufacturerDescription,
      params.logoImage,
    )
    .send({ from: address });

const fetchManufacturers = (): Promise<any> => adminContract().methods.fetchManufacturer().call();

export default {
  addManufacturer,
  fetchManufacturers,
};
