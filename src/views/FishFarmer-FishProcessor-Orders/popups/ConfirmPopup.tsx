import { AccountBalanceWallet, Apartment, Home, LocalPhone } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Avatar, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { ConfirmStatus } from 'components';
import { statusStep } from 'components/ConfirmStatus';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { profileSelector } from 'reducers/profile';
import { fishProcessorService } from 'services';
import { RoleType } from 'types/Auth';
import { PopupController } from 'types/Common';
import { FishFarmerFishProcessorOrderPaginateType, FishFarmerFishProcessorOrderType } from 'types/FishProcessor';
import { shorten } from 'utils/common';

type PopupProps = PopupController & {
  item: FishFarmerFishProcessorOrderType;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<QueryObserverResult<FishFarmerFishProcessorOrderPaginateType, unknown>>;
};

const ConfirmPopup = ({ item, refetch, onClose }: PopupProps) => {
  const [orderStatus, setOrderStatus] = useState(item.status);
  const { address, role } = useSelector(profileSelector);
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: confirmOrder, isLoading } = useMutation(fishProcessorService.confirmOrder, {
    onSuccess: () => {
      enqueueSnackbar('Confirm order successfully', {
        variant: 'success',
      });
      refetch();
      onClose();
    },
    onError: (error: any) => {
      enqueueSnackbar(error, { variant: 'error' });
    },
  });

  const handleConfirm = async (accepted: boolean) => {
    await fishProcessorService.confirmFarmedFishPurchaseOrder({
      Accepted: accepted,
      farmedFishContractAddress: item.fishFarmerId.farmedFishId.farmedFishContract,
      sender: address,
      FarmedFishPurchaseOrderID: item.farmedFishPurchaseOrderID,
    });

    await confirmOrder({
      orderId: item.id,
      status: accepted ? 0 : 1,
    });

    setOrderStatus(accepted ? 0 : 1);
  };

  const handleRecieve = async () => {
    await fishProcessorService.receiveFarmedFishOrder({
      farmedFishContractAddress: item.fishFarmerId.farmedFishId.farmedFishContract,
      sender: address,
      FarmedFishPurchaseOrderID: item.farmedFishPurchaseOrderID,
    });

    await confirmOrder({
      orderId: item.id,
      status: 4,
    });

    setOrderStatus(4);
  };

  return (
    <>
      <DialogTitle>Confirm fish order</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={4}>
            <Grid container spacing={5} border='medium'>
              <Grid item xs={12} className='flex items-center gap-3'>
                <Avatar src={item.farmedFishSeller.avatar} sx={{ width: 80, height: 80 }}></Avatar>
                <div>
                  <div className='flex items-center gap-2'>
                    <AccountBalanceWallet />
                    <div className='font-bold'>Wallet address: </div>
                    <div>{shorten(item.farmedFishSeller.address)}</div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Apartment />
                    <div className='font-bold'>Name: </div>
                    <div>{item.farmedFishSeller.name}</div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Home />
                    <div className='font-bold'>Address: </div>
                    <div>{item.farmedFishSeller.userAddress}</div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <LocalPhone />
                    <div className='font-bold'>Phone number: </div>
                    <div>{item.farmedFishSeller.phone}</div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className='flex flex-col items-center gap-4 '>
                  <div className='font-medium text-lg'>Number of fish seeds available</div>
                  <div className='text-7xl font-semibold'>{item.fishFarmerId.totalNumberOfFish}</div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <div className='flex flex-col items-center gap-10'>
              <div className='flex justify-between gap-5'>
                <div className='font-medium'>Species name: </div>
                <div>{item.speciesName}</div>
              </div>
              <ConfirmStatus index={orderStatus} />
            </div>
          </Grid>
          <Grid item xs={4}>
            <Grid container spacing={5}>
              <Grid item xs={12} className='flex items-center gap-3'>
                <Avatar src={item.farmedFishPurchaser.avatar} sx={{ width: 80, height: 80 }}></Avatar>
                <div>
                  <div className='flex items-center gap-2'>
                    <AccountBalanceWallet />
                    <div className='font-bold'>Wallet address: </div>
                    <div>{shorten(item.farmedFishPurchaser.address)}</div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Apartment />
                    <div className='font-bold'>Name: </div>
                    <div>{item.farmedFishPurchaser.name}</div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Home />
                    <div className='font-bold'>Address: </div>
                    <div>{item.farmedFishPurchaser.userAddress}</div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <LocalPhone />
                    <div className='font-bold'>Phone number: </div>
                    <div>{item.farmedFishPurchaser.phone}</div>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className='flex flex-col items-center gap-4 '>
                  <div className='font-medium text-lg'>Number of fish seeds ordered</div>
                  <div className='text-7xl font-semibold'>{item.numberOfFishOrdered}</div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {role === RoleType.fishFarmerRole && (
          <>
            <LoadingButton
              variant='contained'
              color='success'
              disabled={['Accepted', 'Rejected', 'Received'].includes(statusStep[item.status].label)}
              onClick={() => handleConfirm(true)}
            >
              Accept
            </LoadingButton>
            <LoadingButton
              variant='contained'
              color='error'
              disabled={['Accepted', 'Rejected', 'Received'].includes(statusStep[item.status].label)}
              onClick={() => handleConfirm(false)}
            >
              Reject
            </LoadingButton>
          </>
        )}

        {role === RoleType.fishProcessorRole && (
          <LoadingButton
            variant='contained'
            color='warning'
            disabled={['Pending', 'Rejected', 'Received'].includes(statusStep[item.status].label)}
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
