import { CloudQueue } from '@mui/icons-material';
import { TableCell, TableRow, Typography } from '@mui/material';

const TableRowEmpty = ({ visible }: { visible: boolean }) => (
  <>
    {visible && (
      <TableRow>
        <TableCell colSpan={100} className='text-center' style={{ color: '#0008' }}>
          <CloudQueue fontSize='large' />
          <Typography variant='subtitle2'>No Data</Typography>
        </TableCell>
      </TableRow>
    )}
  </>
);

export default TableRowEmpty;
