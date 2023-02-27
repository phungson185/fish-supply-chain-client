import { LoadingButton } from '@mui/lab';
import { DialogActions, DialogContent, DialogTitle, InputAdornment, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { fishProcessorService } from 'services';
import { BatchType } from 'types/Batch';
import { PopupController } from 'types/Common';

type PopupProps = PopupController & {
  item: BatchType;
};

const FarmedFishOrderPopup = ({ item, onClose }: PopupProps) => {
  const { control, handleSubmit } = useForm({ mode: 'onChange' });
  const { address } = useSelector(profileSelector);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { mutate: createOder, isLoading } = useMutation(fishProcessorService.createOder, {
    onSuccess: () => {
      enqueueSnackbar('Create order successfully', {
        variant: 'success',
      });
      onClose();
      navigate('/fishFarmerFishProcessorOrders');
    },
    onError: (error: any) => {
      enqueueSnackbar(error, { variant: 'error' });
    },
  });

  const handleOrder = () => {
    handleSubmit(async (values) => {
      const resChain = await fishProcessorService.placeFarmedFishPurchaseOrder({
        farmedFishContractAddress: item.farmedFishId.farmedFishContract,
        FarmedFishPurchaser: address,
        FarmedFishSeller: item.fishFarmerId?.owner.address!,
        NumberOfFishOrdered: values.NumberOfFishOrdered,
        speciesname: item.fishFarmerId?.speciesName!,
      });

      await createOder({
        fishFarmerId: item.fishFarmerId?.id!,
        farmedFishPurchaseOrderID: resChain.events.FarmedFishPurchaseOrderPlaced.returnValues.FarmedFishPurchaseOrderID,
        farmedFishPurchaser: address,
        farmedFishSeller: item.fishFarmerId?.owner.address!,
        numberOfFishOrdered: values.NumberOfFishOrdered,
        speciesName: item.fishFarmerId?.speciesName!,
      });
    })();
  };
  return (
    <>
      <DialogTitle>Fish processor</DialogTitle>
      <DialogContent>
        <Typography variant='h4' className='mb-4'>
          Fish Order
        </Typography>

        <div className='mt-6 mb-6 flex flex-col gap-6'>
          <TextField required label='Fish seeds purchaser' value={address} disabled />
          <TextField required label='Fish seeds seller' value={item.fishFarmerId?.owner.address} disabled />

          <TextField required label='Species name' value={item.fishFarmerId?.speciesName} disabled />

          <Controller
            name='NumberOfFishOrdered'
            defaultValue=''
            control={control}
            rules={{
              required: `Number of fish seeds available ranges from 0 to ${item.fishFarmerId?.totalNumberOfFish}`,
              min: 0,
              max: item.fishFarmerId?.totalNumberOfFish,
            }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                {...field}
                required
                label='Number of fish ordered'
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

export default FarmedFishOrderPopup;
