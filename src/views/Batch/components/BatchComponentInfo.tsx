import {
  AccessTime,
  CalendarMonth,
  DeviceThermostat,
  Inventory2,
  Person,
  Phishing,
  SetMeal,
} from '@mui/icons-material';
import { Avatar, Chip, Container, Grid, Paper, Typography } from '@mui/material';
import moment from 'moment';
import { fishSeedCompanyService } from 'services';
import { RoleType } from 'types/Auth';
import { formatTime, formatTimeDate } from 'utils/common';

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
                <Typography variant='h2'>{item?.owner?.role}</Typography>
                <Typography className='text-blue-500 flex items-center'>
                  <Person className='mr-2' />
                  <span>{item?.owner?.address}</span>
                </Typography>
                <Typography className='text-green-500 flex items-center'>
                  <AccessTime className='mr-2' />
                  <span>{formatTime(item?.createdAt)}</span>
                </Typography>
                <div className='mt-6'>
                  <>
                    <div className='mb-5 flex flex-col gap-1 items-start border-b-2 border-gray-400 pb-5'>
                      <Typography variant='h4' className='mb-2'>
                        Company information
                      </Typography>
                      <Typography variant='subtitle2'>Company name: {item?.owner?.name}</Typography>
                      <Typography variant='subtitle2'>Company phone number: {item?.owner?.phone}</Typography>
                      <Typography variant='subtitle2'>Company address: {item?.owner?.userAddress}</Typography>
                    </div>

                    <div className='flex flex-col gap-2 items-start'>
                      <Typography variant='h4' className='mb-2'>
                        Product information
                      </Typography>
                      <Typography variant='subtitle2'>Registration No: {item?.id}</Typography>
                      <Typography variant='subtitle2'>
                        Species name:{' '}
                        {[
                          RoleType.fishSeedCompanyRole,
                          RoleType.fishFarmerRole,
                          RoleType.distributorRole,
                          RoleType.retailerRole,
                        ].includes(item?.owner?.role)
                          ? item?.speciesName
                          : item.processedSpeciesName}
                      </Typography>
                      {item.geographicOrigin !== undefined && (
                        <div className='flex flex-row items-center gap-2'>
                          <Typography variant='subtitle2'>Geopraphic origin: </Typography>
                          <Chip
                            label={fishSeedCompanyService.handleMapGeographicOrigin(item?.geographicOrigin!).label}
                            color={
                              fishSeedCompanyService.handleMapGeographicOrigin(item?.geographicOrigin!).color as any
                            }
                          />
                        </div>
                      )}

                      {item.methodOfReproduction !== undefined && (
                        <div className='flex flex-row items-center gap-2'>
                          <Typography variant='subtitle2'>Method of reproduction: </Typography>
                          <Chip
                            label={
                              fishSeedCompanyService.handleMapMethodOfReproduction(item?.methodOfReproduction!).label
                            }
                            color={
                              fishSeedCompanyService.handleMapMethodOfReproduction(item?.methodOfReproduction!)
                                .color as any
                            }
                          />
                        </div>
                      )}

                      {item.waterTemperature !== undefined && (
                        <div className='flex flex-row gap-1 items-center w-full'>
                          <Typography variant='subtitle2'>Water temperature: </Typography>
                          <div className='font-bold'>{item?.waterTemperature}°C</div>
                          <DeviceThermostat color='error' />
                        </div>
                      )}

                      {item.numberOfFishSeedsOrdered && (
                        <div className='flex flex-row gap-1 items-center w-full'>
                          <Typography variant='subtitle2'>Number of fish seeds ordered: </Typography>
                          <div className='font-bold'>{item?.numberOfFishSeedsOrdered}kg</div>
                          <Phishing color='primary' />
                        </div>
                      )}

                      {item.dateOfProcessing !== undefined && (
                        <div className='flex flex-row gap-1 items-center w-full'>
                          <Typography variant='subtitle2'>Date of processing:</Typography>
                          <div className='font-bold'>{formatTimeDate(item?.dateOfProcessing)}</div>
                          <CalendarMonth color='primary' />
                        </div>
                      )}

                      {item.dateOfExpiry !== undefined && (
                        <div className='flex flex-row gap-1 items-center w-full'>
                          <Typography variant='subtitle2'>Date of expiry:</Typography>
                          <div className='font-bold'>{formatTimeDate(item?.dateOfExpiry)}</div>
                          <CalendarMonth color='primary' />
                        </div>
                      )}

                      {item.filletsInPacket !== undefined && (
                        <div className='flex flex-row gap-1 items-center w-full'>
                          <Typography variant='subtitle2'>Fillets in packet:</Typography>
                          <div className='font-bold'>{item?.filletsInPacket} fillets</div>
                          <SetMeal color='info' />
                        </div>
                      )}

                      {item.numberOfPackets !== undefined && (
                        <div className='flex flex-row gap-1 items-center w-full'>
                          <Typography variant='subtitle2'>Number of packets:</Typography>
                          <div className='font-bold'>{item?.numberOfPackets} packets</div>
                          <Inventory2 color='secondary' />
                        </div>
                      )}
                    </div>
                  </>
                </div>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className='float-right'>
                <Avatar src={item?.image} sx={{ width: 120, height: 120 }} variant='square' />
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
