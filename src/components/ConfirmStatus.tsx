import { Check, Close, Done, AccessTime, Schedule, CheckCircle, HighlightOff } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

export enum ProcessStatus {
  Accepted = 0,
  Rejected = 1,
  Pending = 2,
  Arrived = 3,
  Received = 4,
  Updated = 5,
  Proccessed = 6,
  All = 7,
}

export const statusStep = [
  {
    label: 'Accepted',
    code: 0,
    color: 'green',
    description: <div className='text-green-500'>The seller has accepted the request</div>,
    component: <CheckCircle className='text-green-500 text-2xl' />,
  },
  {
    label: 'Rejected',
    code: 1,
    color: 'red',
    description: <div className='text-red-500'>The seller has declined the request</div>,
    component: <HighlightOff className='text-red-500 text-2xl' style={{ fontSize: 32 }} color='error' />,
  },
  {
    label: 'Pending',
    code: 2,
    color: 'yellow',
    description: <div className='text-yellow-500'>The request is being processed</div>,
    component: <CircularProgress className='text-yellow-500 text-2xl' size={28} />,
  },
  {
    label: 'Arrived',
    code: 3,
    color: 'blue',
    description: <div className='text-blue-500'>The item has arrived at the destination</div>,
    component: <CheckCircle className='text-blue-500 text-2xl' />,
  },
  {
    label: 'Received',
    code: 4,
    color: 'purple',
    description: <div className='text-purple-500'>The item has been received</div>,
    component: <AccessTime className='text-purple-500 text-2xl' />,
  },
  {
    label: 'Updated',
    code: 5,
    color: 'teal',
    description: <div className='text-teal-500'>The status of the request has been updated</div>,
    component: <Schedule />,
  },
  {
    label: 'Processed',
    code: 6,
    color: 'pink',
    description: <div className='text-pink-500'>The request has been processed</div>,
    component: <Done className='text-pink-500 text-2xl' />,
  },
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
