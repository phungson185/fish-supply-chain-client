import { Check, Close, Done, AccessTime, Schedule } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

export const statusStep = [
  { label: 'Accepted', color: 'green', component: <Check style={{ fontSize: 32, color: '#89C87B' }} /> },
  { label: 'Rejected', color: 'red', component: <Close style={{ fontSize: 32 }} color='error' /> },
  { label: 'Pending', color: 'orange', component: <CircularProgress size={28} /> },
  { label: 'Arrived', color: 'blue', component: <Done /> },
  { label: 'Received', color: 'purple', component: <AccessTime /> },
  { label: 'Updated', color: 'teal', component: <Schedule /> },
];

type ConfirmStatusProps = {
  index: number;
};

const ConfirmStatus = ({ index }: ConfirmStatusProps) => {
  return (
    <div className='flex flex-col items-center gap-10'>
      <div>{statusStep[index].component}</div>
      <div className='font-bold'>{statusStep[index].label}</div>
    </div>
  );
};

export default ConfirmStatus;
