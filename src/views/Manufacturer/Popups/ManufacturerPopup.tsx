import { Typography } from '@material-ui/core';
import { useState } from 'react';

import { LoadingButton } from '@mui/lab';
import { DialogActions, DialogContent, DialogTitle, FormControl, Grid, TextField } from '@mui/material';
import TextEditor from 'components/TextEditor';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { profileSelector } from 'reducers/profile';
import { fileService, manufacturerService } from 'services';
import { PopupController } from 'types/Common';
import { getBase64 } from 'utils/common';
import { UploadLabel } from '../components';

type PopupProps = PopupController & {};

const ManufacturerPopup = ({ onClose, refetch }: PopupProps) => {
  const { address } = useSelector(profileSelector);
  const [logo, setLogo] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const { control, handleSubmit, clearErrors, setValue } = useForm();

  const [logoLoading, setLogoLoading] = useState(false);

  const handleChangeLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    getBase64(file, setLogo);

    const formData = new FormData();
    formData.append('image', file as Blob);

    setLogoLoading(true);
    fileService
      .uploadFile(formData)
      .then((url) => {
        setValue('logoImage', url);
        clearErrors('logo');
      })
      .finally(() => {
        setLogoLoading(false);
      });
  };

  const { mutate: addManufacturer, isLoading } = useMutation(manufacturerService.addManufacturer, {
    onSuccess: (data) => {
      enqueueSnackbar('Add manufacturer successfully', { variant: 'success' });
      onClose();
      refetch();
    },
  });

  const handleSubmitManufacturer = async () => {
    handleSubmit((values) => {
      addManufacturer({
        address,
        ...values,
      });
    })();
  };

  return (
    <>
      <DialogTitle>MANUFACTURER</DialogTitle>

      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Controller
              name='logoImage'
              defaultValue=''
              control={control}
              rules={{ required: true }}
              render={({ fieldState: { invalid } }) => (
                <FormControl fullWidth className='flex items-center'>
                  <input hidden type='file' id='logo' accept='image/*' onChange={handleChangeLogo} />
                  <UploadLabel
                    {...{ htmlFor: 'logo', variant: 'circular', image: logo }}
                    {...{ width: 240, height: 240, loading: logoLoading, error: invalid }}
                  />
                  <Typography variant='subtitle1'>Logo image</Typography>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={8}>
            <div className='flex flex-col gap-5'>
              <Controller
                name='manufacturerAddress'
                defaultValue=''
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { invalid, error } }) => (
                  <FormControl fullWidth className='mb-4'>
                    <Typography variant='subtitle1'>Manufacturer address</Typography>
                    <TextField {...field} required error={invalid} helperText={error?.message} />
                  </FormControl>
                )}
              />

              <Controller
                name='manufacturerName'
                defaultValue=''
                control={control}
                rules={{ required: true }}
                render={({ field, fieldState: { invalid, error } }) => (
                  <FormControl fullWidth className='mb-4'>
                    <Typography variant='subtitle1'>Manufacturer name</Typography>
                    <TextField {...field} required error={invalid} helperText={error?.message} />
                  </FormControl>
                )}
              />

              <Controller
                name='manufacturerDescription'
                defaultValue=''
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <FormControl fullWidth className='mb-4'>
                    <Typography variant='subtitle1'>Manufacturer description</Typography>
                    <TextEditor
                      name='description'
                      value={value}
                      onChange={(value: any) => onChange({ target: { value } })}
                    />
                  </FormControl>
                )}
              />
            </div>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <LoadingButton variant='outlined' color='inherit' onClick={onClose}>
          Cancel
        </LoadingButton>
        <LoadingButton variant='contained' onClick={handleSubmitManufacturer} loading={isLoading}>
          Add
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default ManufacturerPopup;
