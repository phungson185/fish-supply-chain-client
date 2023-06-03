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
import { Spinner } from 'components';
import TextEditor from 'components/TextEditor';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { fileService, fishSeedCompanyService } from 'services';
import { PopupController } from 'types/Common';
import { FishSeedType, GeographicOriginType, MethodOfReproductionType } from 'types/FishSeedCompany';
import { getBase64 } from 'utils/common';
import { UploadLabel } from 'views/Registration/components';

type PopupProps = PopupController & {
  data: FishSeedType;
  fetchFishSeed: () => void;
  fetchLogs: () => void;
};

const UpdateFishSeedPopup = ({ onClose, fetchFishSeed, fetchLogs, data }: PopupProps) => {
  const { control, handleSubmit, setValue, clearErrors } = useForm({ mode: 'onChange' });
  const { enqueueSnackbar } = useSnackbar();
  const [imageLoading, setImageLoading] = useState(false);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [image, setImage] = useState('');

  const { mutate: updateFishSeed, isLoading: updateLoading } = useMutation(fishSeedCompanyService.updateFishSeed, {
    onSuccess: () => {
      enqueueSnackbar('Update fish seed successfully', {
        variant: 'success',
      });
      onClose();
      fetchFishSeed();
      fetchLogs();
    },
    onError: (error: any) => {
      enqueueSnackbar(error, { variant: 'error' });
    },
  });

  useEffect(() => {
    if (data) {
      Object.entries(data ?? {}).forEach(([key, value]) => {
        setValue(key, value);
      });
      setImage(data.image);
    }
  }, [data, setValue]);

  const handleFishSeed = async () => {
    handleSubmit(async (values) => {
      updateFishSeed({
        id: data.id,
        body: {
          title: values.title,
          subTitle: values.subTitle,
          description: values.description,
          geographicOrigin: values.geographicOrigin,
          methodOfReproduction: values.methodOfReproduction,
          speciesName: values.speciesName,
          quantity: values.quantity,
          waterTemperature: values.waterTemperature,
          image: values.image,
          IPFSHash: values.IPFSHash,
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

  const handleChangeDocument = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const formData = new FormData();
    formData.append('file', file as Blob);

    setDocumentLoading(true);
    fileService
      .uploadFile(formData)
      .then((url) => {
        setValue('IPFSHash', url.pinataUrl.split('/').pop() ?? '');
        clearErrors('IPFSHash');
      })
      .finally(() => {
        setDocumentLoading(false);
      });
  };

  return (
    <>
      <DialogTitle>Fish information</DialogTitle>
      <DialogContent>
        <Spinner loading={updateLoading}>
          <div className='mt-6 mb-6 flex flex-col gap-6'>
            <Controller
              name='title'
              defaultValue=''
              control={control}
              rules={{ required: 'Title is required' }}
              render={({ field, fieldState: { invalid, error } }) => (
                <TextField {...field} required label='Title' error={invalid} helperText={error?.message} />
              )}
            />

            <Controller
              name='subTitle'
              defaultValue=''
              control={control}
              rules={{ required: 'Subtitle is required' }}
              render={({ field, fieldState: { invalid, error } }) => (
                <TextField {...field} label='Subtitle' error={invalid} helperText={error?.message} />
              )}
            />

            <Controller
              name='description'
              defaultValue=''
              control={control}
              rules={{ required: 'Description is required' }}
              render={({ field: { value, onChange }, fieldState: { invalid, error } }) => (
                <FormControl fullWidth className='mb-4' error={invalid}>
                  <Typography variant='subtitle1'>Description</Typography>
                  <TextEditor
                    name='description'
                    onChange={(value: any) => onChange({ target: { value } })}
                    value={value}
                  />{' '}
                </FormControl>
              )}
            />

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
                    <MenuItem value={GeographicOriginType.BRACKISH.value}>
                      {GeographicOriginType.BRACKISH.label}
                    </MenuItem>
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
                  <Select
                    labelId='method-reproduction-origin'
                    id='reproduction-origin'
                    value={value}
                    onChange={onChange}
                  >
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
              name='quantity'
              defaultValue=''
              control={control}
              rules={{ required: 'Quantity is required', min: 0 }}
              render={({ field, fieldState: { invalid, error } }) => (
                <TextField
                  {...field}
                  required
                  label='Quantity'
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
        </Spinner>
      </DialogContent>

      <DialogActions>
        <LoadingButton variant='outlined' color='inherit' onClick={onClose}>
          Cancel
        </LoadingButton>
        <LoadingButton variant='contained' onClick={handleFishSeed} loading={updateLoading}>
          Update
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default UpdateFishSeedPopup;
