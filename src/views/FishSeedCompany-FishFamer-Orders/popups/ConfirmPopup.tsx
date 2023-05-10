import {
  AccountBalanceWalletOutlined,
  ApartmentOutlined,
  BalanceOutlined,
  DeviceThermostat,
  HomeOutlined,
  LocalPhoneOutlined,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Chip,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { ProcessStatus, statusStep } from 'components/ConfirmStatus';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { profileSelector } from 'reducers/profile';
import { fishFarmerService, fishSeedCompanyService, logService } from 'services';
import { RoleType } from 'types/Auth';
import { PopupController } from 'types/Common';
import { FishSeedCompanyFishFarmerOrderPaginateType, FishSeedCompanyFishFarmerOrderType } from 'types/FishFarmer';
import { LogParamsType, TransactionType } from 'types/Log';
import { formatTime, shorten } from 'utils/common';

const steps = ['The request is being processed', 'The seller has accepted the request', 'The item has been received'];

type PopupProps = PopupController & {
  item: FishSeedCompanyFishFarmerOrderType;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<QueryObserverResult<FishSeedCompanyFishFarmerOrderPaginateType, unknown>>;
};

const ConfirmPopup = ({ item, refetch, onClose }: PopupProps) => {
  const [orderStatus, setOrderStatus] = useState(item.fishSeedsPurchaseOrderDetailsStatus);
  const { address, role } = useSelector(profileSelector);
  const { enqueueSnackbar } = useSnackbar();
  const [activeStep, setActiveStep] = useState<number>(0);

  const { mutate: confirmOrder, isLoading } = useMutation(fishFarmerService.confirmOrder, {
    onSuccess: () => {
      enqueueSnackbar('Confirm order successfully', {
        variant: 'success',
      });
      refetch();
      fetchLogs();
    },
    onError: (error: any) => {
      enqueueSnackbar(error, { variant: 'error' });
    },
  });

  const {
    data: logs,
    isSuccess: getLogsSuccess,
    refetch: fetchLogs,
  } = useQuery(['logService.getLogs', { id: item.id }], () =>
    logService.getLogs({ objectId: item.id, transactionType: TransactionType.UPDATE_ORDER_STATUS } as LogParamsType),
  );

  useEffect(() => {
    if (getLogsSuccess) {
      if (logs?.items?.length === 1) {
        setActiveStep(0);
      } else if (logs?.items?.length === 2) {
        setActiveStep(1);
      } else if (logs?.items?.length === 3) {
        setActiveStep(2);
      }
    }
  }, [getLogsSuccess, logs]);

  const handleConfirm = async (accepted: boolean) => {
    const resChain = await fishFarmerService.confirmFishSeedsPurchaseOrder({
      accepted,
      farmedFishContractAddress: item.farmedFishId.farmedFishContract,
      sender: address,
      FishSeedsPurchaseOrderID: item.fishSeedPurchaseOrderId,
    });

    await confirmOrder({
      orderId: item.id,
      numberOfFishSeedsAvailable: Number(
        resChain.events.FishSeedsPurchaseOrderConfirmed.returnValues.NumberOfFishSeedsAvailable,
      ),
      status: resChain.events.FishSeedsPurchaseOrderConfirmed.returnValues.NEWSTatus,
    });

    setOrderStatus(Number(resChain.events.FishSeedsPurchaseOrderConfirmed.returnValues.NEWSTatus));
    setActiveStep(activeStep + 1);
  };

  const handleRecieve = async () => {
    const resChain = await fishFarmerService.receiveFishSeedsOrder({
      farmedFishContractAddress: item.farmedFishId.farmedFishContract,
      sender: address,
      FishSeedsPurchaseOrderID: item.fishSeedPurchaseOrderId,
    });

    await confirmOrder({
      orderId: item.id,
      numberOfFishSeedsAvailable: Number(
        resChain.events.FishsSeedsOrderReceived.returnValues.NumberOfFishSeedsAvailable,
      ),
      status: resChain.events.FishsSeedsOrderReceived.returnValues.NEWSTatus,
    });

    setOrderStatus(Number(resChain.events.FishsSeedsOrderReceived.returnValues.NEWSTatus));
    setActiveStep(activeStep + 1);
  };
  return (
    <>
      <DialogTitle>Confirm fish seeds order</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} className='mb-10'>
          <Step completed={item.fishSeedsPurchaseOrderDetailsStatus == ProcessStatus.Pending}>
            <StepLabel
              optional={
                activeStep >= 0 &&
                formatTime(
                  logs?.items?.filter((log) => log.newData == ProcessStatus.Pending.toString())?.[0]?.updatedAt ?? '',
                )
              }
            >
              The request is being processed
            </StepLabel>
          </Step>
          <Step
            completed={
              item.fishSeedsPurchaseOrderDetailsStatus == ProcessStatus.Accepted ||
              item.fishSeedsPurchaseOrderDetailsStatus == ProcessStatus.Rejected
            }
          >
            <StepLabel
              error={item.fishSeedsPurchaseOrderDetailsStatus == ProcessStatus.Rejected}
              optional={
                activeStep >= 1 &&
                formatTime(
                  logs?.items?.filter((log) =>
                    [ProcessStatus.Accepted, ProcessStatus.Rejected].includes(Number(log.newData)),
                  )?.[0]?.updatedAt ?? '',
                )
              }
            >
              The seller has accepted the request
            </StepLabel>
          </Step>
          <Step completed={item.fishSeedsPurchaseOrderDetailsStatus == ProcessStatus.Received}>
            <StepLabel
              optional={
                activeStep == 2 &&
                formatTime(
                  logs?.items?.filter((log) => log.newData == ProcessStatus.Received.toString())?.[0]?.updatedAt ?? '',
                )
              }
            >
              The item has been received
            </StepLabel>
          </Step>
        </Stepper>
        <Grid container spacing={5}>
          <Grid item xs={4}>
            <div className='flex flex-row gap-3 items-center mb-5'>
              <Typography variant='h3'>Order ID: </Typography>
              <div className='text-xl text-blue-500'>{shorten(item.fishSeedPurchaseOrderId)}</div>
            </div>
            <Avatar variant='square' src={item.image} sx={{ width: '100%', height: 'auto' }} />
          </Grid>
          <Grid item xs={8}>
            <div className='pb-5 border-b-2 border-solid border-gray-200 w-fit mb-5'>
              <Typography variant='h3' className='mb-5 '>
                Shipping address
              </Typography>
              <div className='flex items-center gap-2 mb-1'>
                <AccountBalanceWalletOutlined className='' />
                <div className=''>Wallet address: </div>
                <div>{shorten(item.fishSeedsPurchaser.address)}</div>
              </div>
              <div className='flex items-center gap-2 mb-1'>
                <ApartmentOutlined className='' />
                <div className=''>Name: </div>
                <div>{item.fishSeedsPurchaser.name}</div>
              </div>
              <div className='flex items-center gap-2 mb-1'>
                <HomeOutlined className='' />
                <div className=''>Address: </div>
                <div>{item.fishSeedsPurchaser.userAddress}</div>
              </div>
              <div className='flex items-center gap-2 mb-1'>
                <LocalPhoneOutlined className='' />
                <div className=''>Phone number: </div>
                <div>{item.fishSeedsPurchaser.phone}</div>
              </div>
            </div>

            <div className='pb-5'>
              <Typography variant='h3' className='mb-5'>
                Order details
              </Typography>
              <div className='mb-1'>
                <span>Name: </span>
                <span className='mb-5'>{item.speciesName}</span>
              </div>
              <div className='mb-1'>
                <span className='mr-2'>Geopraphic origin: </span>
                <Chip
                  label={fishSeedCompanyService.handleMapGeographicOrigin(item?.geographicOrigin!).label}
                  color={fishSeedCompanyService.handleMapGeographicOrigin(item?.geographicOrigin!).color as any}
                />
              </div>
              <div className='mb-1'>
                <span className='mr-2'>Method of reproduction: </span>
                <Chip
                  label={fishSeedCompanyService.handleMapMethodOfReproduction(item?.methodOfReproduction!).label}
                  color={fishSeedCompanyService.handleMapMethodOfReproduction(item?.methodOfReproduction!).color as any}
                />
              </div>
              <div className='flex gap-1 items-center mb-2'>
                <div>Water temperature in fish farming environment:</div>
                <div className=''>{item?.waterTemperature}°C</div>
                <DeviceThermostat color='error' />
              </div>
              <div className=''>
                <div className='inline-block mr-1'>Number of fish seeds ordered: </div>
                <div className='inline-block mr-1'>{item.numberOfFishSeedsOrdered}kg</div>
                <BalanceOutlined className='inline-block' color='primary' />
              </div>
            </div>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {role === RoleType.fishSeedCompanyRole && (
          <>
            <LoadingButton
              variant='contained'
              color='success'
              disabled={['Accepted', 'Rejected', 'Received'].includes(
                statusStep[item.fishSeedsPurchaseOrderDetailsStatus].label,
              )}
              onClick={() => handleConfirm(true)}
            >
              Accept
            </LoadingButton>
            <LoadingButton
              variant='contained'
              color='error'
              disabled={['Accepted', 'Rejected', 'Received'].includes(
                statusStep[item.fishSeedsPurchaseOrderDetailsStatus].label,
              )}
              onClick={() => handleConfirm(false)}
            >
              Reject
            </LoadingButton>
          </>
        )}

        {role === RoleType.fishFarmerRole && (
          <LoadingButton
            variant='contained'
            color='warning'
            disabled={['Pending', 'Rejected', 'Received'].includes(
              statusStep[item.fishSeedsPurchaseOrderDetailsStatus].label,
            )}
            onClick={handleRecieve}
          >
            Received
          </LoadingButton>
        )}

        <LoadingButton variant='outlined' color='inherit' onClick={onClose}>
          Cancel
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default ConfirmPopup;
