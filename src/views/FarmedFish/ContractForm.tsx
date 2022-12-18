import { LoadingButton } from '@mui/lab';
import { TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { profileSelector } from 'reducers/profile';
import { farmedFishService } from 'services';
import { FarmedFishContractType } from 'types/FarmedFish';

const ContractForm = () => {
  const { control, handleSubmit, clearErrors, setValue, watch } = useForm({ mode: 'onChange' });
  const { address } = useSelector(profileSelector);
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: deployFarmedFishContract, isLoading } = useMutation(farmedFishService.deployFarmedFishContract, {
    onSuccess: (data) => {
      enqueueSnackbar('Deploy contract successfully, your contract address is ' + data.options.address, { variant: 'success' });
    },
  });

  const handleDeployContract = () => {
    handleSubmit((values) => {
      deployFarmedFishContract({ address, contract: values as FarmedFishContractType });
    })();
  };

  return (
    <>
      <Typography variant='h4' className='mb-4'>
        Contract Information
      </Typography>

      <div className='mt-6 mb-6 flex flex-col gap-6'>
        <Controller
          name='registration'
          defaultValue=''
          control={control}
          rules={{ required: 'Registration contract address is required' }}
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField
              {...field}
              required
              label='Registration contract address'
              error={invalid}
              helperText={error?.message}
            />
          )}
        />

        <Controller
          name='Speciesname'
          defaultValue=''
          control={control}
          rules={{ required: 'Species name is required' }}
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField {...field} required label='Species name' error={invalid} helperText={error?.message} />
          )}
        />

        <Controller
          name='Geographicorigin'
          defaultValue=''
          control={control}
          rules={{ required: 'Geographic origin is required' }}
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField {...field} required label='Geographic origin' error={invalid} helperText={error?.message} />
          )}
        />

        <Controller
          name='NumberOfFishSeedsavailable'
          defaultValue=''
          control={control}
          rules={{ required: 'Number of fish seeds available is required' }}
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField
              {...field}
              required
              label='Number of fish seeds available'
              error={invalid}
              helperText={error?.message}
            />
          )}
        />

        <Controller
          name='FishSeedsPCRResultreportId'
          defaultValue=''
          control={control}
          rules={{ required: 'Fish seeds PCR result report ID is required' }}
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField
              {...field}
              required
              label='Fish seeds PCR result report ID'
              error={invalid}
              helperText={error?.message}
            />
          )}
        />

        <Controller
          name='AquacultureWatertype'
          defaultValue=''
          control={control}
          rules={{ required: 'Aquaculture water type is required' }}
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField {...field} required label='Aquaculture water type' error={invalid} helperText={error?.message} />
          )}
        />

        <Controller
          name='IPFShash'
          defaultValue=''
          control={control}
          rules={{ required: 'IPFS hash is required' }}
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField {...field} required label='IPFS hash' error={invalid} helperText={error?.message} />
          )}
        />
      </div>

      <LoadingButton variant='contained' onClick={handleDeployContract} loading={isLoading}>
        Deploy
      </LoadingButton>
    </>
  );
};

export default ContractForm;
