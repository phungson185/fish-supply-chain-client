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
  TableRow
} from '@mui/material';
import { Spinner } from 'components';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { manufacturerService } from 'services';
import ManufacturerPopup from './Popups/ManufacturerPopup';
const ManufacturerView = () => {
  const [openCreatePopup, setOpenCreatePopup] = useState(false);

  const { data, isFetching, refetch, isError } = useQuery(['manufacturerService.fetchManufacturers'], () =>
    manufacturerService.fetchManufacturers(),
  );

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
                <TableCell>Manufacturer name</TableCell>
                <TableCell>Logo</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Manufacturer description</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.map((manufacturer: any) => (
                  <TableRow key={manufacturer.manufacturerAddress}>
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
                      <LoadingButton variant='contained' color='error'>
                        Delete
                      </LoadingButton>
                    </TableCell>
                  </TableRow>
                ))}
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
