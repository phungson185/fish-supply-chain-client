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
import { FishProcessingType } from 'types/FishProcessing';

type PopupProps = PopupController & {
  item: FishProcessingType;
};

const ProcessedFishOrderPopup = ({ item, onClose }: PopupProps) => {
  const { control, handleSubmit } = useForm({ mode: 'onChange' });
  const { address, id } = useSelector(profileSelector);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { mutate: createOder, isLoading } = useMutation(distributorService.createOder, {
    onSuccess: () => {
      enqueueSnackbar('Create order successfully', {
        variant: 'success',
      });
      onClose();
      navigate('/distributorFishProcessorOrders');
    },
    onError: (error: any) => {
      enqueueSnackbar(error, { variant: 'error' });
    },
  });

  const { mutate: updateContract } = useMutation(fishProcessorService.updateProcessingContract);

  const handleOrder = () => {
    handleSubmit(async (values) => {
      const resChain = await distributorService.placeProcessedFishPurchaseOrder({
        fishProcessingContractAddress: item.processingContract,
        orderer: address,
        Receiver: item.fishProcessor.address,
        quantityoffishpackageordered: values.quantityoffishpackageordered,
      });

      updateContract({
        id: item.id,
        body: {
          transactionHash: resChain.transactionHash,
          numberOfPackets: resChain.events.ProcessedFishPuchaseOrderPlaced.returnValues.NumberOfPackets,
        },
      });

      await createOder({
        orderer: id as string,
        receiver: item.fishProcessor.id,
        speciesName: item.processedSpeciesName,
        processedFishPurchaseOrderId:
          resChain.events.ProcessedFishPuchaseOrderPlaced.returnValues.ProcessedFishPurchaseOrderID,
        quantityOfFishPackageOrdered:
          resChain.events.ProcessedFishPuchaseOrderPlaced.returnValues.quantityoffishpackageordered,
        fishProcessingId: item.id,
        dateOfExpiry: item.dateOfExpiry,
        dateOfProcessing: item.dateOfProcessing,
        filletsInPacket: item.filletsInPacket,
        image: item.image,
        IPFSHash: item.IPFSHash,
        description: item.description,
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
          <TextField required label='Buyer' value={address} disabled />
          <TextField required label='Seller' value={item.fishProcessor.address} disabled />
          <Controller
            name='quantityoffishpackageordered'
            defaultValue=''
            control={control}
            rules={{
              required: `Quantity of fish packet available ranges from 1 to ${item.numberOfPackets}`,
              min: 1,
              max: item.numberOfPackets,
            }}
            render={({ field, fieldState: { invalid, error } }) => (
              <TextField
                {...field}
                required
                label='Quantity of fish packet'
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
