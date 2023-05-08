import { AccountBalanceWallet, Apartment, Home, LocalPhone } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Avatar, DialogActions, DialogContent, DialogTitle, Grid, Step, StepLabel, Stepper } from '@mui/material';
import { ConfirmStatus } from 'components';
import { ProcessStatus, statusStep } from 'components/ConfirmStatus';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { profileSelector } from 'reducers/profile';
import { fishFarmerService, logService } from 'services';
import { RoleType } from 'types/Auth';
import { PopupController } from 'types/Common';
import { FishSeedCompanyFishFarmerOrderPaginateType, FishSeedCompanyFishFarmerOrderType } from 'types/FishFarmer';
import { LogParamsType } from 'types/Log';
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
    logService.getLogs({ objectId: item.id, transactionType: 2 } as LogParamsType),
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
          <Step>
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
          <Step>
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
          <Step>
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
        <Grid container>
          <Grid item xs={4}>
            <Grid container spacing={5} border='medium'>
              <Grid item xs={12} className='flex items-center gap-3'>
                <Avatar src={item.fishSeedsSeller.avatar} sx={{ width: 80, height: 80 }}></Avatar>
                <div>
                  <div className='flex items-center gap-2'>
                    <AccountBalanceWallet />
                    <div className='font-bold'>Wallet address: </div>
                    <div>{shorten(item.fishSeedsSeller.address)}</div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Apartment />
                    <div className='font-bold'>Name: </div>
                    <div>{item.fishSeedsSeller.name}</div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Home />
                    <div className='font-bold'>Address: </div>
                    <div>{item.fishSeedsSeller.userAddress}</div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <LocalPhone />
                    <div className='font-bold'>Phone number: </div>
                    <div>{item.fishSeedsSeller.phone}</div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className='flex flex-col items-center gap-4 '>
                  <div className='font-medium text-lg'>Number of fish seeds available</div>
                  <div className='text-7xl font-semibold'>{item.farmedFishId.numberOfFishSeedsAvailable}</div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <div className='flex flex-col items-center gap-10'>
              <div>
                <div className='flex justify-between gap-5'>
                  <div className='font-medium'>Species name: </div>
                  <div>{item.farmedFishId.speciesName}</div>
                </div>

                <div className='flex justify-between gap-5'>
                  <div className='font-medium'>Geographic origin: </div>
                  <div>{item.farmedFishId.geographicOrigin}</div>
                </div>

                {/* <div className='flex justify-between gap-5'>
                  <div className='font-medium'>Aquaculture water type: </div>
                  <div>{item.farmedFishId.aquacultureWaterType}</div>
                </div> */}
              </div>
              <ConfirmStatus index={orderStatus} />
            </div>
          </Grid>
          <Grid item xs={4}>
            <Grid container spacing={5}>
              <Grid item xs={12} className='flex items-center gap-3'>
                <Avatar src={item.fishSeedsPurchaser.avatar} sx={{ width: 80, height: 80 }}></Avatar>
                <div>
                  <div className='flex items-center gap-2'>
                    <AccountBalanceWallet />
                    <div className='font-bold'>Wallet address: </div>
                    <div>{shorten(item.fishSeedsPurchaser.address)}</div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Apartment />
                    <div className='font-bold'>Name: </div>
                    <div>{item.fishSeedsPurchaser.name}</div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Home />
                    <div className='font-bold'>Address: </div>
                    <div>{item.fishSeedsPurchaser.userAddress}</div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <LocalPhone />
                    <div className='font-bold'>Phone number: </div>
                    <div>{item.fishSeedsPurchaser.phone}</div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className='flex flex-col items-center gap-4 '>
                  <div className='font-medium text-lg'>Number of fish seeds ordered</div>
                  <div className='text-7xl font-semibold'>{item.numberOfFishSeedsOrdered}</div>
                </div>
              </Grid>
            </Grid>
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
