import { LoadingButton } from '@mui/lab';
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { fileService, fishSeedCompanyService } from 'services';
import { PopupController } from 'types/Common';
import { FarmedFishType, FishSeedType, GeographicOriginType, MethodOfReproductionType } from 'types/FishSeedCompany';
import { getBase64 } from 'utils/common';
import { UploadLabel } from 'views/Registration/components';

type PopupProps = PopupController & {
  data: FarmedFishType;
  fetchContract: () => void;
};

const UpdateContractPopup = ({ onClose, fetchContract, data }: PopupProps) => {
  const { control, handleSubmit, setValue, clearErrors } = useForm({ mode: 'onChange' });
  const { enqueueSnackbar } = useSnackbar();
  const { address } = useSelector(profileSelector);
  const [imageLoading, setImageLoading] = useState(false);
  const [image, setImage] = useState('');

  const { mutate: updateContract, isLoading: updateContractLoading } = useMutation(
    fishSeedCompanyService.updateFarmedFishContract,
    {
      onSuccess: () => {
        enqueueSnackbar('Update contract successfully', {
          variant: 'success',
        });
        onClose();
        fetchContract();
      },
      onError: (error: any) => {
        enqueueSnackbar(error, { variant: 'error' });
      },
    },
  );

  useEffect(() => {
    if (data) {
      Object.entries(data ?? {}).forEach(([key, value]) => {
        setValue(key, value);
      });
      setImage(data.image);
    }
  }, [data, setValue]);

  const handleUpdateContract = async () => {
    handleSubmit(async (values) => {
      const resChain = await fishSeedCompanyService.updateFarmedfishContract({
        FarmedFishContract: data.farmedFishContract,
        FishSeedUploader: address,
        Geographicorigin: values.geographicOrigin,
        Images: values.image,
        MethodOfReproduction: values.methodOfReproduction,
        NumberOfFishSeedsavailable: values.numberOfFishSeedsAvailable,
        Speciesname: values.speciesName,
        WaterTemperature: values.waterTemperature,
        IPFShash: values.IPFSHash,
      });

      await updateContract({
        id: data.id,
        body: {
          transactionHash: resChain.transactionHash,
          numberOfFishSeedsAvailable: values.numberOfFishSeedsAvailable,
          IPFSHash: values.IPFSHash,
          geographicOrigin: values.geographicOrigin,
          methodOfReproduction: values.methodOfReproduction,
          speciesName: values.speciesName,
          waterTemperature: values.waterTemperature,
          image: values.image,
        },
      });
    })();
  };

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    getBase64(file, setImage);

    const formData = new FormData();
    formData.append('file', file as Blob);

    setImageLoading(true);
    fileService
      .uploadFile(formData)
      .then((url) => {
        setValue('image', url.pinataUrl ?? '');
        clearErrors('image');
      })
      .finally(() => {
        setImageLoading(false);
      });
  };

  return (
    <>
      <DialogTitle>Contract information</DialogTitle>
      <DialogContent>
        <div className='mt-6 mb-6 flex flex-col gap-6'>
          <Controller
            name='speciesName'
            defaultValue=''
            control={control}
            rules={{ required: 'Species name is required' }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField {...field} label='Species name' error={invalid} helperText={error?.message} />
            )}
          />

          <Controller
            name='geographicOrigin'
            defaultValue=''
            control={control}
            rules={{ required: 'Geographic origin is required' }}
            render={({ field: { value, onChange }, fieldState: { invalid, error } }) => (
              <FormControl fullWidth>
                <InputLabel id='select-geographic-origin'>Geographic origin</InputLabel>
                <Select labelId='select-geographic-origin' id='geographic-origin' value={value} onChange={onChange}>
                  <MenuItem value={GeographicOriginType.BRACKISH.value}>{GeographicOriginType.BRACKISH.label}</MenuItem>
                  <MenuItem value={GeographicOriginType.FRESH.value}>{GeographicOriginType.FRESH.label}</MenuItem>
                  <MenuItem value={GeographicOriginType.MARINE.value}>{GeographicOriginType.MARINE.label}</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name='methodOfReproduction'
            defaultValue=''
            control={control}
            rules={{ required: 'Method of reproduction is required' }}
            render={({ field: { value, onChange }, fieldState: { invalid, error } }) => (
              <FormControl fullWidth>
                <InputLabel id='method-reproduction-origin'>Method of reproduction</InputLabel>
                <Select labelId='method-reproduction-origin' id='reproduction-origin' value={value} onChange={onChange}>
                  <MenuItem value={MethodOfReproductionType.NATURAL.value}>
                    {MethodOfReproductionType.NATURAL.label}
                  </MenuItem>
                  <MenuItem value={MethodOfReproductionType.ARTIFICAL.value}>
                    {MethodOfReproductionType.ARTIFICAL.label}
                  </MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name='numberOfFishSeedsAvailable'
            defaultValue=''
            control={control}
            rules={{ required: 'Number of fish seeds available is required', min: 0 }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                {...field}
                required
                label='Number of fish seeds available'
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
            name='waterTemperature'
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
            name='IPFSHash'
            defaultValue=''
            control={control}
            rules={{ required: 'IPFS hash is required' }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField {...field} required label='IPFS hash' error={invalid} helperText={error?.message} />
            )}
          />

          <Controller
            name='image'
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
        <LoadingButton variant='outlined' color='inherit' onClick={onClose}>
          Cancel
        </LoadingButton>
        <LoadingButton variant='contained' onClick={handleUpdateContract} loading={updateContractLoading}>
          Update
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default UpdateContractPopup;
