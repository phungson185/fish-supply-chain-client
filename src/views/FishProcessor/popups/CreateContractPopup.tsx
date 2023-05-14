import { LoadingButton } from '@mui/lab';
import { DialogActions, DialogContent, DialogTitle, FormControl, TextField, Typography } from '@mui/material';
import { DesktopDatePicker, DesktopDateTimePicker } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { systemSelector } from 'reducers/system';
import { fileService, fishProcessorService } from 'services';
import { PopupController } from 'types/Common';
import { FishFarmerFishProcessorOrderPaginateType, FishFarmerFishProcessorOrderType } from 'types/FishProcessor';
import { useEffect, useState } from 'react';
import { UploadLabel } from 'views/Registration/components';
import { getBase64 } from 'utils/common';

type PopupProps = PopupController & {
  item: FishFarmerFishProcessorOrderType;
  refetch: () => void;
};

const CreateContractPopup = ({ item, refetch, onClose }: PopupProps) => {
  const systemConfig = useSelector(systemSelector);
  const { control, handleSubmit, setValue, clearErrors } = useForm({
    mode: 'onChange',
  });
  const { address, id } = useSelector(profileSelector);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = useState(false);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [image, setImage] = useState('');
  const { mutate: createProcessingContract, isLoading } = useMutation(fishProcessorService.createProcessingContract, {
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

  useEffect(() => {
    if (item) {
      setValue('processedSpeciesname', item.speciesName);
      setValue('ipfsHash', item.IPFSHash);
      setValue('registration', systemConfig?.registrationContract);
    }
  }, []);

  const handleDeployContract = () => {
    handleSubmit(async (values) => {
      if (DateTime.fromISO(values.dateOfProcessing.ts) < DateTime.now()) {
        enqueueSnackbar('Date of processing must be from current date', { variant: 'error' });
        return;
      }

      if (values.dateOfExpiry.ts < values.dateOfProcessing.ts) {
        enqueueSnackbar('Date of expiry must be after date of processing', { variant: 'error' });
        return;
      }

      const resChain = await fishProcessorService.deployFishProcessingContract({
        sender: address,
        dateOfProcessing: values.dateOfProcessing.ts,
        dateOfExpiry: values.dateOfExpiry.ts,
        ipfsHash: values.ipfsHash,
        processedSpeciesname: values.processedSpeciesname,
        registration: systemConfig?.registrationContract,
        filletsInPacket: values.filletsInPacket,
        numberOfPackets: values.numberOfPackets,
        farmedFishPurchaseOrderID: item.farmedFishPurchaseOrderID,
        image: values.image,
      });

      createProcessingContract({
        farmedFishPurchaseOrderID: item.farmedFishPurchaseOrderID,
        image: values.image,
        dateOfProcessing: values.dateOfProcessing.ts,
        dateOfExpiry: values.dateOfExpiry.ts,
        fishProcessorId: item.id,
        fishProcessor: id as string,
        IPFSHash: values.ipfsHash,
        registrationContract: systemConfig?.registrationContract,
        filletsInPacket: values.filletsInPacket,
        processingContract: resChain.options.address,
        numberOfPackets: values.numberOfPackets,
        processedSpeciesName: values.processedSpeciesname,
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
        setValue('ipfsHash', url.pinataUrl.split('/').pop() ?? '');
        clearErrors('ipfsHash');
      })
      .finally(() => {
        setDocumentLoading(false);
      });
  };

  return (
    <>
      <DialogTitle>Fish processing contract</DialogTitle>
      <DialogContent>
        <Typography variant='h4' className='mb-4'>
          Contract Information
        </Typography>

        <div className='mt-6 mb-6 flex flex-col gap-6'>
          <TextField required label='Fish processor' value={address} disabled />

          <Controller
            name='registration'
            defaultValue=''
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                {...field}
                required
                label='Registration contract'
                error={invalid}
                disabled
                helperText={error?.message}
              />
            )}
          />

          <Controller
            name='processedSpeciesname'
            defaultValue=''
            control={control}
            rules={{ required: 'Species name is required' }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                {...field}
                required
                disabled
                label='Species name'
                error={invalid}
                helperText={error?.message}
              />
            )}
          />

          <Controller
            name='ipfsHash'
            defaultValue=''
            control={control}
            rules={{ required: 'IPFS hash is required' }}
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
            name='dateOfProcessing'
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
                disablePast
              />
            )}
          />

          <Controller
            name='dateOfExpiry'
            defaultValue=''
            control={control}
            rules={{
              validate: { isValid: (value: DateTime) => value && value.isValid },
              required: 'Date of expiry available is required',
            }}
            render={({ field: { value, onChange }, fieldState: { invalid, error } }) => (
              <DesktopDatePicker
                label='Date of expiry'
                value={value}
                onChange={onChange}
                renderInput={(params) => <TextField {...params} required error={invalid} helperText={error?.message} />}
                inputFormat='dd/MM/yyyy'
                disablePast
              />
            )}
          />

          <Controller
            name='filletsInPacket'
            defaultValue=''
            control={control}
            rules={{ required: 'Fillets in packet is required', min: 1 }}
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

          <Controller
            name='numberOfPackets'
            defaultValue=''
            control={control}
            rules={{ required: 'Number of packets is required', min: 1 }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                {...field}
                required
                label='Number of packets'
                error={invalid}
                helperText={error?.message}
                type='number'
              />
            )}
          />

          <Controller
            name='image'
            defaultValue=''
            control={control}
            rules={{ required: 'Image of packets is required' }}
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
        <LoadingButton variant='contained' onClick={handleDeployContract} loading={isLoading}>
          Deploy
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default CreateContractPopup;
