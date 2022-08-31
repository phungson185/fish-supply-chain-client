import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Button,
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Spinner, TableRowEmpty } from 'components';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { profileSelector } from 'reducers/profile';
import { manufacturerService } from 'services';
import ManufacturerPopup from './Popups/ManufacturerPopup';
const ManufacturerView = () => {
  const { address } = useSelector(profileSelector);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { data, isFetching, refetch, isError } = useQuery(['manufacturerService.fetchManufacturers'], () =>
    manufacturerService.fetchManufacturers(),
  );

  const { mutate: deleteManufacturer, isLoading } = useMutation(manufacturerService.deleteManufacturer, {
    onSuccess: () => {
      enqueueSnackbar('Delete manufacturer successfully', { variant: 'success' });
      refetch();
    },
  });

  const handleDeleteManufacturer = (index: string) => {
    deleteManufacturer({ address, index });
  };

  return (
    <>
      <div className='flex justify-end'>
        <Button variant='contained' onClick={() => setOpenCreatePopup(true)}>
          Add manufacturer
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Spinner loading={isFetching}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Manufacturer name</TableCell>
                <TableCell>Logo</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Manufacturer description</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.map(
                  (manufacturer: any) =>
                    manufacturer.manufacturerId !== '0' &&
                    manufacturer.manufacturerId !== undefined && (
                      <TableRow key={manufacturer.manufacturerId}>
                        <TableCell className='text-center'>{manufacturer.manufacturerId}</TableCell>
                        <TableCell className='text-center'>{manufacturer.manufacturerName}</TableCell>
                        <TableCell className='text-center'>
                          <Avatar src={manufacturer.logoImage} className='w-24 h-24' variant='circular' />
                        </TableCell>
                        <TableCell className='text-center'>{manufacturer.manufacturerAddress}</TableCell>
                        <TableCell className='text-center'>
                          <div
                            dangerouslySetInnerHTML={{ __html: manufacturer.manufacturerDescription! }}
                            className='text-editor'
                          />
                        </TableCell>
                        <TableCell className='text-center'>
                          <LoadingButton
                            variant='contained'
                            color='error'
                            loading={isLoading}
                            onClick={() => handleDeleteManufacturer(manufacturer.manufacturerId)}
                          >
                            Delete
                          </LoadingButton>
                        </TableCell>
                      </TableRow>
                    ),
                )}
              <TableRowEmpty visible={!isFetching && data.length === 0} />
            </TableBody>
          </Table>
        </Spinner>
      </TableContainer>

      <Dialog open={openCreatePopup} fullWidth maxWidth='lg'>
        <ManufacturerPopup onClose={() => setOpenCreatePopup(false)} refetch={() => refetch()} />
      </Dialog>
    </>
  );
};

export default ManufacturerView;
