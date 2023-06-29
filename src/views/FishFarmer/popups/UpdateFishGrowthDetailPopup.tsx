import { LoadingButton } from '@mui/lab';
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { profileSelector } from 'reducers/profile';
import { fileService, fishFarmerService } from 'services';
import { PopupController } from 'types/Common';
import {
  FishSeedCompanyFishFarmerOrderPaginateType,
  FishSeedCompanyFishFarmerOrderType,
  UpdateGrowthDetailType,
} from 'types/FishFarmer';
import { useState } from 'react';
import { UploadLabel } from 'views/Registration/components';
import { getBase64 } from 'utils/common';
import { set } from 'date-fns';

type PopupProps = PopupController & {
  item: FishSeedCompanyFishFarmerOrderType;
  refetch: () => void;
};

const UpdateFishGrowthDetailPopup = ({ item, refetch, onClose }: PopupProps) => {
  const { control, handleSubmit, setValue, clearErrors } = useForm({ mode: 'onChange' });
  const { address } = useSelector(profileSelector);
  const { enqueueSnackbar } = useSnackbar();
  const [documentLoading, setDocumentLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState('');

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

  const handleUpdateGrowthDetail = () => {
    handleSubmit(async (values) => {
      try {
        setIsLoading(true);
        const resChain = await fishFarmerService.updateFarmedFishGrowthDetails({
          FarmedFishGrowthDetailsUploader: address,
          FishWeight: values.FishWeight,
          TotalNumberOfFish: values.TotalNumberOfFish,
          IPFShash: values.IPFShash,
          WaterTemperature: values.WaterTemperature,
          Image: values.Image,
          farmedFishContractAddress: item.farmedFishId.farmedFishContract,
        });

        await updateGrowthDetail({
          transactionHash: resChain.transactionHash,
          farmedFishGrowthDetailsID:
            resChain.events?.FarmedFishGrowthDetailsUpdated.returnValues.FarmedFishGrowthDetailsID,
          orderId: item.id,
          waterTemperature: values.WaterTemperature,
          fishWeight: resChain.events?.FarmedFishGrowthDetailsUpdated.returnValues.FishWeight,
          totalNumberOfFish: resChain.events?.FarmedFishGrowthDetailsUpdated.returnValues.TotalNumberOfFish,
          IPFSHash: resChain.events?.FarmedFishGrowthDetailsUpdated.returnValues.IPFShash,
          image: resChain.events?.FarmedFishGrowthDetailsUpdated.returnValues.Image,
        } as UpdateGrowthDetailType);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    })();
  };

  useEffect(() => {
    if (item) {
      setValue('WaterTemperature', item.waterTemperature);
      setValue('FishWeight', item.fishWeight);
      setValue('TotalNumberOfFish', item.totalNumberOfFish);
      setValue('IPFShash', item.IPFSHash);
      setValue('Image', item.image);
      setImage(item.image);
    }
  }, [item]);

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    getBase64(file, setImage);

    const formData = new FormData();
    formData.append('file', file as Blob);

    setImageLoading(true);
    fileService
      .uploadFile(formData)
      .then((url) => {
        setValue('Image', url.pinataUrl ?? '');
        clearErrors('Image');
      })
      .finally(() => {
        setImageLoading(false);
      });
  };

  const handleChangeDocument = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const formData = new FormData();
    formData.append('file', file as Blob);

    setDocumentLoading(true);
    fileService
      .uploadFile(formData)
      .then((url) => {
        setValue('IPFShash', url.pinataUrl.split('/').pop() ?? '');
        clearErrors('IPFShash');
      })
      .finally(() => {
        setDocumentLoading(false);
      });
  };

  return (
    <>
      <DialogTitle>Update fish growth</DialogTitle>
      <DialogContent>
        <Typography variant='h4' className='mb-4'>
          Fish Growth Detail
        </Typography>

        <div className='mt-6 mb-6 flex flex-col gap-6'>
          <Controller
            name='WaterTemperature'
            defaultValue=''
            control={control}
            rules={{ required: 'Water temperature is required', min: 0 }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                {...field}
                required
                label='Water temperature'
                error={invalid}
                helperText={error?.message}
                type='number'
                InputProps={{
                  endAdornment: <InputAdornment position='start'>℃</InputAdornment>,
                }}
              />
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
            rules={{ required: 'Document is required' }}
            render={({ field, fieldState: { invalid, error } }) => (
              <div className='flex justify-center gap-3'>
                <TextField
                  className='w-full'
                  {...field}
                  required
                  disabled
                  label='Document'
                  error={invalid}
                  helperText={error?.message}
                />
                <LoadingButton variant='contained' component='label' loading={documentLoading}>
                  Upload
                  <input hidden type='file' onChange={handleChangeDocument} />
                </LoadingButton>
              </div>
            )}
          />

          <Controller
            name='Image'
            defaultValue=''
            control={control}
            render={({ fieldState: { invalid } }) => (
              <FormControl fullWidth className='mb-4'>
                <Typography variant='subtitle1'>Image</Typography>
                <input hidden type='file' id='cover' accept='image/*' onChange={handleChangeImage} />
                <UploadLabel
                  {...{ htmlFor: 'cover', variant: 'rounded', image: image }}
                  {...{ width: '100%', height: '100%', loading: imageLoading, error: invalid }}
                />
              </FormControl>
            )}
          />
        </div>
      </DialogContent>

      <DialogActions>
        <LoadingButton variant='outlined' color='inherit' onClick={onClose} disabled={isLoading}>
          Cancel
        </LoadingButton>
        <LoadingButton
          variant='contained'
          onClick={handleUpdateGrowthDetail}
          loading={isLoading || imageLoading || documentLoading}
        >
          Update
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default UpdateFishGrowthDetailPopup;
