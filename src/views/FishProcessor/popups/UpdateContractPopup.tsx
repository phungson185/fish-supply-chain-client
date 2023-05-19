import { LoadingButton } from '@mui/lab';
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { DesktopDatePicker, DesktopDateTimePicker } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, useMutation, useQuery } from 'react-query';
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
import TextEditor from 'components/TextEditor';
import { FishProcessingType } from 'types/FishProcessing';

type PopupProps = PopupController & {
  item: FishProcessingType;
  refetch: () => void;
};

const UpdateContractPopup = ({ item, refetch, onClose }: PopupProps) => {
  const systemConfig = useSelector(systemSelector);
  const { control, handleSubmit, setValue, clearErrors } = useForm({
    mode: 'onChange',
  });
  const { address } = useSelector(profileSelector);
  const { enqueueSnackbar } = useSnackbar();
  const [imageLoading, setImageLoading] = useState(false);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [image, setImage] = useState('');
  const { mutate: updateProcessingContract, isLoading } = useMutation(fishProcessorService.updateProcessingContract, {
    onSuccess: () => {
      enqueueSnackbar('Update contract successfully', {
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
      setValue('image', item.image);
      setImage(item.image);
      setValue('registration', item.registrationContract);
      setValue('processedSpeciesname', item.processedSpeciesName);
      setValue('ipfsHash', item.IPFSHash);
      setValue('dateOfProcessing', item.dateOfProcessing);
      setValue('dateOfExpiry', item.dateOfExpiry);
      setValue('filletsInPacket', item.filletsInPacket);
      setValue('numberOfPackets', item.numberOfPackets);
      setValue('description', item.description);
      setValue('listing', item.listing);
    }
  }, []);

  const handleUpdateContract = () => {
    handleSubmit(async (values) => {
      if (DateTime.fromISO(values.dateOfProcessing.ts) < DateTime.now()) {
        enqueueSnackbar('Date of processing must be from current date', { variant: 'error' });
        return;
      }

      if (values.dateOfExpiry.ts < values.dateOfProcessing.ts) {
        enqueueSnackbar('Date of expiry must be after date of processing', { variant: 'error' });
        return;
      }

      const resChain = await fishProcessorService.updateFishProcessingContract({
        sender: address,
        dateOfProcessing: new Date(values.dateOfProcessing).getTime(),
        dateOfExpiry: new Date(values.dateOfExpiry).getTime(),
        ipfsHash: values.ipfsHash,
        processedSpeciesname: values.processedSpeciesname,
        filletsInPacket: values.filletsInPacket,
        numberOfPackets: values.numberOfPackets,
        image: values.image,
        fishProcessingContractAddress: item.processingContract,
      });

      let dataChain = resChain.events.ProcessedFishPackageIDCreated.returnValues;

      updateProcessingContract({
        id: item.id,
        body: {
          image: dataChain.Image,
          dateOfProcessing: Number(dataChain.DateOfProcessing),
          dateOfExpiry: Number(dataChain.DateOfExpiry),
          ipfsHash: dataChain.IPFS_Hash,
          filletsInPacket: Number(dataChain.FilletsInPacket),
          numberOfPackets: Number(dataChain.NumberOfPackets),
          description: values.description,
          processedSpeciesname: dataChain.ProcessedSpeciesName,
          listing: values.listing,
          transactionHash: resChain.transactionHash,
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
        <div className='flex flex-row gap-3 items-center mb-4'>
          <Typography variant='h4'>Contract Information</Typography>
          <Controller
            name='listing'
            defaultValue=''
            control={control}
            // rules={{ required: 'Image of packets is required' }}
            render={({ field: { value, onChange }, fieldState: { invalid, error } }) => (
              <FormGroup>
                <FormControlLabel
                  control={<Switch checked={value} onChange={(e) => setValue('listing', e.target.checked)} />}
                  label='Listing'
                />
              </FormGroup>
            )}
          />
        </div>
        <div>
          <div className='flex flex-row gap-5 w-full'>
            <div className='w-full max-w-[30%]'>
              <Controller
                name='image'
                defaultValue=''
                control={control}
                rules={{ required: 'Image of packets is required' }}
                render={({ fieldState: { invalid } }) => (
                  <FormControl fullWidth className='mb-4'>
                    <input hidden type='file' id='cover' accept='image/*' onChange={handleChangeImage} />
                    <UploadLabel
                      {...{ htmlFor: 'cover', variant: 'rounded', image: image }}
                      {...{ width: '100%', height: '100%', loading: imageLoading, error: invalid }}
                    />
                  </FormControl>
                )}
              />
            </div>
            <div className='w-full max-w-[70%] flex flex-col gap-5'>
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
                    renderInput={(params) => (
                      <TextField {...params} required error={invalid} helperText={error?.message} />
                    )}
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
                    renderInput={(params) => (
                      <TextField {...params} required error={invalid} helperText={error?.message} />
                    )}
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
            </div>
          </div>
          <Controller
            name='description'
            defaultValue=''
            control={control}
            render={({ field: { value, onChange } }) => (
              <FormControl fullWidth className='mb-4'>
                <Typography variant='subtitle1'>Description</Typography>
                <TextEditor
                  name='description'
                  onChange={(value: any) => onChange({ target: { value } })}
                  value={value}
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
        <LoadingButton variant='contained' onClick={handleUpdateContract} loading={isLoading}>
          Update
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default UpdateContractPopup;
