import { DeviceThermostat, SetMeal } from '@mui/icons-material';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import moment from 'moment';
import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { fishSeedCompanyService, logService } from 'services';
import UpdateFishSeedPopup from './popups/UpdateFishSeedPopup';
import { useSelector } from 'react-redux';
import { profileSelector } from 'reducers/profile';
import { systemSelector } from 'reducers/system';
import { FarmedFishContractType } from 'types/FishSeedCompany';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';
import { Controller, useForm } from 'react-hook-form';
import { formatTime } from 'utils/common';
import { LogParamsType } from 'types/Log';

const FishSeedDetail = () => {
  const params = useParams();
  const [openUpdateFishSeedPopup, setOpenUpdateFishSeedPopup] = useState(false);
  const [openEnterQuantityPopup, setOpenEnterQuantityPopup] = useState(false);
  const { control, handleSubmit, setValue } = useForm({ mode: 'onChange' });

  const { address } = useSelector(profileSelector);
  const systemConfig = useSelector(systemSelector);
  const { enqueueSnackbar } = useSnackbar();

  const {
    data: fishSeed,
    isSuccess: getFishSeedSuccess,
    refetch: fetchFishSeed,
  } = useQuery(['fishSeedCompanyService.getFishSeed', { id: params.id }], () =>
    fishSeedCompanyService.getFishSeed({ id: params.id as string }),
  );

  const {
    data: logs,
    isSuccess: getLogsSuccess,
    refetch: fetchLogs,
  } = useQuery(['logService.getLogs', { id: params.id }], () =>
    logService.getLogs({ objectId: params.id } as LogParamsType),
  );
  const { items = [], total, currentPage, pages: totalPage } = logs ?? {};

  const { mutate: createBatch, isLoading } = useMutation(fishSeedCompanyService.createBatch, {
    onSuccess: () => {
      enqueueSnackbar('Deploy contract successfully', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(error, { variant: 'error' });
    },
  });

  const handleDeployContract = async () => {
    handleSubmit(async (values) => {
      const resChain = await fishSeedCompanyService.deployFarmedFishContract({
        address,
        contract: {
          registration: systemConfig.registrationContract,
          Geographicorigin: fishSeed?.geographicOrigin.toString(),
          Images: fishSeed?.images?.[0],
          IPFShash: fishSeed?.IPFSHash,
          MethodOfReproduction: fishSeed?.methodOfReproduction.toString(),
          NumberOfFishSeedsavailable: values.numberOfFishSeedToDeploy,
          Speciesname: fishSeed?.speciesName,
          WaterTemperature: fishSeed?.waterTemperature,
        } as FarmedFishContractType,
      });

      const restApi = await fishSeedCompanyService.createFarmedFishContract({
        farmedFishContract: resChain.options.address,
        fishSeedId: fishSeed?.id!,
        speciesName: fishSeed?.speciesName!,
        geographicOrigin: fishSeed?.geographicOrigin!,
        numberOfFishSeedsAvailable: values.numberOfFishSeedToDeploy,
        methodOfReproduction: fishSeed?.methodOfReproduction!,
        images: fishSeed?.images!,
        waterTemperature: fishSeed?.waterTemperature!,
        IPFSHash: fishSeed?.IPFSHash!,
      });

      await createBatch({
        farmedFishId: restApi.id,
        type: 1,
      });

      setOpenEnterQuantityPopup(false);
      fetchFishSeed();
      fetchLogs();
    })();
  };

  if (!getFishSeedSuccess || !getLogsSuccess) return <></>;

  return (
    <>
      <div>
        <Grid container spacing={5}>
          <Grid item xs={8}>
            <Paper className='min-h-screen p-6'>
              <div className='flex flex-row justify-between items-center mb-5'>
                <div>
                  <Typography variant='h1'>{fishSeed.title}</Typography>
                  <Typography variant='h4'>{fishSeed.subTitle}</Typography>
                </div>
                <Typography variant='caption'>
                  Updated time:{' '}
                  <span className='font-bold'>{moment(fishSeed.updatedAt).format('HH:mm DD/MM/YYYY')}</span>
                </Typography>
              </div>
              <Typography variant='caption' className='text-base'>
                {fishSeed.description}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Card className='mb-5'>
              <CardMedia
                sx={{ height: 300 }}
                image='https://picsum.photos/200/300'
                title='fish image'
                className='bg-cover bg-no-repeat'
              />
              <CardContent className='flex flex-col gap-5'>
                <div>
                  <Typography gutterBottom variant='h3' component='div'>
                    {fishSeed.speciesName}
                  </Typography>
                </div>
                <div className='flex gap-3 items-center'>
                  <Chip
                    label={fishSeedCompanyService.handleMapGeographicOrigin(fishSeed.geographicOrigin)}
                    color='warning'
                  />
                  <Chip
                    label={fishSeedCompanyService.handleMapMethodOfReproduction(fishSeed.methodOfReproduction)}
                    color='secondary'
                  />
                </div>
                <div className='flex gap-1 items-center'>
                  <DeviceThermostat color='error' />
                  <div>Nhiệt độ nước:</div>
                  <div className='font-bold'>{fishSeed.waterTemperature}°C</div>
                </div>
                <div className='flex gap-1 items-center'>
                  <SetMeal className='text-blue-600' />
                  <div>Số lượng:</div>
                  <div className='font-bold'>{fishSeed.quantity}kg</div>
                </div>
              </CardContent>
              <CardActions className='flex justify-end'>
                <Button
                  size='small'
                  onClick={() => setOpenUpdateFishSeedPopup(true)}
                  disabled={fishSeed.isMakeContract}
                >
                  Edit
                </Button>
                <Button size='small' onClick={() => setOpenEnterQuantityPopup(true)} disabled={fishSeed.isMakeContract}>
                  Create contract
                </Button>
              </CardActions>
            </Card>
            <Card className='flex flex-col items-center p-2 gap-2'>
              <Typography variant='h4' className='p-2'>
                Activities log
              </Typography>
              <div
                style={{ background: 'rgba(75, 85, 99, 100)', width: '100%', height: '1px', marginBottom: '10px' }}
              ></div>
              <div className='h-48 w-full overflow-auto'>
                {items.map((log, index) => (
                  <div key={index} className='flex flex-col gap-2 w-full mb-2 p-2 rounded-xl hover:bg-primary-main'>
                    <div className='flex flex-row justify-between items-center'>
                      <div className='flex flex-row gap-2 items-center'>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            logService.handleMapTransactionType(log.transactionType).color
                          }`}
                        />
                        <Typography variant='h6' className='text-'>
                          {log.title}
                        </Typography>
                      </div>
                      <Typography variant='caption'>{formatTime(log.updatedAt)}</Typography>
                    </div>
                    <Typography variant='caption'>{log.message}</Typography>
                  </div>
                ))}
              </div>
            </Card>
          </Grid>
        </Grid>
      </div>

      <Dialog open={openEnterQuantityPopup} fullWidth maxWidth='xs'>
        <DialogContent>
          <Controller
            name='numberOfFishSeedToDeploy'
            defaultValue=''
            control={control}
            rules={{
              required: `Number of fish to deploy available ranges from 1 to ${fishSeed.quantity}`,
              min: 1,
              max: fishSeed.quantity,
            }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                className='w-full'
                {...field}
                required
                label='Number of fish to deploy'
                error={invalid}
                helperText={error?.message}
                type='number'
                InputProps={{
                  endAdornment: <InputAdornment position='start'>kg</InputAdornment>,
                }}
              />
            )}
          />
        </DialogContent>

        <DialogActions>
          <LoadingButton variant='outlined' color='inherit' onClick={() => setOpenEnterQuantityPopup(false)}>
            Cancel
          </LoadingButton>
          <LoadingButton variant='contained' onClick={handleDeployContract} loading={isLoading}>
            Deploy
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdateFishSeedPopup} fullWidth maxWidth='md'>
        <UpdateFishSeedPopup
          data={fishSeed}
          onClose={() => setOpenUpdateFishSeedPopup(false)}
          fetchFishSeed={fetchFishSeed}
          fetchLogs={fetchLogs}
        />
      </Dialog>
    </>
  );
};

export default FishSeedDetail;
