import { LoadingButton } from '@mui/lab';
import { DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { profileSelector } from 'reducers/profile';
import { systemSelector } from 'reducers/system';
import { fishSeedCompanyService } from 'services';
import { PopupController } from 'types/Common';
import { FarmedFishContractPaginateType, FarmedFishContractType } from 'types/FishSeedCompany';

type PopupProps = PopupController & {
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<QueryObserverResult<FarmedFishContractPaginateType, unknown>>;
};

const CreateContractPopup = ({ refetch, onClose }: PopupProps) => {
  const systemConfig = useSelector(systemSelector);
  const { control, handleSubmit } = useForm({ mode: 'onChange' });
  const { address } = useSelector(profileSelector);
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: createBatch, isLoading } = useMutation(fishSeedCompanyService.createBatch, {
    onSuccess: () => {
      enqueueSnackbar('Deploy contract successfully', {
        variant: 'success',
      });
      refetch();
      onClose();
    },
    onError: (error: any) => {
      enqueueSnackbar(error, { variant: 'error' });
    },
  });

  const handleDeployContract = () => {
    handleSubmit(async (values) => {
      const resChain = await fishSeedCompanyService.deployFarmedFishContract({
        address,
        contract: { registration: systemConfig?.registrationContract, ...values } as FarmedFishContractType,
      });

      const restApi = await fishSeedCompanyService.createFarmedFishContract({
        farmedFishContract: resChain.options.address,
        speciesName: values.Speciesname,
        geographicOrigin: values.Geographicorigin,
        numberOfFishSeedsAvailable: values.NumberOfFishSeedsavailable,
        aquacultureWaterType: values.AquacultureWatertype,
        IPFSHash: values.IPFShash,
      });

      await createBatch({
        farmedFishId: restApi.id,
        type: 1,
      });
    })();
  };

  return (
    <>
      <DialogTitle>Farmed fish contract</DialogTitle>
      <DialogContent>
        <Typography variant='h4' className='mb-4'>
          Contract Information
        </Typography>

        <div className='mt-6 mb-6 flex flex-col gap-6'>
          <TextField
            required
            label='Registration contract address'
            value={systemConfig?.registrationContract}
            disabled
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
            name='AquacultureWatertype'
            defaultValue=''
            control={control}
            rules={{ required: 'Aquaculture water type is required' }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                {...field}
                required
                label='Aquaculture water type'
                error={invalid}
                helperText={error?.message}
              />
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
      </DialogContent>

      <DialogActions>
        <LoadingButton variant='outlined' color='inherit' onClick={onClose}>
          Cancel
        </LoadingButton>
        <LoadingButton variant='contained' onClick={handleDeployContract} loading={isLoading}>
          Deploy
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default CreateContractPopup;
