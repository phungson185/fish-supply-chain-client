import { LoadingButton } from '@mui/lab';
import { DialogActions, DialogContent, DialogTitle, InputAdornment, TextField, Typography } from '@mui/material';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { distributorService, fishProcessorService } from 'services';
import { BatchType } from 'types/Batch';
import { PopupController } from 'types/Common';

type PopupProps = PopupController & {
  item: BatchType;
};

const ProcessedFishOrderPopup = ({ item, onClose }: PopupProps) => {
  const { control, handleSubmit } = useForm({ mode: 'onChange' });
  const { address } = useSelector(profileSelector);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { mutate: createOder, isLoading } = useMutation(distributorService.createOder, {
    onSuccess: () => {
      enqueueSnackbar('Create order successfully', {
        variant: 'success',
      });
      onClose();
      navigate('/fishDistributorFishProcessorOrders');
    },
    onError: (error: any) => {
      enqueueSnackbar(error, { variant: 'error' });
    },
  });

  const handleOrder = () => {
    handleSubmit(async (values) => {
      const processedFishPackageID = await fishProcessorService.getProcessedFishPackageID(
        item.fishProcessorId?.processingContract!,
      );

      const resChain = await distributorService.placeProcessedFishPurchaseOrder({
        fishProcessorContractAddress: item.fishProcessorId?.processingContract!,
        orderer: address,
        Receiver: item.fishProcessorId?.owner.address!,
        quantityoffishpackageordered: values.quantityoffishpackageordered,
        ProcessedFishPackageId: processedFishPackageID,
      });

      await createOder({
        orderer: address,
        receiver: item.fishProcessorId?.owner.address!,
        processedFishPackageId: processedFishPackageID,
        processedFishPurchaseOrderId: resChain.events.ProcessedFishPuchaseOrderPlaced.returnValues.ProcessedFishPurchaseOrderID,
        processorId: item.fishProcessorId?.id!,
        quantityOfFishPackageOrdered: values.quantityoffishpackageordered,
      });
    })();
  };
  return (
    <>
      <DialogTitle>Fish distributor</DialogTitle>
      <DialogContent>
        <Typography variant='h4' className='mb-4'>
          Processed fish order
        </Typography>

        <div className='mt-6 mb-6 flex flex-col gap-6'>
          <TextField required label='Orderer' value={address} disabled />
          <TextField required label='Receiver' value={item.fishProcessorId?.owner.address} disabled />
          <TextField required label='Species name' value={item.fishProcessorId?.speciesName} disabled />
          <TextField required label='Catch method' value={item.fishProcessorId?.catchMethod} disabled />
          <TextField
            required
            label='Date of processing'
            value={moment(item.fishProcessorId?.dateOfProcessing).format('DD/MM/YYYY')}
            disabled
          />
          <TextField required label='Fillet in packet' value={item.fishProcessorId?.filletsInPacket} disabled />
          <TextField required label='Number of packets' value={item.fishProcessorId?.numberOfPackets} disabled />

          <Controller
            name='quantityoffishpackageordered'
            defaultValue=''
            control={control}
            rules={{
              required: `Quantity of fish package available ranges from 0 to ${item.fishProcessorId?.numberOfPackets}`,
              min: 0,
              max: item.fishProcessorId?.numberOfPackets,
            }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                {...field}
                required
                label='Quantity of fish package'
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

export default ProcessedFishOrderPopup;
