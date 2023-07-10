import { LoadingButton } from '@mui/lab';
import { DialogActions, DialogContent, DialogTitle, InputAdornment, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { fishFarmerService, fishProcessorService } from 'services';
import { PopupController } from 'types/Common';
import { FishSeedCompanyFishFarmerOrderType, UpdateGrowthDetailType } from 'types/FishFarmer';

type PopupProps = PopupController & {
  item: FishSeedCompanyFishFarmerOrderType;
  refetch: () => void;
};

const FarmedFishOrderPopup = ({ item, refetch, onClose }: PopupProps) => {
  const { control, handleSubmit } = useForm({ mode: 'onChange' });
  const { address } = useSelector(profileSelector);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const { mutate: createOder } = useMutation(fishProcessorService.createOder, {
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

  const { mutate: updateGrowthDetail } = useMutation(fishFarmerService.updateGrowthDetail, {
    onSuccess: () => {
      enqueueSnackbar('Update growth detail successfully', {
        variant: 'success',
      });
      onClose();
      refetch();
    },
    onError: (error: any) => {
      enqueueSnackbar(error, { variant: 'error' });
    },
  });

  const handleOrder = () => {
    handleSubmit(async (values) => {
      try {
        setIsLoading(true);
        const resChain = await fishProcessorService.placeFarmedFishPurchaseOrder({
          farmedFishContractAddress: item.farmedFishId.farmedFishContract,
          FarmedFishGrowthDetailsID: item.farmedFishGrowthDetailsID,
          FarmedFishPurchaser: address,
          FarmedFishSeller: item.fishSeedsPurchaser.address,
          NumberOfFishOrdered: values.NumberOfFishOrdered,
        });

        await updateGrowthDetail({
          orderId: item.id,
          totalNumberOfFish: resChain.events?.FarmedFishPurchaseOrderPlaced.returnValues.TotalNumberOfFish,
          transactionHash: resChain.transactionHash,
        } as UpdateGrowthDetailType);

        await createOder({
          fishFarmerId: item.id,
          farmedFishPurchaseOrderID:
            resChain.events.FarmedFishPurchaseOrderPlaced.returnValues.FarmedFishPurchaseOrderID,
          farmedFishPurchaser: resChain.events.FarmedFishPurchaseOrderPlaced.returnValues.FarmedFishPurchaser,
          farmedFishSeller: resChain.events.FarmedFishPurchaseOrderPlaced.returnValues.FarmedFishSeller,
          numberOfFishOrdered: resChain.events.FarmedFishPurchaseOrderPlaced.returnValues.NumberOfFishOrdered,
          geographicOrigin: item.geographicOrigin,
          image: item.image,
          IPFSHash: item.IPFSHash,
          methodOfReproduction: item.methodOfReproduction,
          speciesName: item.speciesName,
          transactionHash: resChain.transactionHash,
        });
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
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
          <TextField required label='Fish purchaser' value={address} disabled />
          <TextField required label='Fish seller' value={item.fishSeedsPurchaser.address} disabled />

          <Controller
            name='NumberOfFishOrdered'
            defaultValue=''
            control={control}
            rules={{
              required: `Number of fish seeds available ranges from 1 to ${item.totalNumberOfFish}`,
              min: 1,
              max: item.totalNumberOfFish,
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

export default FarmedFishOrderPopup;
