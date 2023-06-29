import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  Grid,
  Menu,
  MenuItem,
  Pagination,
  TextField,
  Typography,
  debounce,
} from '@mui/material';
import { ProcessStatus } from 'components/ConfirmStatus';
import { useAnchor, useSearch } from 'hooks';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import { parse } from 'qs';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { retailerService } from 'services';
import { RoleType } from 'types/Auth';
import { DistributorRetailerOrderType } from 'types/Retailer';
import { contractUrl, pinataUrl } from 'utils/common';
import ProductDetail from './popups/ProductDetail';
import { CategoryOutlined } from '@mui/icons-material';
import { DesktopDatePicker } from '@mui/x-date-pickers';

const FILTERS = [
  { label: 'Product name', orderBy: 'processedSpeciesName' },
  { label: 'Date of processing', orderBy: 'dateOfProcessing' },
  { label: 'Date of expiry', orderBy: 'dateOfExpiry' },
  { label: 'Fillets in packet', orderBy: 'filletsInPacket' },
  { label: 'Number of packets', orderBy: 'numberOfPackets' },
];

const DATE_FILTERS = [
  { label: 'All', value: null },
  { label: 'Date of processing', value: 'dateOfProcessing' },
  { label: 'Date of expiry', value: 'dateOfExpiry' },
];

const SORT_TYPES = [
  { label: 'Low to High', desc: 'false' },
  { label: 'High to Low', desc: 'true' },
];

const Inventory = () => {
  const { role, id } = useSelector(profileSelector);
  const { enqueueSnackbar } = useSnackbar();
  const param = useParams();
  const location = useLocation();
  const { tab, page = 1, ...query } = parse(location.search, { ignoreQueryPrefix: true });
  const [dataSearch, onSearchChange] = useSearch({
    page,
    size: 10,
    buyer: id,
    listing: false,
    status: ProcessStatus.Received,
  });

  const [orderBy, setOrderBy] = useState(query.orderBy || FILTERS[0].orderBy);
  const [desc, setDesc] = useState(query.desc || SORT_TYPES[0].desc);
  const [search, setSearch] = useState(query.search || '');
  const [params, setParams] = useState({ search, page });
  const [openOrderPopup, setOpenOrderPopup] = useState(false);
  const [selectedFish, setSelectedFish] = useState<DistributorRetailerOrderType>({} as DistributorRetailerOrderType);

  const [fromDate, setFromDate] = useState(query.fromDate || null);
  const [toDate, setToDate] = useState(query.toDate || null);
  const [valueFromDate, setValueFromDate] = useState(null);
  const [valueToDate, setValueToDate] = useState(null);
  const [dateFilter, setDateFilter] = useState(query.dateFilter || null);
  const [anchorDateFilter, openDateFilter, onOpenDateFilter, onCloseDateFilter] = useAnchor();
  const [anchorFilter, openFilter, onOpenFilter, onCloseFilter] = useAnchor();
  const [anchorSort, openSort, onOpenSort, onCloseSort] = useAnchor();

  const { mutate: updateFish } = useMutation(retailerService.updateOrder, {
    onSuccess: () => {
      enqueueSnackbar('Update sale status successfully', { variant: 'success' });
      refetchInventory();
    },
  });

  const {
    data: inventory,
    isFetching: isFetchingInventory,
    refetch: refetchInventory,
  } = useQuery(['retailerService.getOrders', dataSearch], () => retailerService.getOrders(dataSearch));

  const { items = [], total, currentPage, pages: totalPage } = inventory ?? {};

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceChangeParams = useCallback(
    debounce((values) => {
      setParams((prev) => ({ ...prev, ...values }));
    }, 300),
    [],
  );
  useEffect(() => {
    onSearchChange({ orderBy, desc, dateFilter, fromDate, toDate, ...params });
  }, [onSearchChange, orderBy, desc, dateFilter, fromDate, toDate, params]);

  const handleChangeFromDate = (value: any) => {
    setValueFromDate(value);
    setFromDate(value.ts);
  };

  const handleChangeToDate = (value: any) => {
    setValueToDate(value);
    setToDate(value.ts);
  };

  // if (isFetchingInventory) return <></>;
  return (
    <>
      <Container className='flex items-center justify-between bg-white p-5 rounded-t-3xl'>
        <TextField
          label='Search'
          InputProps={{ className: 'bg-white text-black ' }}
          value={search}
          sx={{ width: '30%' }}
          style={{ maxHeight: '48px' }}
          onChange={(event) => {
            const { value } = event.target;
            setSearch(value);
            debounceChangeParams({ search: value });
          }}
        />

        <div className='flex justify-between gap-2'>
          <Button
            variant='outlined'
            color='primary'
            classes={{ textInherit: 'bg-white hover:brightness-90 px-4' }}
            startIcon={<CategoryOutlined />}
            onClick={onOpenDateFilter}
          >
            {DATE_FILTERS.find((item) => item.value === dateFilter)?.label ?? DATE_FILTERS[0].label}
          </Button>
          <Menu
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            anchorEl={anchorDateFilter}
            open={openDateFilter}
            onClose={onCloseDateFilter}
            onClick={onCloseDateFilter}
          >
            {DATE_FILTERS.map((item, index) => (
              <MenuItem
                key={index}
                classes={{ selected: 'bg-info-light' }}
                selected={item.value === dateFilter}
                onClick={() => {
                  setDateFilter(item.value);
                }}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>

          <DesktopDatePicker
            label='From date'
            value={valueFromDate}
            onChange={handleChangeFromDate}
            renderInput={(params) => <TextField {...params} />}
            inputFormat='dd/MM/yyyy'
          />

          <DesktopDatePicker
            label='To date'
            value={valueToDate}
            onChange={handleChangeToDate}
            renderInput={(params) => <TextField {...params} />}
            inputFormat='dd/MM/yyyy'
          />
        </div>

        <div className='flex justify-between gap-2'>
          <Button
            variant='outlined'
            color='primary'
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
            variant='outlined'
            color='primary'
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
      </Container>

      {items && items.length > 0 && (
        <Container className='bg-white p-5 rounded'>
          <Grid container spacing={2} justifyContent={'left'} className='mb-10'>
            {items.map((item) => (
              <Grid item key={item.id}>
                <Card sx={{ width: 272, height: '100%' }}>
                  <CardMedia
                    onClick={() => {
                      setSelectedFish(item);
                      setOpenOrderPopup(true);
                    }}
                    className='cursor-pointer'
                    sx={{ height: 200 }}
                    image={item.image}
                    title='green iguana'
                  />
                  <CardContent>
                    <div className='flex flex-row gap-2 items-center mb-2'>
                      <Typography variant='h5'>{item.speciesName}</Typography>
                      <div className='flex-1'></div>
                    </div>
                    <div className='mb-5'>
                      <Typography variant='caption'>
                        Expired: {moment(item.dateOfProcessing).format('DD/MM/YYYY')} ~{' '}
                        {moment(item.dateOfExpiry).format('DD/MM/YYYY')}
                      </Typography>
                    </div>
                    <Typography variant='body2' className='mb-1'>
                      Fillets in packet: <span className='font-bold'>{item.filletsInPacket}</span> fillets
                    </Typography>
                    <Typography variant='body2'>
                      Number of packets: <span className='font-bold'>{item.numberOfPackets}</span> packets
                    </Typography>
                  </CardContent>
                  <CardActions className='flex flex-row gap-1'>
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
                      onClick={() =>
                        window.open(contractUrl(item.distributorId.fishProcessingId.processingContract), '_blank')
                      }
                    >
                      Contract
                    </Button>
                    <div className='flex-1'></div>
                    {role === RoleType.retailerRole && (
                      <Button
                        size='small'
                        className='whitespace-nowrap'
                        variant='contained'
                        disabled={item.disable || item.numberOfPackets === 0}
                        onClick={() => {
                          setSelectedFish(item);
                          updateFish({
                            orderId: item.id,
                            listing: !item.listing,
                          });
                        }}
                        color={item.listing ? 'error' : 'success'}
                      >
                        {item.listing ? 'Unlist for sale' : 'List for sale'}
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <div className='flex justify-center'>
            <Pagination
              page={currentPage ?? 1}
              count={totalPage}
              onChange={(event, value) => onSearchChange({ page: value })}
            />
          </div>
        </Container>
      )}

      {items && items.length === 0 && (
        <Avatar className='h-96 w-96 mx-auto my-auto' src={require('assets/images/no-product-found.png').default} />
      )}

      <Dialog open={openOrderPopup} fullWidth maxWidth='md'>
        <ProductDetail refetch={refetchInventory} onClose={() => setOpenOrderPopup(false)} item={selectedFish} />
      </Dialog>
    </>
  );
};

export default Inventory;
