import { LoadingButton } from '@mui/lab';
import { DialogActions, DialogContent, DialogTitle, InputAdornment, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { profileSelector } from 'reducers/profile';
import { fishFarmerService } from 'services';
import { BatchType } from 'types/Batch';
import { PopupController } from 'types/Common';

type PopupProps = PopupController & {
  item: BatchType;
};

const FishSeedsOrderPopup = ({ item, onClose }: PopupProps) => {
  const { control, handleSubmit } = useForm({ mode: 'onChange' });
  const { address } = useSelector(profileSelector);
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: createOder, isLoading } = useMutation(fishFarmerService.createOder, {
    onSuccess: () => {
      enqueueSnackbar('Create order successfully', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(error, { variant: 'error' });
    },
  });

  const handleOrder = () => {
    handleSubmit(async (values) => {
      const resChain = await fishFarmerService.placeFishSeedsPurchaseOrder({
        farmedFishContractAddress: item.farmedFishId.farmedFishContract,
        FishSeedsPurchaser: address,
        FishSeedsSeller: item.farmedFishId.owner.address,
        NumberOfFishSeedsOrdered: values.NumberOfFishSeedsOrdered,
      });

      createOder({
        farmedFishId: item.farmedFishId.id,
        fishSeedPurchaseOrderId: resChain.events.FishSeedsPurchaseOrderPlaced.returnValues.FishSeedsPurchaseOrderID,
        fishSeedsPurchaser: address,
        fishSeedsSeller: item.farmedFishId.owner.address,
        numberOfFishSeedsOrdered: values.NumberOfFishSeedsOrdered,
        fishSeedsPurchaseOrderDetailsStatus: resChain.events.FishSeedsPurchaseOrderPlaced.returnValues.FishSeedsPurchaseOrderDetailsStatus
      });
    })();
  };
  return (
    <>
      <DialogTitle>Fish farmer</DialogTitle>
      <DialogContent>
        <Typography variant='h4' className='mb-4'>
          Fish Seeds Order
        </Typography>

        <div className='mt-6 mb-6 flex flex-col gap-6'>
          <TextField required label='Fish seeds purchaser' value={address} disabled />
          <TextField required label='Fish seeds seller' value={item.farmedFishId.owner.address} disabled />

          <Controller
            name='NumberOfFishSeedsOrdered'
            defaultValue=''
            control={control}
            rules={{
              required: `Number of fish seeds available ranges from 0 to ${item.farmedFishId.numberOfFishSeedsAvailable}`,
              min: 0,
              max: item.farmedFishId.numberOfFishSeedsAvailable,
            }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                {...field}
                required
                label='Number of fish seeds ordered'
                error={invalid}
                helperText={error?.message}
                type='number'
                InputProps={{
                  endAdornment: <InputAdornment position='start'>kg</InputAdornment>,
                }}
              />
            )}
          />
        </div>
      </DialogContent>

      <DialogActions>
        <LoadingButton variant='outlined' color='inherit' onClick={onClose}>
          Cancel
        </LoadingButton>
        <LoadingButton variant='contained' onClick={handleOrder} loading={isLoading}>
          Order
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default FishSeedsOrderPopup;
