import { LoadingButton } from '@mui/lab';
import { DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { DesktopDatePicker, DesktopDateTimePicker } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { systemSelector } from 'reducers/system';
import { fishProcessorService } from 'services';
import { PopupController } from 'types/Common';
import { FishFarmerFishProcessorOrderPaginateType, FishFarmerFishProcessorOrderType } from 'types/FishProcessor';

type PopupProps = PopupController & {
  item: FishFarmerFishProcessorOrderType;
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<QueryObserverResult<FishFarmerFishProcessorOrderPaginateType, unknown>>;
};

const CreateContractPopup = ({ item, refetch, onClose }: PopupProps) => {
  const systemConfig = useSelector(systemSelector);
  const { control, handleSubmit } = useForm({
    mode: 'onChange',
  });
  const { address } = useSelector(profileSelector);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { mutate: createProcessingContract, isLoading } = useMutation(fishProcessorService.createProcessingContract, {
    onSuccess: () => {
      enqueueSnackbar('Deploy contract successfully', {
        variant: 'success',
      });
      refetch();
      onClose();
      navigate('/fishFarmerFishProcessorOrders');
    },
    onError: (error: any) => {
      enqueueSnackbar(error, { variant: 'error' });
    },
  });

  const handleDeployContract = () => {
    handleSubmit(async (values) => {
      const resChain = await fishProcessorService.deployFishProcessingContract({
        sender: address,
        dateOfProcessing: values.DateofProcessing.ts,
        ipfsHash: values.IPFS_hash,
        processedSpeciesname: item.speciesName,
        registration: systemConfig?.registrationContract,
        catchMethod: values.CatchMethod,
        filletsInPacket: values.FilletsInPacket,
      });

      createProcessingContract({
        orderId: item.id,
        dateOfProcessing: values.DateofProcessing.ts,
        fishProcessor: address,
        IPFSHash: values.IPFS_hash,
        registrationContract: systemConfig?.registrationContract,
        catchMethod: values.CatchMethod,
        filletsInPacket: values.FilletsInPacket,
        processingContract: resChain.options.address,
      });
    })();
  };

  return (
    <>
      <DialogTitle>Fish processing contract</DialogTitle>
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

          <TextField required label='Fish processor' value={address} disabled />
          <TextField required label='Species name' value={item.speciesName} disabled />
          <TextField required label='Number of processing fish' value={item.numberOfFishOrdered} disabled />

          <Controller
            name='IPFS_hash'
            defaultValue=''
            control={control}
            rules={{ required: 'IPFS hash is required' }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField {...field} required label='IPFS hash' error={invalid} helperText={error?.message} />
            )}
          />

          <Controller
            name='DateofProcessing'
            defaultValue=''
            control={control}
            rules={{
              validate: { isValid: (value: DateTime) => value && value.isValid },
              required: 'Date of processing available is required',
            }}
            render={({ field: { value, onChange }, fieldState: { invalid, error } }) => (
              <DesktopDatePicker
                label='Date of processing'
                value={value}
                onChange={onChange}
                renderInput={(params) => <TextField {...params} required error={invalid} helperText={error?.message} />}
                inputFormat='dd/MM/yyyy'
              />
            )}
          />

          <Controller
            name='CatchMethod'
            defaultValue=''
            control={control}
            rules={{ required: 'Catch method is required' }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField {...field} required label='Catch method' error={invalid} helperText={error?.message} />
            )}
          />

          <Controller
            name='FilletsInPacket'
            defaultValue=''
            control={control}
            rules={{ required: 'Fillets in packet is required' }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                {...field}
                required
                label='Fillets in packet'
                error={invalid}
                helperText={error?.message}
                type='number'
              />
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
