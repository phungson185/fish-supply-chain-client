import { CalendarMonth, CheckCircle, DeviceThermostat, Inventory2, SetMeal } from '@mui/icons-material';
import { Timeline, TimelineConnector, TimelineContent, TimelineItem, TimelineSeparator } from '@mui/lab';
import { Avatar, Chip, CircularProgress, Container, Grid, Paper, Typography } from '@mui/material';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { batchService, fishSeedCompanyService } from 'services';
import { RoleType } from 'types/Auth';
import { BatchType } from 'types/Batch';
import { contractUrl, formatTime, pinataUrl } from 'utils/common';
import { BatchComponentInfo } from './components';
import { formatTimeDate } from 'utils/common';
import { useWindowSize } from 'hooks';

const BatchDetailPopup = () => {
  const params = useParams();
  const { isMobile } = useWindowSize();
  const { data: item, isSuccess } = useQuery(['batchService.getBatch', { id: params.id }], () =>
    batchService.getBatchById({ id: params.id as string }),
  ) as { data: BatchType; isSuccess: boolean };

  const lastChainPoint = item?.lastChainPoint as keyof BatchType;
  const contract = item?.[lastChainPoint] as any;

  if (!isSuccess) return <></>;
  return (
    <Container className='mt-10'>
      <Paper variant='elevation' elevation={3} className='p-5'>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8} className='w-full'>
            <div className='relative h-full'>
              <div className='flex items-start w-full mb-5 gap-3'>
                <Avatar src={item.qrCode} variant='square' className='w-20 h-20' />
                <div>
                  <div className='mb-2 flex md:flex-row flex-col items-start justify-start gap-3'>
                    <Typography variant='h1'>
                      {[
                        RoleType.fishSeedCompanyRole,
                        RoleType.fishFarmerRole,
                        RoleType.distributorRole,
                        RoleType.retailerRole,
                      ].includes(contract?.owner?.role)
                        ? contract?.speciesName
                        : contract.processedSpeciesName}
                    </Typography>

                    <Chip
                      color={`${item.success ? 'success' : 'warning'}`}
                      label={`${item.success ? 'Completed' : 'In progress'}`}
                      icon={item.success ? <CheckCircle /> : <CircularProgress size={24} />}
                      className='ml-2'
                    />
                  </div>
                  {!isMobile && (
                    <>
                      <Typography variant='h6'>
                        Contract address:&nbsp;
                        <span
                          className='text-blue-600 cursor-pointer break-all'
                          onClick={() =>
                            window.open(
                              contractUrl(
                                [RoleType.fishSeedCompanyRole, RoleType.fishFarmerRole].includes(contract?.owner?.role)
                                  ? item.farmedFishId.farmedFishContract
                                  : item.fishProcessingId?.processingContract,
                              ),
                              '_blank',
                            )
                          }
                        >
                          {[RoleType.fishSeedCompanyRole, RoleType.fishFarmerRole].includes(contract?.owner?.role)
                            ? item.farmedFishId.farmedFishContract
                            : item.fishProcessingId?.processingContract}
                        </span>
                      </Typography>
                      <Typography variant='h6'>
                        Document: &nbsp;
                        <span
                          className='text-blue-600 cursor-pointer break-all'
                          onClick={() => window.open(pinataUrl(contract?.IPFSHash), '_blank')}
                        >
                          {contract?.IPFSHash}
                        </span>
                      </Typography>
                    </>
                  )}
                </div>
                <div className='flex-1'></div>
                {!isMobile && (
                  <Typography variant='caption' className='w-[30%]'>
                    Updated time: {formatTime(contract?.updatedAt)}
                  </Typography>
                )}
              </div>

              {isMobile && (
                <>
                  <Typography variant='h6'>
                    Contract address:&nbsp;
                    <span className='text-blue-600 break-all'>
                      {[RoleType.fishSeedCompanyRole, RoleType.fishFarmerRole].includes(contract?.owner?.role)
                        ? item.farmedFishId.farmedFishContract
                        : item.fishProcessingId?.processingContract}
                    </span>
                  </Typography>
                  <Typography variant='h6'>
                    Document: &nbsp;
                    <span
                      className='text-blue-600 cursor-pointer break-all'
                      onClick={() => window.open(pinataUrl(contract?.IPFSHash), '_blank')}
                    >
                      {contract?.IPFSHash}
                    </span>
                  </Typography>
                </>
              )}

              <div className='mb-2'>
                <span className='mr-2'>Geopraphic origin: </span>
                <Chip
                  label={fishSeedCompanyService.handleMapGeographicOrigin(item?.farmedFishId?.geographicOrigin!).label}
                  color={
                    fishSeedCompanyService.handleMapGeographicOrigin(item?.farmedFishId?.geographicOrigin!).color as any
                  }
                />
              </div>
              <div className='mb-2'>
                <span className='mr-2'>Method of reproduction: </span>
                <Chip
                  label={
                    fishSeedCompanyService.handleMapMethodOfReproduction(item?.farmedFishId?.methodOfReproduction!)
                      .label
                  }
                  color={
                    fishSeedCompanyService.handleMapMethodOfReproduction(item?.farmedFishId?.methodOfReproduction!)
                      .color as any
                  }
                />
              </div>
              {contract.waterTemperature !== undefined && (
                <div className='flex gap-1 items-center mb-2'>
                  <div>Water temperature in fish farming environment:</div>
                  <div className='font-bold'>{contract?.waterTemperature}°C</div>
                  <DeviceThermostat color='error' />
                </div>
              )}

              {contract.dateOfProcessing !== undefined && (
                <div className='flex gap-1 items-center mb-2'>
                  <div>Date of processing:</div>
                  <div className='font-bold'>{formatTimeDate(contract?.dateOfProcessing)}</div>
                  <CalendarMonth color='primary' />
                </div>
              )}

              {contract.dateOfExpiry !== undefined && (
                <div className='flex gap-1 items-center mb-2'>
                  <div>Date of expiry:</div>
                  <div className='font-bold'>{formatTimeDate(contract?.dateOfExpiry)}</div>
                  <CalendarMonth color='primary' />
                </div>
              )}

              {contract.filletsInPacket !== undefined && (
                <div className='flex gap-1 items-center mb-2'>
                  <div>Fillets in packet:</div>
                  <div className='font-bold'>{contract?.filletsInPacket} fillets</div>
                  <SetMeal color='info' />
                </div>
              )}

              {contract.numberOfPackets !== undefined && (
                <div className='flex gap-1 items-center mb-2'>
                  <div>Number of packets:</div>
                  <div className='font-bold'>{contract?.numberOfPackets} packets</div>
                  <Inventory2 color='secondary' />
                </div>
              )}

              <Typography variant='caption'>
                {contract?.owner?.name + ' / ' + contract?.owner?.userAddress + ' / ' + contract?.owner?.phone}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <Avatar
              src={contract?.image}
              alt='fish image'
              variant='square'
              className='mx-auto bg-cover bg-no-repeat w-full h-full'
            />
          </Grid>
        </Grid>
      </Paper>
      <Paper variant='elevation' elevation={3} className='p-5 mt-5'>
        <Typography variant='h2' className='mb-5'>
          Batch progress
        </Typography>
        <Timeline className='p-0' position={isMobile ? 'right' : 'alternate'}>
          {Object.entries(item).map(
            ([key, value], index) =>
              !['id', 'type', 'createdAt', 'updatedAt', 'lastChainPoint', 'qrCode', 'success'].includes(key) && (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <CheckCircle className={isMobile ? 'text-2xl' : 'text-6xl'} color='primary' />
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <BatchComponentInfo item={value} />
                  </TimelineContent>
                </TimelineItem>
              ),
          )}
          <TimelineItem key={5}>
            <TimelineSeparator>
              {item.success ? (
                <CheckCircle className={isMobile ? 'text-2xl' : 'text-6xl'} color='primary' />
              ) : (
                <CircularProgress size={isMobile ? 24 : 48} color='warning' />
              )}
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              {item.success ? (
                <Typography variant={isMobile ? 'h3' : 'h2'} className='text-green-500 ml-3'>
                  Batch completed
                </Typography>
              ) : (
                <Typography variant={isMobile ? 'h3' : 'h2'} className='text-yellow-500 ml-3'>
                  Batch in progress
                </Typography>
              )}
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Paper>
    </Container>
  );
};

export default BatchDetailPopup;
