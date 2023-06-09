import {
  AccountBalanceWalletOutlined,
  ApartmentOutlined,
  BalanceOutlined,
  DeviceThermostat,
  HomeOutlined,
  Inventory2Outlined,
  LocalPhoneOutlined,
  SetMealOutlined,
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
import {
  distributorService,
  fishFarmerService,
  fishProcessorService,
  fishSeedCompanyService,
  logService,
} from 'services';
import fishProcessor from 'services/fishProcessor';
import { RoleType } from 'types/Auth';
import { PopupController } from 'types/Common';
import { FishProcessorDistributorOrderType } from 'types/Distributor';
import { FishSeedCompanyFishFarmerOrderPaginateType, FishSeedCompanyFishFarmerOrderType } from 'types/FishFarmer';
import { FishFarmerFishProcessorOrderType } from 'types/FishProcessor';
import { LogParamsType, TransactionType } from 'types/Log';
import { formatTime, formatTimeDate, shorten } from 'utils/common';

const steps = ['The request is being processed', 'The seller has accepted the request', 'The item has been received'];

type PopupProps = PopupController & {
  item: FishProcessorDistributorOrderType;
  refetch: () => void;
};

const ConfirmPopup = ({ item, refetch, onClose }: PopupProps) => {
  const [orderStatus, setOrderStatus] = useState(item.status);
  const { address, role } = useSelector(profileSelector);
  const { enqueueSnackbar } = useSnackbar();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState({
    accept: {
      loading: false,
      disabled: false,
    },
    reject: {
      loading: false,
      disabled: false,
    },
  });
  const [isRecieveLoading, setIsRecieveLoading] = useState(false);

  const { mutate: confirmOrder } = useMutation(distributorService.confirmOrder, {
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
    logService.getLogs({ objectId: item.id, transactionType: TransactionType.ORDER } as LogParamsType),
  );

  const { mutate: updateProcessingContract } = useMutation(fishProcessor.updateProcessingContract, {
    onSuccess: () => {
      onClose();
      refetch();
    },
    onError: (error: any) => {
      enqueueSnackbar(error, { variant: 'error' });
    },
  });

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
    try {
      setIsLoading({
        accept: {
          loading: accepted,
          disabled: !accepted,
        },
        reject: {
          loading: !accepted,
          disabled: accepted,
        },
      });
      const resChain = await distributorService.confirmProcessedFishPurchaseOrder({
        fishProcessingContractAddress: item.fishProcessingId.processingContract,
        Accepted: accepted,
        ProcessedFishPurchaseOrderID: item.processedFishPurchaseOrderId,
        sender: address,
      });

      updateProcessingContract({
        id: item.fishProcessingId.id,
        body: {
          numberOfPackets: resChain.events.ConfirmProcessedFishPurchaseOrderStatus.returnValues.NumberOfPackets,
        },
      });

      confirmOrder({
        orderId: item.id,
        status: Number(resChain.events.ConfirmProcessedFishPurchaseOrderStatus.returnValues.NewStatus),
        transactionHash: resChain.transactionHash,
      });

      setOrderStatus(Number(resChain.events.ConfirmProcessedFishPurchaseOrderStatus.returnValues.NewStatus));
      setActiveStep(activeStep + 1);
      setIsLoading({
        accept: {
          loading: false,
          disabled: false,
        },
        reject: {
          loading: false,
          disabled: false,
        },
      });
    } catch (error) {
      console.error(error);
      setIsLoading({
        accept: {
          loading: false,
          disabled: false,
        },
        reject: {
          loading: false,
          disabled: false,
        },
      });
    }
  };

  const handleRecieve = async () => {
    try {
      setIsRecieveLoading(true);
      const resChain = await distributorService.receiveProcessedFishOrder({
        sender: address,
        fishProcessingContractAddress: item.fishProcessingId.processingContract,
        ProcessedFishPurchaseOrderID: item.processedFishPurchaseOrderId,
      });

      confirmOrder({
        orderId: item.id,
        status: ProcessStatus.Received,
        transactionHash: resChain.transactionHash,
      });

      setOrderStatus(ProcessStatus.Received);
      setActiveStep(activeStep + 1);
      setIsRecieveLoading(false);
    } catch (error) {
      console.error(error);
      setIsRecieveLoading(false);
    }
  };
  return (
    <>
      <DialogTitle>Confirm fish seeds order</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} className='mb-10'>
          <Step completed={item.status == ProcessStatus.Pending}>
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
          <Step completed={item.status == ProcessStatus.Accepted || item.status == ProcessStatus.Rejected}>
            <StepLabel
              error={item.status == ProcessStatus.Rejected}
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
          <Step completed={item.status == ProcessStatus.Received}>
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
              <div className='text-xl text-blue-500'>{item.id}</div>
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
                <div>{shorten(item.orderer.address)}</div>
              </div>
              <div className='flex items-center gap-2 mb-1'>
                <ApartmentOutlined className='' />
                <div className=''>Name: </div>
                <div>{item.orderer.name}</div>
              </div>
              <div className='flex items-center gap-2 mb-1'>
                <HomeOutlined className='' />
                <div className=''>Address: </div>
                <div>{item.orderer.userAddress}</div>
              </div>
              <div className='flex items-center gap-2 mb-1'>
                <LocalPhoneOutlined className='' />
                <div className=''>Phone number: </div>
                <div>{item.orderer.phone}</div>
              </div>
            </div>

            <div className='pb-5'>
              <div className='mb-1 text-xl font-bold'>{item.speciesName}</div>
              <div className='mb-5 text-gray-400 text-sm'>
                <span className='mr-2'>Expired: </span>
                <span>
                  {formatTimeDate(item.dateOfProcessing)} ~ {formatTimeDate(item.dateOfExpiry)}{' '}
                </span>
              </div>
              <div className='flex-1'></div>
              <div className=''>
                <div className='inline-block mr-1'>Fillets in packet: </div>
                <div className='inline-block mr-1'>{item.filletsInPacket} fillets</div>
                <SetMealOutlined className='inline-block mb-1' color='primary' />
              </div>
              <div className=''>
                <div className='inline-block mr-1'>Number of packets: </div>
                <div className='inline-block mr-1'>{item.numberOfPackets} packets</div>
                <Inventory2Outlined className='inline-block mb-1' color='primary' />
              </div>
            </div>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {role === RoleType.fishProcessorRole && (
          <>
            <LoadingButton
              variant='contained'
              color='success'
              disabled={
                ['Accepted', 'Rejected', 'Received'].includes(statusStep[item.status].label) ||
                isLoading.accept.disabled
              }
              onClick={() => handleConfirm(true)}
              loading={isLoading.accept.loading}
            >
              Accept
            </LoadingButton>
            <LoadingButton
              variant='contained'
              color='error'
              disabled={
                ['Accepted', 'Rejected', 'Received'].includes(statusStep[item.status].label) ||
                isLoading.reject.disabled
              }
              onClick={() => handleConfirm(false)}
              loading={isLoading.reject.loading}
            >
              Reject
            </LoadingButton>
          </>
        )}

        {role === RoleType.distributorRole && (
          <LoadingButton
            variant='contained'
            color='warning'
            disabled={['Pending', 'Rejected', 'Received'].includes(statusStep[item.status].label)}
            onClick={handleRecieve}
            loading={isRecieveLoading}
          >
            Received
          </LoadingButton>
        )}

        <LoadingButton
          variant='outlined'
          color='inherit'
          onClick={onClose}
          disabled={isLoading.accept.loading || isLoading.reject.loading || isRecieveLoading}
        >
          Cancel
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default ConfirmPopup;
