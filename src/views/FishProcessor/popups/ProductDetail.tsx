import {
  AccountBalanceWalletOutlined,
  ApartmentOutlined,
  HomeOutlined,
  Inventory2Outlined,
  LocalPhoneOutlined,
  SetMealOutlined,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { TableRowEmpty } from 'components';
import { useSearch } from 'hooks';
import { parse } from 'qs';
import { useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { fishProcessorService, logService } from 'services';
import { RoleType } from 'types/Auth';
import { PopupController } from 'types/Common';
import { FishProcessingType } from 'types/FishProcessing';
import { LogParamsType, TransactionType } from 'types/Log';
import { contractUrl, formatTime, formatTimeDate, pinataUrl, shorten } from 'utils/common';
import { UploadLabel } from 'views/Registration/components';
import SelectStampPopup from './SelectStampPopup';
import { useState } from 'react';
import { useSnackbar } from 'notistack';

type PopupProps = PopupController & {
  item: FishProcessingType;
  refetch: () => void;
};

const ProductDetail = ({ item, onClose, refetch }: PopupProps) => {
  const { role } = useSelector(profileSelector);
  const location = useLocation();
  const { tab, page = 1, size = 5, ...query } = parse(location.search, { ignoreQueryPrefix: true });
  const [dataSearch, onSearchChange] = useSearch({ page, size });
  const [openSelectStampPopup, setOpenSelectStampPopup] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const {
    data: logs,
    isSuccess: getLogsSuccess,
    refetch: fetchLogs,
  } = useQuery(['logService.getLogs', dataSearch], () =>
    logService.getLogs({
      ...dataSearch,
      objectId: item.processingContract,
      transactionType: TransactionType.CONTRACT,
    } as LogParamsType),
  );

  const { mutate: updateProcessingContract } = useMutation(fishProcessorService.updateProcessingContract, {
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

  const { items = [], total, currentPage, pages: totalPage } = logs ?? {};
  return (
    <>
      <DialogTitle>{item.processedSpeciesName}</DialogTitle>
      <DialogContent>
        <div className='flex flex-row gap-3 items-center justify-between mb-2'>
          <Typography variant='h4'>Product information</Typography>
          {role === RoleType.fishProcessorRole && (
            <>
              <Switch
                checked={item.listing}
                onChange={(e) => {
                  updateProcessingContract({
                    id: item.id,
                    body: {
                      listing: e.target.checked,
                    },
                  });
                }}
              />
              <div>Listing</div>
            </>
          )}
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
            onClick={() => window.open(contractUrl(item.processingContract), '_blank')}
          >
            Contract
          </Button>
        </div>
        <div className='flex flex-row gap-3 w-full mb-2'>
          <div className='w-full max-w-[50%] flex items-start flex-col gap-10'>
            <UploadLabel
              {...{ htmlFor: 'cover', variant: 'rounded', image: item.image }}
              {...{ width: '70%', height: '70%', loading: false, error: false }}
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
                <div>{shorten(item.fishProcessor.address)}</div>
              </div>
              <div className='flex items-center gap-2 mb-1'>
                <ApartmentOutlined className='' />
                <div className=''>Name: </div>
                <div>{item.fishProcessor.name}</div>
              </div>
              <div className='flex items-center gap-2 mb-1'>
                <HomeOutlined className='' />
                <div className=''>Address: </div>
                <div>{item.fishProcessor.userAddress}</div>
              </div>
              <div className='flex items-center gap-2 mb-1'>
                <LocalPhoneOutlined className='' />
                <div className=''>Phone number: </div>
                <div>{item.fishProcessor.phone}</div>
              </div>
            </div>

            <div className='flex flex-row gap-3'>
              {role === RoleType.fishProcessorRole && (
                <div>
                  <Avatar variant='square' src={item.qrCode} className='w-32 h-32 mb-4' />
                  <Button className='w-full' variant='outlined' onClick={() => setOpenSelectStampPopup(true)}>
                    Download
                  </Button>
                </div>
              )}
              <div>
                <div className='mb-1 text-xl font-bold'>{item.processedSpeciesName}</div>
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
        </div>
        <div className='mb-5'>
          <Typography variant='subtitle1'>Description</Typography>
          <div className='break-all' dangerouslySetInnerHTML={{ __html: item.description }}></div>
        </div>

        <Typography variant='h4' className='mb-5'>
          Transactions
        </Typography>
        <TableContainer className='max-w-screen-2xl'>
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell>Log ID</TableCell> */}
                <TableCell>Title</TableCell>
                <TableCell>Message</TableCell>
                <TableCell className='max-w-[200px]'>Transaction hash</TableCell>
                <TableCell>Old data</TableCell>
                <TableCell>New data</TableCell>
                <TableCell>Updated time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  {/* <TableCell align='center'>{item.id}</TableCell> */}
                  <TableCell align='center'>{item.title}</TableCell>
                  <TableCell align='center'>{item.message}</TableCell>
                  <TableCell align='center'>{item.transactionHash}</TableCell>
                  <TableCell dangerouslySetInnerHTML={{ __html: item.oldData }}></TableCell>
                  <TableCell dangerouslySetInnerHTML={{ __html: item.newData }}></TableCell>
                  <TableCell align='center'>{formatTime(item.updatedAt)}</TableCell>
                </TableRow>
              ))}
              <TableRowEmpty visible={!getLogsSuccess && items.length === 0} />
            </TableBody>
            <caption className='font-bold border-t'>{total ?? 0} Transactions</caption>
          </Table>
        </TableContainer>
        <div className='flex justify-center'>
          <Pagination
            page={currentPage ?? 1}
            count={totalPage}
            onChange={(event, value) => onSearchChange({ page: value })}
          />
        </div>
      </DialogContent>

      <DialogActions>
        <LoadingButton variant='outlined' color='inherit' onClick={onClose}>
          Cancel
        </LoadingButton>
      </DialogActions>

      <Dialog open={openSelectStampPopup} fullWidth maxWidth='lg'>
        <SelectStampPopup item={item} onClose={() => setOpenSelectStampPopup(false)} />
      </Dialog>
    </>
  );
};

export default ProductDetail;
