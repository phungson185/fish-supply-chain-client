import { AccessTime, Person } from '@mui/icons-material';
import { Avatar, Container, Grid, Paper, Typography } from '@mui/material';
import moment from 'moment';
import { RoleType } from 'types/Auth';

type PopupProps = {
  item: any;
};

const BatchComponentInfo = ({ item }: PopupProps) => {
  return (
    <>
      <Container>
        <Paper variant='elevation' elevation={3} className='p-6 pb-24'>
          <Grid container className='relative'>
            <Grid item xs={8}>
              <div className='flex flex-col gap-2 items-start'>
                <Typography variant='subtitle1'>{item?.owner?.role}</Typography>
                <Typography className='text-blue-500'>
                  <Person className='mr-2' />
                  <span>{item?.owner?.address}</span>
                </Typography>
                <Typography className='text-green-500'>
                  <AccessTime className='mr-2' />
                  <span>{moment(item?.updatedAt).format('L')}</span>
                </Typography>
                <div className='mt-6 flex flex-col gap-2 items-start'>
                  <>
                    <Typography variant='subtitle2'>Registration No: {item?.id}</Typography>
                    <Typography variant='subtitle2'>Company name: {item?.owner?.name}</Typography>
                    <Typography variant='subtitle2'>Company phone number: {item?.owner?.phone}</Typography>
                    <Typography variant='subtitle2'>Company address: {item?.owner?.userAddress}</Typography>

                    {item?.owner?.role === RoleType.fishFarmerRole && (
                      <>
                        <Typography variant='subtitle2'>
                          Number of fish seeds ordered: {item?.numberOfFishSeedsOrdered} kg
                        </Typography>
                      </>
                    )}

                    {item?.owner?.role === RoleType.fishProcessorRole && (
                      <>
                        <Typography variant='subtitle2'>Number of fish processed: {item?.numberOfFishOrdered} kg</Typography>
                        <Typography variant='subtitle2'>Catch method: {item?.catchMethod}</Typography>
                        <Typography variant='subtitle2'>Fillets in packet: {item?.filletsInPacket}</Typography>
                        <Typography variant='subtitle2'>Number of packets: {item?.numberOfPackets}</Typography>
                        <Typography variant='subtitle2'>Processor: {item?.fishProcessor?.address}</Typography>
                      </>
                    )}
                  </>
                </div>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className='float-right'>
                <Avatar
                  src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png'
                  sx={{ width: 100, height: 100 }}
                  variant='square'
                />
              </div>
            </Grid>
            <Avatar
              src='https://raw.githubusercontent.com/rwaltzsoftware-org/coffee-supplychain-ui/master/plugins/images/verified.jpg'
              sx={{ width: 100, height: 100, position: 'absolute', bottom: -84, right: 0 }}
              variant='square'
            />
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default BatchComponentInfo;
