import { CheckCircle } from '@mui/icons-material';
import { Timeline, TimelineConnector, TimelineContent, TimelineItem, TimelineSeparator } from '@mui/lab';
import { Typography } from '@mui/material';
import moment from 'moment';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { batchService } from 'services';
import { BatchType } from 'types/Batch';
import { BatchComponentInfo } from './components';

const BatchDetailPopup = () => {
  const params = useParams();
  const { data: item, isSuccess } = useQuery(['batchService.getBatch', { id: params.id }], () =>
    batchService.getBatchById({ id: params.id as string }),
  ) as { data: BatchType; isSuccess: boolean };

  if (!isSuccess) return <></>;

  return (
    <>
      <div className='flex flex-col gap-1'>
        <Typography variant='h3'>Batch Progress</Typography>
        <Typography variant='caption'>Batch No: {item.id}</Typography>
        <Typography variant='caption'>Updated time: {moment(item.updatedAt).format('L')}</Typography>
      </div>
      <Timeline position='alternate' onResize={undefined} onResizeCapture={undefined}>
        {Object.entries(item).map(
          ([key, value], index) =>
            !['id', 'type', 'createdAt', 'updatedAt'].includes(key) && (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <CheckCircle className='text-6xl' color='primary' />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <BatchComponentInfo item={value} />
                </TimelineContent>
              </TimelineItem>
            ),
        )}
      </Timeline>
    </>
  );
};

export default BatchDetailPopup;
