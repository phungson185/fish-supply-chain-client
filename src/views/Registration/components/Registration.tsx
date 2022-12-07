import { TextField } from '@material-ui/core';
import { LoadingButton } from '@mui/lab';
import { Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { UseMutateFunction } from 'react-query';
import { useSelector } from 'react-redux';
import { profileSelector } from 'reducers/profile';
import { RegistrationType } from 'types/Registration';

type RegistrationProps = {
  title: string;
  handle: UseMutateFunction<any, unknown, RegistrationType, unknown>;
};

const Registration = ({ title, handle }: RegistrationProps) => {
  const { address: fda } = useSelector(profileSelector);
  const [address, setAddress] = useState('');

  const handleAddressChange = (value: string) => {
    setAddress(value);
  };

  return (
    <>
      <Grid container spacing={5} marginBottom={5} direction='row' justifyContent='flex-start' alignItems='center'>
        <Grid item xs={4}>
          <TextField
            label={title}
            fullWidth
            id='outlined-basic'
            variant='outlined'
            required
            onChange={(e) => handleAddressChange(e.target.value)}
          />
        </Grid>
        <Grid item xs={8} alignItems='center'>
          <LoadingButton variant='contained' onClick={() => handle({ address, fda })}>
            {title}
          </LoadingButton>
        </Grid>
      </Grid>
    </>
  );
};

export default Registration;
