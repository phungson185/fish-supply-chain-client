import { LoadingButton } from '@mui/lab';
import { DialogActions, DialogContent, DialogTitle, InputAdornment, TextField, Typography } from '@mui/material';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { distributorService, fishProcessorService, retailerService } from 'services';
import retailer from 'services/retailer';
import { BatchType } from 'types/Batch';
import { PopupController } from 'types/Common';
import { FishProcessorDistributorOrderType } from 'types/Distributor';
import { FishProcessingType } from 'types/FishProcessing';
import { DistributorRetailerOrderType } from 'types/Retailer';

type PopupProps = PopupController & {
  item: FishProcessorDistributorOrderType;
  refetch: () => void;
};

const FishOfDistributorOrderPopup = ({ item, refetch, onClose }: PopupProps) => {
  const { control, handleSubmit } = useForm({ mode: 'onChange' });
  const { address, id } = useSelector(profileSelector);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { mutate: createOder, isLoading } = useMutation(retailerService.createOder, {
    onSuccess: () => {
      enqueueSnackbar('Create order successfully', {
        variant: 'success',
      });
      onClose();
      refetch();
      navigate('/retailerDistributionOrders');
    },
    onError: (error: any) => {
      enqueueSnackbar(error, { variant: 'error' });
    },
  });

  const { mutate: updateDistributorProducts } = useMutation(distributorService.updateOrder);

  const handleOrder = () => {
    handleSubmit(async (values) => {
      console.log(item.owner.address);
      const resChain = await retailerService.placeRetailerPurchaseOrder({
        buyer: address,
        seller: item.owner.address,
        fishProcessingContractAddress: item.fishProcessingId.processingContract,
        NumberOfFishPackagesOrdered: values.quantityoffishpackageordered,
        ProcessedFishPurchaseOrderID: item.processedFishPurchaseOrderId,
      });

      let dataResChain = resChain.events.RetailerPuchaseOrderPlaced.returnValues;

      updateDistributorProducts({
        orderId: item.id,
        numberOfPackets: dataResChain.NumberOfFishPackages,
      });

      await createOder({
        buyer: id as string,
        seller: item.owner.id,
        retailerPurchaseOrderID: dataResChain.RetailerPurchaseOrderID,
        processedFishPurchaseOrderID: dataResChain.ProcessedFishPurchaseOrderID,
        numberOfFishPackagesOrdered: dataResChain.NumberOfFishPackagesOrdered,
        dateOfExpiry: item.dateOfExpiry,
        dateOfProcessing: item.dateOfProcessing,
        description: item.description,
        distributorId: item.id,
        filletsInPacket: item.filletsInPacket,
        image: item.image,
        numberOfPackets: item.numberOfPackets,
        IPFSHash: item.IPFSHash,
        speciesName: item.speciesName,
        transactionHash: resChain.transactionHash,
      });
    })();
  };
  return (
    <>
      <DialogTitle>Fish retailer</DialogTitle>
      <DialogContent>
        <Typography variant='h4' className='mb-4'>
          Fish of distributor order
        </Typography>

        <div className='mt-6 mb-6 flex flex-col gap-6'>
          <TextField required label='Buyer' value={address} disabled />
          <TextField required label='Seller' value={item.owner.address} disabled />
          <Controller
            name='quantityoffishpackageordered'
            defaultValue=''
            control={control}
            rules={{
              required: `Quantity of fish packet available ranges from 1 to ${item.numberOfPackets}`,
              min: 1,
              // max: item.numberOfPackets,
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

export default FishOfDistributorOrderPopup;
