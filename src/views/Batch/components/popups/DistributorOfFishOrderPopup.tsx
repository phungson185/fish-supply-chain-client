import { LoadingButton } from '@mui/lab';
import { DialogActions, DialogContent, DialogTitle, InputAdornment, TextField, Typography } from '@mui/material';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { retailerService } from 'services';
import { BatchType } from 'types/Batch';
import { PopupController } from 'types/Common';

type PopupProps = PopupController & {
  item: BatchType;
};

const DistributorOfFishOrderPopup = ({ item, onClose }: PopupProps) => {
  const { control, handleSubmit } = useForm({ mode: 'onChange' });
  const { address } = useSelector(profileSelector);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { mutate: createOder, isLoading } = useMutation(retailerService.createOder, {
    onSuccess: () => {
      enqueueSnackbar('Create order successfully', {
        variant: 'success',
      });
      onClose();
      navigate('/retailerDistributionOrders');
    },
    onError: (error: any) => {
      enqueueSnackbar(error, { variant: 'error' });
    },
  });

  const handleOrder = () => {
    handleSubmit(async (values) => {
      const resChain = await retailerService.placeProcessedFishPurchaseOrder({
        buyer: address,
        seller: item.distributorId?.owner.address!,
        fishProcessorContractAddress: item.distributorId?.processorId?.processingContract!,
        NumberOfFishPackagesOrdered: values.NumberOfFishPackagesOrdered,
        ProcessedFishPurchaseOrderID: item.distributorId?.processedFishPurchaseOrderId!,
      });

      await createOder({
        buyer: address,
        seller: item.distributorId?.owner.address!,
        distributorId: item.distributorId?.id!,
        numberOfFishPackagesOrdered: values.NumberOfFishPackagesOrdered,
        processedFishPurchaseOrderID: item.distributorId?.processedFishPurchaseOrderId!,
        retailerPurchaseOrderID: resChain.events.RetailerPuchaseOrderPlaced.returnValues.RetailerPurchaseOrderID,
      });
    })();
  };
  return (
    <>
      <DialogTitle>Fish retailer</DialogTitle>
      <DialogContent>
        <Typography variant='h4' className='mb-4'>
          Processed fish order
        </Typography>

        <div className='mt-6 mb-6 flex flex-col gap-6'>
          <TextField required label='Buyer' value={address} disabled />
          <TextField required label='Seller' value={item.distributorId?.owner.address} disabled />
          <TextField required label='Species name' value={item.distributorId?.processorId?.speciesName} disabled />
          <TextField required label='Catch method' value={item.distributorId?.processorId?.catchMethod} disabled />
          <TextField
            required
            label='Date of processing'
            value={moment(item.distributorId?.processorId?.dateOfProcessing).format('DD/MM/YYYY')}
            disabled
          />
          <TextField required label='Fillet in packet' value={item.distributorId?.processorId?.filletsInPacket} disabled />
          <TextField required label='Number of packets' value={item.distributorId?.quantityOfFishPackageOrdered} disabled />

          <Controller
            name='NumberOfFishPackagesOrdered'
            defaultValue=''
            control={control}
            rules={{
              required: `Number of fish package available ranges from 0 to ${item.distributorId?.quantityOfFishPackageOrdered}`,
              min: 0,
              max: item.distributorId?.quantityOfFishPackageOrdered,
            }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                {...field}
                required
                label='Number of fish package'
                error={invalid}
                helperText={error?.message}
                type='number'
                InputProps={{
                  endAdornment: <InputAdornment position='start'>packets</InputAdornment>,
                }}
              />
            )}
          />
        </div>
      </DialogContent>

      <DialogActions>
        <LoadingButton variant='outlined' color='inherit' onClick={onClose}>
          Cancel
        </LoadingButton>
        <LoadingButton variant='contained' onClick={handleOrder} loading={isLoading}>
          Order
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default DistributorOfFishOrderPopup;
