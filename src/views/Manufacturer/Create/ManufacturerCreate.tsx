import { Typography } from '@material-ui/core';
import { useState } from 'react';

import { FormControl } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { fileService } from 'services';
import { getBase64 } from 'utils/common';
import { UploadLabel } from '../components';

const ManufacturerCreate = () => {
  const [logo, setLogo] = useState('');

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
        setValue('logo', url);
        clearErrors('logo');
      })
      .finally(() => {
        setLogoLoading(false);
      });
  };

  return (
    <>
      <Typography variant='subtitle1'>Create Manufacturer</Typography>
      <Controller
        name='logo'
        defaultValue=''
        control={control}
        rules={{ required: true }}
        render={({ fieldState: { invalid } }) => (
          <FormControl fullWidth className='mb-4'>
            <Typography variant='subtitle1'>Logo Image</Typography>
            <Typography color='textSecondary' gutterBottom>
              This image will also be used for navigation, 350x350 recommended.
            </Typography>
            <input hidden type='file' id='logo' accept='image/*' onChange={handleChangeLogo} />
            <UploadLabel
              {...{ htmlFor: 'logo', variant: 'circular', image: logo }}
              {...{ width: 100, height: 100, loading: logoLoading, error: invalid }}
            />
          </FormControl>
        )}
      />
    </>
  );
};

export default ManufacturerCreate;
