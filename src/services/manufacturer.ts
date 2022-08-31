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

const fetchManufacturers = (): Promise<any> => adminContract().methods.fetchManufacturers().call();
const deleteManufacturer = ({ address, index }: { address: string; index: string }): Promise<any> =>
  adminContract().methods.deleteManufacturer(index).send({ from: address });

export default {
  addManufacturer,
  fetchManufacturers,
  deleteManufacturer,
};
