import { LoadingButton } from '@mui/lab';
import { DialogActions, DialogContent, DialogTitle, InputAdornment, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Controller, set, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { fishFarmerService, fishSeedCompanyService } from 'services';
import { BatchType } from 'types/Batch';
import { PopupController } from 'types/Common';
import { FarmedFishType } from 'types/FishSeedCompany';

type PopupProps = PopupController & {
  item: FarmedFishType;
};

const FishSeedsOrderPopup = ({ item, onClose }: PopupProps) => {
  const { control, handleSubmit } = useForm({ mode: 'onChange' });
  const { address } = useSelector(profileSelector);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: updateContract } = useMutation(fishSeedCompanyService.updateFarmedFishContract);

  const { mutate: createOder } = useMutation(fishFarmerService.createOder, {
    onSuccess: () => {
      enqueueSnackbar('Create order successfully', {
        variant: 'success',
      });
      onClose();
      navigate('/fishSeedCompanyFishFarmerOrders');
    },
    onError: (error: any) => {
      enqueueSnackbar(error, { variant: 'error' });
    },
  });

  const handleOrder = () => {
    handleSubmit(async (values) => {
      try {
        setIsLoading(true);
        const resChain = await fishFarmerService.placeFishSeedsPurchaseOrder({
          farmedFishContractAddress: item.farmedFishContract,
          FishSeedsPurchaser: address,
          FishSeedsSeller: item.owner.address,
          NumberOfFishSeedsOrdered: values.NumberOfFishSeedsOrdered,
        });

        updateContract({
          id: item.id,
          body: {
            transactionHash: resChain.transactionHash,
            numberOfFishSeedsAvailable:
              resChain.events.FishSeedsPurchaseOrderPlaced.returnValues.NumberOfFishSeedsAvailable,
          },
        });

        createOder({
          farmedFishId: item.id,
          fishSeedPurchaseOrderId: resChain.events.FishSeedsPurchaseOrderPlaced.returnValues.FishSeedsPurchaseOrderID,
          fishSeedsPurchaser: address,
          fishSeedsSeller: item.owner.address,
          numberOfFishSeedsOrdered: resChain.events.FishSeedsPurchaseOrderPlaced.returnValues.NumberOfFishSeedsOrdered,
          fishSeedsPurchaseOrderDetailsStatus:
            resChain.events.FishSeedsPurchaseOrderPlaced.returnValues.FishSeedsPurchaseOrderDetailsStatus,
          transactionHash: resChain.transactionHash,
        });
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
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
          <TextField required label='Fish seeds seller' value={item.owner.address} disabled />

          <Controller
            name='NumberOfFishSeedsOrdered'
            defaultValue=''
            control={control}
            rules={{
              required: `Number of fish seeds available ranges from 1 to ${item.numberOfFishSeedsAvailable}`,
              min: 1,
              max: item.numberOfFishSeedsAvailable,
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
        <LoadingButton variant='outlined' color='inherit' onClick={onClose} disabled={isLoading}>
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
