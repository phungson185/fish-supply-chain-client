import {
  AccountBalanceWalletOutlined,
  ApartmentOutlined,
  HomeOutlined,
  Inventory2Outlined,
  LocalPhoneOutlined,
  SetMealOutlined,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, DialogActions, DialogContent, DialogTitle, Switch, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useMutation } from 'react-query';
import { distributorService } from 'services';
import { PopupController } from 'types/Common';
import { FishProcessorDistributorOrderType } from 'types/Distributor';
import { contractUrl, formatTimeDate, pinataUrl, shorten } from 'utils/common';
import { UploadLabel } from 'views/Registration/components';

type PopupProps = PopupController & {
  item: FishProcessorDistributorOrderType;
  refetch: () => void;
};

const ProductDetail = ({ item, onClose, refetch }: PopupProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: updateFish } = useMutation(distributorService.updateOrder, {
    onSuccess: () => {
      enqueueSnackbar('Update sale status successfully', { variant: 'success' });
      refetch();
      onClose();
    },
  });
  return (
    <>
      <DialogTitle>{item.speciesName}</DialogTitle>
      <DialogContent>
        <div className='flex flex-row gap-3 items-center justify-between mb-2'>
          <Typography variant='h4'>Product information</Typography>
          <Switch
            checked={item.listing}
            onChange={(e) => {
              updateFish({
                orderId: item.id,
                listing: e.target.checked,
              });
            }}
          />
          <div>Listing</div>
          <div className='flex-1'></div>
          <div className=''></div>
          <Button
            size='small'
            variant='contained'
            color='info'
            disabled={item.disable || item.numberOfPackets === 0}
            onClick={() => window.open(pinataUrl(item.IPFSHash), '_blank')}
          >
            Document
          </Button>
          <Button
            size='small'
            variant='contained'
            color='secondary'
            disabled={item.disable || item.numberOfPackets === 0}
            onClick={() => window.open(contractUrl(item.fishProcessingId.processingContract), '_blank')}
          >
            Contract
          </Button>
        </div>
        <div className='flex flex-row gap-3 w-full mb-2'>
          <div className='w-full max-w-[50%] flex items-start flex-col gap-10'>
            <UploadLabel
              {...{ htmlFor: 'cover', variant: 'rounded', image: item.image }}
              {...{ width: '100%', height: '100%', loading: false, error: false }}
            />
            <div>Lot Code: {item.id}</div>
          </div>
          <div className='w-full max-w-[50%]'>
            <div className='pb-5 border-b-2 border-solid border-gray-200 w-fit mb-5'>
              <Typography variant='h3' className='mb-5 '>
                Owner
              </Typography>
              <div className='flex items-center gap-2 mb-1'>
                <AccountBalanceWalletOutlined className='' />
                <div className=''>Wallet address: </div>
                <div>{shorten(item.orderer.address)}</div>
              </div>
              <div className='flex items-center gap-2 mb-1'>
                <ApartmentOutlined className='' />
                <div className=''>Name: </div>
                <div>{item.orderer.name}</div>
              </div>
              <div className='flex items-center gap-2 mb-1'>
                <HomeOutlined className='' />
                <div className=''>Address: </div>
                <div>{item.orderer.userAddress}</div>
              </div>
              <div className='flex items-center gap-2 mb-1'>
                <LocalPhoneOutlined className='' />
                <div className=''>Phone number: </div>
                <div>{item.orderer.phone}</div>
              </div>
            </div>

            <div>
              <div className='mb-1 text-xl font-bold'>{item.speciesName}</div>
              <div className='mb-5 text-gray-400 text-sm'>
                <span className='mr-2'>Expired: </span>
                <span>
                  {formatTimeDate(item.dateOfProcessing)} ~ {formatTimeDate(item.dateOfExpiry)}{' '}
                </span>
              </div>
              <div className='flex-1'></div>
              <div className=''>
                <div className='inline-block mr-1'>Fillets in packet: </div>
                <div className='inline-block mr-1'>{item.filletsInPacket} fillets</div>
                <SetMealOutlined className='inline-block mb-1' color='primary' />
              </div>
              <div className=''>
                <div className='inline-block mr-1'>Number of packets: </div>
                <div className='inline-block mr-1'>{item.numberOfPackets} packets</div>
                <Inventory2Outlined className='inline-block mb-1' color='primary' />
              </div>
            </div>
          </div>
        </div>
        <div>
          <Typography variant='subtitle1'>Description</Typography>
          <div className='break-all' dangerouslySetInnerHTML={{ __html: item.description }}></div>
        </div>
      </DialogContent>

      <DialogActions>
        <LoadingButton variant='outlined' color='inherit' onClick={onClose}>
          Cancel
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default ProductDetail;
