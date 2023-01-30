import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { LoadingButton } from '@mui/lab';
import { Avatar, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { ConfirmStatus } from 'components';
import { status } from 'components/ConfirmStatus';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { profileSelector } from 'reducers/profile';
import { fishFarmerService } from 'services';
import { RoleType } from 'types/Auth';
import { PopupController } from 'types/Common';
import { FishSeedCompanyFishFarmerOrderPaginateType, FishSeedCompanyFishFarmerOrderType } from 'types/FishFarmer';
import { shorten } from 'utils/common';

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

  const { mutate: confirmOrder, isLoading } = useMutation(fishFarmerService.confirmOrder, {
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
  };

  return (
    <>
      <DialogTitle>Confirm fish seeds order</DialogTitle>
      <DialogContent>
        <Grid container spacing={15}>
          <Grid item xs={4}>
            <Grid container spacing={5} border='medium'>
              <Grid item xs={12} justifyContent='center' alignItems='center'>
                <Avatar sx={{ width: 50, height: 50 }}></Avatar>
                <div className='flex item-center gap-2'>
                  <AccountBalanceWalletIcon className='text-blue-800' />
                  <div className='font-medium'>Wallet address: </div>
                  <div>{shorten(item.fishSeedsSeller.address)}</div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className='flex flex-col items-center gap-12 '>
                  <div className='font-medium text-lg'>Number of fish seeds available</div>
                  <div className='text-7xl font-semibold'>{item.farmedFishId.numberOfFishSeedsAvailable}</div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <div className='flex flex-col items-center gap-10'>
              <div>
                <div className='flex justify-between'>
                  <div className='font-medium'>Species name: </div>
                  <div>{item.farmedFishId.speciesName}</div>
                </div>

                <div className='flex justify-between'>
                  <div className='font-medium'>Geographic origin: </div>
                  <div>{item.farmedFishId.geographicOrigin}</div>
                </div>

                <div className='flex justify-between'>
                  <div className='font-medium'>Aquaculture water type: </div>
                  <div>{item.farmedFishId.aquacultureWaterType}</div>
                </div>
              </div>
              <ConfirmStatus index={orderStatus} />
            </div>
          </Grid>
          <Grid item xs={4}>
            <Grid container spacing={5}>
              <Grid item xs={12} justifyContent='center' alignItems='center'>
                <Avatar sx={{ width: 50, height: 50 }}></Avatar>
                <div className='flex item-center gap-2'>
                  <AccountBalanceWalletIcon className='text-blue-800' />
                  <div className='font-medium'>Wallet address: </div>
                  <div>{shorten(item.fishSeedsPurchaser.address)}</div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className='flex flex-col items-center gap-12 '>
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
                status[item.fishSeedsPurchaseOrderDetailsStatus].label,
              )}
              onClick={() => handleConfirm(true)}
            >
              Accept
            </LoadingButton>
            <LoadingButton
              variant='contained'
              color='error'
              disabled={['Accepted', 'Rejected', 'Received'].includes(
                status[item.fishSeedsPurchaseOrderDetailsStatus].label,
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
              status[item.fishSeedsPurchaseOrderDetailsStatus].label,
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
