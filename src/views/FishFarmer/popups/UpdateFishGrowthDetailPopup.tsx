import { LoadingButton } from '@mui/lab';
import { DialogActions, DialogContent, DialogTitle, InputAdornment, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { profileSelector } from 'reducers/profile';
import { fishFarmerService } from 'services';
import { PopupController } from 'types/Common';
import {
  FishSeedCompanyFishFarmerOrderPaginateType,
  FishSeedCompanyFishFarmerOrderType,
  UpdateGrowthDetailType,
} from 'types/FishFarmer';

type PopupProps = PopupController & {
  item: FishSeedCompanyFishFarmerOrderType;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<QueryObserverResult<FishSeedCompanyFishFarmerOrderPaginateType, unknown>>;
};

const UpdateFishGrowthDetailPopup = ({ item, refetch, onClose }: PopupProps) => {
  const { control, handleSubmit, setValue } = useForm({ mode: 'onChange' });
  const { address } = useSelector(profileSelector);
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: updateGrowthDetail, isLoading } = useMutation(fishFarmerService.updateGrowthDetail, {
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

  const handleUpdateGrowthDetail = () => {
    handleSubmit(async (values) => {
      await fishFarmerService.updateFarmedFishGrowthDetails({
        FarmedFishGrowthDetailsUploader: address,
        FishWeight: values.FishWeight,
        TotalNumberOfFish: values.TotalNumberOfFish,
        IPFShash: values.IPFShash,
        speciesname: values.speciesname,
      });

      await updateGrowthDetail({
        orderId: item.id,
        speciesName: values.Speciesname,
        fishWeight: values.FishWeight,
        totalNumberOfFish: values.TotalNumberOfFish,
        IPFSHash: values.IPFShash,
      } as UpdateGrowthDetailType);
    })();
  };

  useEffect(() => {
    if (item) {
      setValue('speciesname', item.speciesName);
      setValue('FishWeight', item.fishWeight);
      setValue('TotalNumberOfFish', item.totalNumberOfFish);
      setValue('IPFShash', item.IPFSHash);
    }
  }, [item]);

  return (
    <>
      <DialogTitle>Farmed fish contract</DialogTitle>
      <DialogContent>
        <Typography variant='h4' className='mb-4'>
          Fish Growth Detail
        </Typography>

        <div className='mt-6 mb-6 flex flex-col gap-6'>
          <Controller
            name='speciesname'
            defaultValue=''
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField {...field} required label='Species name' error={invalid} helperText={error?.message} />
            )}
          />

          <Controller
            name='FishWeight'
            defaultValue=''
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                {...field}
                required
                label='Fish weight'
                error={invalid}
                helperText={error?.message}
                type='number'
                InputProps={{
                  endAdornment: <InputAdornment position='start'>kg</InputAdornment>,
                }}
              />
            )}
          />

          <Controller
            name='TotalNumberOfFish'
            defaultValue=''
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                {...field}
                required
                label='Total number of fish'
                error={invalid}
                helperText={error?.message}
                type='number'
                InputProps={{
                  endAdornment: <InputAdornment position='start'>kg</InputAdornment>,
                }}
              />
            )}
          />
          <Controller
            name='IPFShash'
            defaultValue=''
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField {...field} required label='IPFS hash' error={invalid} helperText={error?.message} />
            )}
          />
        </div>
      </DialogContent>

      <DialogActions>
        <LoadingButton variant='outlined' color='inherit' onClick={onClose}>
          Cancel
        </LoadingButton>
        <LoadingButton variant='contained' onClick={handleUpdateGrowthDetail} loading={isLoading}>
          Update
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default UpdateFishGrowthDetailPopup;
