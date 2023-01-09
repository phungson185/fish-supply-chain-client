import { Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Spinner } from 'components';

const Batch = () => {
  return (
    <>
      <TableContainer component={Paper}>
        <Spinner>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Contract address</TableCell>
                <TableCell>Fish seed company</TableCell>
                <TableCell>Fish farmer</TableCell>
                <TableCell>Fish processor</TableCell>
                <TableCell>Contributor</TableCell>
                <TableCell>Retailer</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {items.map((item) => ( */}
              <TableRow>
                <TableCell align='center'>0x070cf773ed3f54ec95759efc5425a4c0d75b9d88</TableCell>
                <TableCell align='center'>
                  <Chip color='primary' label='Completed' style={{color: '#FFF'}}/>
                </TableCell>
                <TableCell align='center'>
                  <Chip color='warning' label='Processing' style={{color: '#FFF'}}/>
                </TableCell>
                <TableCell align='center'>
                  <Chip color='error' label='Not available' style={{color: '#FFF'}} />
                </TableCell>
                <TableCell align='center'>
                  <Chip label='Chip Filled' />
                </TableCell>
                <TableCell align='center'>
                  <Chip label='Chip Filled' />
                </TableCell>
              </TableRow>
              {/* ))} */}
              {/* <TableRowEmpty visible={!isFetching && items.length === 0} /> */}
            </TableBody>
            {/* <caption className='font-bold border-t'>{total ?? 0} Contracts</caption> */}
          </Table>
        </Spinner>
      </TableContainer>
    </>
  );
};

export default Batch;
