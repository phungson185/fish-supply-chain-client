import { useAnchor, useSearch } from 'hooks';
import { parse } from 'qs';
import { useQuery } from 'react-query';
import { useLocation, useParams } from 'react-router-dom';
import { fishProcessorService, fishSeedCompanyService } from 'services';
import { ProfileInventoryType } from 'types/FishProcessor';
import { useCallback, useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
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
import {
  AccountBalanceWalletOutlined,
  ApartmentOutlined,
  CategoryOutlined,
  EmailOutlined,
  HomeOutlined,
  Inventory2Outlined,
  LocalPhoneOutlined,
} from '@mui/icons-material';
import { contractUrl, formatTime, pinataUrl, shorten } from 'utils/common';
import moment from 'moment';
import { ProcessedFishOrderPopup } from 'views/Batch/components';
import { FishProcessingType } from 'types/FishProcessing';
import { useSelector } from 'react-redux';
import { profileSelector } from 'reducers/profile';
import { RoleType } from 'types/Auth';
import ProductDetail from './popups/ProductDetail';
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

const Products = () => {
  const { role, id } = useSelector(profileSelector);
  const param = useParams();
  const location = useLocation();
  const { tab, page = 1, ...query } = parse(location.search, { ignoreQueryPrefix: true });
  const [dataSearch, onSearchChange] = useSearch({
    page,
    size: 4,
    fishProcessor: param.fishProcessor,
    disable: false,
    isHavePackets: true,
    listing: true,
  });

  const [orderBy, setOrderBy] = useState(query.orderBy || FILTERS[0].orderBy);
  const [desc, setDesc] = useState(query.desc || SORT_TYPES[0].desc);
  const [search, setSearch] = useState(query.search || '');
  const [params, setParams] = useState({ search, page });
  const [openOrderPopup, setOpenOrderPopup] = useState(false);
  const [selectedFish, setSelectedFish] = useState<FishProcessingType>({} as FishProcessingType);
  const [openProductDetailPop, setOpenProductDetailPop] = useState(false);

  const [fromDate, setFromDate] = useState(query.fromDate || null);
  const [toDate, setToDate] = useState(query.toDate || null);
  const [valueFromDate, setValueFromDate] = useState(null);
  const [valueToDate, setValueToDate] = useState(null);
  const [dateFilter, setDateFilter] = useState(query.dateFilter || null);
  const [anchorDateFilter, openDateFilter, onOpenDateFilter, onCloseDateFilter] = useAnchor();
  const [anchorFilter, openFilter, onOpenFilter, onCloseFilter] = useAnchor();
  const [anchorSort, openSort, onOpenSort, onCloseSort] = useAnchor();

  const { data: profile, isSuccess: isSuccessProfile } = useQuery('fishProcessorService.getProfileInventory', () =>
    fishProcessorService.getProfileInventory({ id: param.fishProcessor ?? id }),
  ) as {
    data: ProfileInventoryType;
    isSuccess: boolean;
  };

  const {
    data: inventory,
    isFetching: isFetchingInventory,
    refetch: refetchInventory,
  } = useQuery(
    ['fishProcessorService.getProcessingContracts', dataSearch],
    () => fishProcessorService.getProcessingContracts(dataSearch),
    {
      keepPreviousData: false,
      staleTime: 0,
    },
  );

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

  return (
    <>
      <Container className='bg-white p-5 rounded-3xl mb-10'>
        <Grid container spacing={2} alignItems={'center'}>
          <Grid item xs={4} className='relative'>
            <>
              <div className='relative'>
                <div className='bg-cover bg-center rounded-lg h-48 w-96 m-auto overflow-hidden'>
                  <img
                    className='w-full h-full object-cover'
                    src={profile?.user.cover}
                    style={{ filter: 'blur(3px)' }}
                    alt='Cover Photo'
                  />
                </div>
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                  <div className='bg-white rounded-full border-1 border-white h-32 w-32'>
                    <img className='rounded-full w-full h-full object-cover' src={profile?.user.avatar} alt='Avatar' />
                  </div>
                </div>
              </div>
            </>
          </Grid>
          <Grid item xs={8}>
            <div className='flex flex-row justify-between p-10'>
              <div>
                <div className='flex items-center gap-2 mb-5'>
                  <AccountBalanceWalletOutlined className='' />
                  <div className=''>Wallet address: </div>
                  <div className='text-primary-main'>{shorten(profile?.user.address)}</div>
                </div>
                <div className='flex items-center gap-2 mb-5'>
                  <ApartmentOutlined className='' />
                  <div className=''>Name: </div>
                  <div className='text-primary-main'>{profile?.user.name}</div>
                </div>
                <div className='flex items-center gap-2 mb-5'>
                  <HomeOutlined className='' />
                  <div className=''>Address: </div>
                  <div className='text-primary-main'>{profile?.user.userAddress}</div>
                </div>
              </div>
              <div>
                <div className='flex items-center gap-2 mb-5'>
                  <LocalPhoneOutlined className='' />
                  <div className=''>Phone number: </div>
                  <div className='text-primary-main'>{profile?.user.phone}</div>
                </div>
                <div className='flex items-center gap-2 mb-5'>
                  <EmailOutlined className='' />
                  <div className=''>Email: </div>
                  <div className='text-primary-main'>{profile?.user.email}</div>
                </div>
                <div className='flex items-center gap-2 mb-5'>
                  <Inventory2Outlined className='' />
                  <div className=''>Contracts: </div>
                  <div className='text-primary-main'>{profile?.fishProcessing}</div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>

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
        <Container className='bg-white p-5 rounded-b-3xl'>
          <Grid container spacing={2} justifyContent={items.length % 4 === 0 ? 'center' : 'left'} className='mb-10'>
            {items.map((item, index) => (
              <Grid item key={index}>
                <Card sx={{ width: 272, height: '100%' }}>
                  <CardMedia
                    sx={{ height: 200 }}
                    image={item.image}
                    title='green iguana'
                    onClick={() => {
                      setSelectedFish(item);
                      setOpenProductDetailPop(true);
                    }}
                  />
                  <CardContent>
                    <div className='flex flex-row gap-2 items-center mb-2'>
                      <Typography variant='h5'>{item.processedSpeciesName}</Typography>
                      <div className='flex-1'></div>
                      <Chip
                        label={
                          fishSeedCompanyService.handleMapGeographicOrigin(item?.fishProcessorId.geographicOrigin!)
                            .label
                        }
                        color={
                          fishSeedCompanyService.handleMapGeographicOrigin(item?.fishProcessorId.geographicOrigin!)
                            .color as any
                        }
                      />
                      <Chip
                        label={
                          fishSeedCompanyService.handleMapMethodOfReproduction(
                            item?.fishProcessorId.methodOfReproduction!,
                          ).label
                        }
                        color={
                          fishSeedCompanyService.handleMapMethodOfReproduction(
                            item?.fishProcessorId.methodOfReproduction!,
                          ).color as any
                        }
                      />
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
                      onClick={() => window.open(pinataUrl(item.IPFSHash), '_blank')}
                    >
                      Document
                    </Button>
                    <Button
                      size='small'
                      variant='contained'
                      color='secondary'
                      onClick={() => window.open(contractUrl(item.processingContract), '_blank')}
                    >
                      Contract
                    </Button>
                    <div className='flex-1'></div>
                    {role === RoleType.distributorRole && (
                      <Button
                        size='small'
                        variant='contained'
                        onClick={() => {
                          setSelectedFish(item);
                          setOpenOrderPopup(true);
                        }}
                      >
                        Order
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

      <Dialog open={openOrderPopup} fullWidth maxWidth='xs'>
        <ProcessedFishOrderPopup onClose={() => setOpenOrderPopup(false)} item={selectedFish} />
      </Dialog>

      <Dialog open={openProductDetailPop} fullWidth maxWidth='xl'>
        <ProductDetail onClose={() => setOpenProductDetailPop(false)} item={selectedFish} />
      </Dialog>
    </>
  );
};

export default Products;
