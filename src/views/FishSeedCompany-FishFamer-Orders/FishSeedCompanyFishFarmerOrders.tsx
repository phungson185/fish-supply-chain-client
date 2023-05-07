import { AccessTime, CategoryOutlined, DeviceThermostat, SetMeal } from '@mui/icons-material';
import {
  Avatar,
  Button,
  Chip,
  Container,
  debounce,
  Dialog,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Spinner, TableRowEmpty } from 'components';
import { ProcessStatus, statusStep } from 'components/ConfirmStatus';
import { useAnchor, useSearch } from 'hooks';
import { parse } from 'qs';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { fishFarmerService, fishSeedCompanyService } from 'services';
import { FishSeedCompanyFishFarmerOrderType } from 'types/FishFarmer';
import { ConfirmPopup } from './popups';
import { RoleType } from 'types/Auth';
import { useSelector } from 'react-redux';
import { profileSelector } from 'reducers/profile';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import { formatTime } from 'utils/common';

const FILTERS = [{ label: 'Number of fish seeds ordered', orderBy: 'numberOfFishSeedsOrdered' }];

const SORT_TYPES = [
  { label: 'Low to High', desc: 'false' },
  { label: 'High to Low', desc: 'true' },
];

const FishSeedCompanyFishFarmerOrders = () => {
  const { address, role } = useSelector(profileSelector);

  const location = useLocation();
  const { tab, page = 1, ...query } = parse(location.search, { ignoreQueryPrefix: true });
  const [dataSearch, onSearchChange] = useSearch({ page });
  const [anchorFilter, openFilter, onOpenFilter, onCloseFilter] = useAnchor();
  const [anchorSort, openSort, onOpenSort, onCloseSort] = useAnchor();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isFetching, refetch } = useQuery(
    ['fishFarmerService.getOrders', dataSearch],
    () => fishFarmerService.getOrders(dataSearch),
    {
      keepPreviousData: false,
      staleTime: 0,
    },
  );

  const { items = [], total, currentPage, pages: totalPage } = data ?? {};
  const [orderBy, setOrderBy] = useState(query.orderBy || FILTERS[0].orderBy);
  const [desc, setDesc] = useState(query.desc || SORT_TYPES[0].desc);
  const [search, setSearch] = useState(query.search || '');
  const [params, setParams] = useState({ search, page });
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<FishSeedCompanyFishFarmerOrderType>(
    {} as FishSeedCompanyFishFarmerOrderType,
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceChangeParams = useCallback(
    debounce((values) => {
      setParams((prev) => ({ ...prev, ...values }));
    }, 300),
    [],
  );
  useEffect(() => {
    onSearchChange({ orderBy, desc, ...params });
  }, [onSearchChange, orderBy, desc, params]);

  const { mutate: confirmOrder, isLoading } = useMutation(fishFarmerService.confirmOrder, {
    onSuccess: () => {
      enqueueSnackbar('Confirm order successfully', {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(error, { variant: 'error' });
    },
  });

  const handleConfirm = async (item: FishSeedCompanyFishFarmerOrderType, accepted: boolean) => {
    const resChain = await fishFarmerService.confirmFishSeedsPurchaseOrder({
      accepted,
      farmedFishContractAddress: item.farmedFishId.farmedFishContract,
      sender: address,
      FishSeedsPurchaseOrderID: item.fishSeedPurchaseOrderId,
    });

    await confirmOrder({
      orderId: item.id,
      status: resChain.events.FishSeedsPurchaseOrderConfirmed.returnValues.NEWSTatus,
    });
    refetch();
  };

  const handleRecieve = async (item: FishSeedCompanyFishFarmerOrderType) => {
    const resChain = await fishFarmerService.receiveFishSeedsOrder({
      farmedFishContractAddress: item.farmedFishId.farmedFishContract,
      sender: address,
      FishSeedsPurchaseOrderID: item.fishSeedPurchaseOrderId,
    });

    await confirmOrder({
      orderId: item.id,
      status: resChain.events.FishsSeedsOrderReceived.returnValues.NEWSTatus,
    });

    refetch();
  };

  return (
    <>
      <div className='flex items-center justify-between mb-10'>
        <div className='flex justify-between gap-2'>
          <Button
            variant='text'
            color='inherit'
            classes={{ textInherit: 'bg-white hover:brightness-90 px-4' }}
            startIcon={<CategoryOutlined />}
            onClick={onOpenFilter}
          >
            {FILTERS.find((item) => item.orderBy === orderBy)?.label ?? FILTERS[0].label}
          </Button>
          <Menu
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            anchorEl={anchorFilter}
            open={openFilter}
            onClose={onCloseFilter}
            onClick={onCloseFilter}
          >
            {FILTERS.map((item, index) => (
              <MenuItem
                key={index}
                classes={{ selected: 'bg-info-light' }}
                selected={item.orderBy === orderBy}
                onClick={() => {
                  setOrderBy(item.orderBy);
                }}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>

          <Button
            variant='text'
            color='inherit'
            classes={{ textInherit: 'bg-white hover:brightness-90 px-4' }}
            startIcon={<CategoryOutlined />}
            onClick={onOpenSort}
          >
            {SORT_TYPES.find((item) => item.desc === desc)?.label ?? SORT_TYPES[0].label}
          </Button>
          <Menu
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            anchorEl={anchorSort}
            open={openSort}
            onClose={onCloseSort}
            onClick={onCloseSort}
          >
            {SORT_TYPES.map((item, index) => (
              <MenuItem
                key={index}
                classes={{ selected: 'bg-info-light' }}
                selected={item.desc === desc}
                onClick={() => {
                  setDesc(item.desc);
                }}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </div>

        {/* <TextField
          placeholder='Search...'
          InputProps={{ className: 'bg-white text-black' }}
          value={search}
          sx={{ width: '30%' }}
          onChange={(event) => {
            const { value } = event.target;
            setSearch(value);
            debounceChangeParams({ search: value });
          }}
        /> */}
      </div>
      {/* <TableContainer component={Paper}>
        <Spinner loading={isFetching}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Contract adress</TableCell>
                <TableCell>Fish seeds purchaser</TableCell>
                <TableCell>Fish seeds seller</TableCell>
                <TableCell>Number of fish seeds ordered (kg)</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell align='center'>{item.id}</TableCell>
                  <TableCell align='center'>{item.farmedFishId.farmedFishContract}</TableCell>
                  <TableCell align='center'>{item.fishSeedsPurchaser.address}</TableCell>
                  <TableCell align='center'>{item.fishSeedsSeller.address}</TableCell>
                  <TableCell align='center'>{item.numberOfFishSeedsOrdered}</TableCell>
                  <TableCell align='center'>
                    <Button
                      variant='contained'
                      sx={{
                        backgroundColor: `${statusStep[item.fishSeedsPurchaseOrderDetailsStatus].color}`,
                        color: 'white',
                      }}
                      onClick={() => {
                        setSelectedOrder(item);
                        setOpenConfirmPopup(true);
                      }}
                    >
                      {`${statusStep[item.fishSeedsPurchaseOrderDetailsStatus].label}`}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRowEmpty visible={!isFetching && items.length === 0} />
            </TableBody>
            <caption className='font-bold border-t'>{total ?? 0} Contracts</caption>
          </Table>
        </Spinner>
      </TableContainer> */}
      <Container>
        <Spinner loading={isFetching}>
          {items.map((item) => (
            <div
              key={item.id}
              className='bg-white p-5 rounded-2xl mb-5 cursor-pointer'
              onClick={() => {
                setSelectedOrder(item);
                setOpenConfirmPopup(true);
              }}
            >
              <div className='flex flex-row items-center gap-2 border-b-2 border-solid border-gray-200 pb-3 mb-3'>
                <Avatar src={item.owner.avatar ?? ''} />
                <div className='font-bold'>{item.owner.name}</div>
                <div className='flex-1'></div>
                {/* <AccessTime className='text-green-500' />
              <div className='text-green-500'>Waiting for the seller to confirm</div> */}

                {statusStep.find((step) => step.code === item.fishSeedsPurchaseOrderDetailsStatus)?.component}
                {statusStep.find((step) => step.code === item.fishSeedsPurchaseOrderDetailsStatus)?.description}
              </div>

              <div className='flex flex-row gap-3 border-b-2 border-solid border-gray-200 pb-3 mb-3'>
                <Avatar variant='square' src={item.image ?? ''} sx={{ width: 240, height: 240 }} />
                <div>
                  <div className='mb-5 text-xl font-bold'>{item.speciesName}</div>
                  <div className='mb-1 text-gray-400 text-sm'>
                    <span className='mr-2'>Geopraphic origin: </span>
                    <Chip
                      label={fishSeedCompanyService.handleMapGeographicOrigin(item?.geographicOrigin!)}
                      color='warning'
                    />
                  </div>
                  <div className='mb-1 text-gray-400 text-sm'>
                    <span className='mr-2'>Method of reproduction: </span>
                    <Chip
                      label={fishSeedCompanyService.handleMapMethodOfReproduction(item?.methodOfReproduction!)}
                      color='secondary'
                    />
                  </div>
                  <div className='flex gap-1 items-center mb-2 text-gray-400 text-sm'>
                    <div>Water temperature in fish farming environment:</div>
                    <div className='font-bold'>{item?.waterTemperature}°C</div>
                    <DeviceThermostat color='error' />
                  </div>
                  <div className='flex-1'></div>
                  <div className=''>
                    <div className='inline-block mr-1'>Number of fish seeds ordered: </div>
                    <div className='inline-block'>{item.numberOfFishSeedsOrdered}kg</div>
                  </div>
                </div>
              </div>

              <div className='flex flex-row justify-between items-center'>
                <Typography variant='caption' className='block'>
                  Transaction hash: {item.fishSeedPurchaseOrderId}
                </Typography>
                <Typography variant='caption' className='block'>
                  Updated time: {formatTime(item.updatedAt)}
                </Typography>
                {/* {role === RoleType.fishSeedCompanyRole && (
                  <>
                    <LoadingButton
                      variant='contained'
                      color='success'
                      disabled={['Accepted', 'Rejected', 'Received'].includes(
                        statusStep[item.fishSeedsPurchaseOrderDetailsStatus].label,
                      )}
                      onClick={() => {
                        handleConfirm(item, true);
                      }}
                    >
                      Accept
                    </LoadingButton>
                    <LoadingButton
                      variant='contained'
                      color='error'
                      disabled={['Accepted', 'Rejected', 'Received'].includes(
                        statusStep[item.fishSeedsPurchaseOrderDetailsStatus].label,
                      )}
                      onClick={() => {
                        handleConfirm(item, false);
                      }}
                    >
                      Reject
                    </LoadingButton>
                  </>
                )}

                {role === RoleType.fishFarmerRole && (
                  <LoadingButton
                    variant='contained'
                    color='warning'
                    disabled={['Pending', 'Rejected', 'Received'].includes(
                      statusStep[item.fishSeedsPurchaseOrderDetailsStatus].label,
                    )}
                    onClick={() => {
                      handleRecieve(item);
                    }}
                  >
                    Received
                  </LoadingButton>
                )} */}
              </div>
            </div>
          ))}

          <div className='flex justify-center'>
            <Pagination
              page={currentPage ?? 1}
              count={totalPage}
              onChange={(event, value) => onSearchChange({ page: value })}
            />
          </div>
        </Spinner>
      </Container>
      <Dialog maxWidth='lg' open={openConfirmPopup} fullWidth>
        <ConfirmPopup item={selectedOrder} refetch={refetch} onClose={() => setOpenConfirmPopup(false)} />
      </Dialog>
    </>
  );
};

export default FishSeedCompanyFishFarmerOrders;
