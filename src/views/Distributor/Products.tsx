import { useSearch } from 'hooks';
import { parse } from 'qs';
import { useQuery } from 'react-query';
import { useLocation, useParams } from 'react-router-dom';
import { distributorService, fishProcessorService, fishSeedCompanyService } from 'services';
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
  Pagination,
  Typography,
  debounce,
} from '@mui/material';
import {
  AccountBalanceWalletOutlined,
  ApartmentOutlined,
  EmailOutlined,
  HomeOutlined,
  Inventory2Outlined,
  LocalPhoneOutlined,
} from '@mui/icons-material';
import { formatTime, pinataUrl, shorten } from 'utils/common';
import moment from 'moment';
import { FishOfDistributorOrderPopup, ProcessedFishOrderPopup } from 'views/Batch/components';
import { FishProcessingType } from 'types/FishProcessing';
import { useSelector } from 'react-redux';
import { profileSelector } from 'reducers/profile';
import { RoleType } from 'types/Auth';
import { FishProcessorDistributorOrderType } from 'types/Distributor';
import ProductDetail from './popups/ProductDetail';
import { ProcessStatus } from 'components/ConfirmStatus';

const FILTERS = [
  { label: 'Species name', orderBy: 'speciesName' },
  { label: 'Geographic origin', orderBy: 'geographicOrigin' },
  { label: 'Number of fish seeds available', orderBy: 'numberOfFishSeedsAvailable' },
  { label: 'Aquaculture water type', orderBy: 'aquacultureWaterType' },
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
    status: ProcessStatus.Received,
    owner: param.distributor,
    disable: false,
    isHavePackets: true,
    listing: true,
  });

  const [orderBy, setOrderBy] = useState(query.orderBy || FILTERS[0].orderBy);
  const [desc, setDesc] = useState(query.desc || SORT_TYPES[0].desc);
  const [search, setSearch] = useState(query.search || '');
  const [params, setParams] = useState({ search, page });
  const [openProductDetailPop, setOpenProductDetailPop] = useState(false);
  const [openOrderPopup, setOpenOrderPopup] = useState(false);
  const [selectedFish, setSelectedFish] = useState<FishProcessorDistributorOrderType>(
    {} as FishProcessorDistributorOrderType,
  );

  const { data: profile, isSuccess: isSuccessProfile } = useQuery('distributorService.getProfileInventory', () =>
    distributorService.getProfileInventory({ id: param.distributor ?? id }),
  ) as {
    data: ProfileInventoryType;
    isSuccess: boolean;
  };

  const {
    data: inventory,
    isFetching: isFetchingInventory,
    refetch: refetchInventory,
  } = useQuery(['distributorService.getOrders', dataSearch], () => distributorService.getOrders(dataSearch), {
    keepPreviousData: false,
    staleTime: 0,
  });

  const { items = [], total, currentPage, pages: totalPage } = inventory ?? {};

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

  if (!isSuccessProfile || isFetchingInventory) return <></>;
  return (
    <>
      <Container className='bg-white p-5 rounded mb-10'>
        <Grid container spacing={2} alignItems={'center'}>
          <Grid item xs={4} className='relative'>
            <>
              <div className='relative'>
                <div className='bg-cover bg-center rounded-lg h-48 w-96 m-auto overflow-hidden'>
                  <img
                    className='w-full h-full object-cover'
                    src={profile.user.cover}
                    style={{ filter: 'blur(3px)' }}
                    alt='Cover Photo'
                  />
                </div>
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                  <div className='bg-white rounded-full border-1 border-white h-32 w-32'>
                    <img className='rounded-full w-full h-full object-cover' src={profile.user.avatar} alt='Avatar' />
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
                  <div className='text-primary-main'>{shorten(profile.user.address)}</div>
                </div>
                <div className='flex items-center gap-2 mb-5'>
                  <ApartmentOutlined className='' />
                  <div className=''>Name: </div>
                  <div className='text-primary-main'>{profile.user.name}</div>
                </div>
                <div className='flex items-center gap-2 mb-5'>
                  <HomeOutlined className='' />
                  <div className=''>Address: </div>
                  <div className='text-primary-main'>{profile.user.userAddress}</div>
                </div>
              </div>
              <div>
                <div className='flex items-center gap-2 mb-5'>
                  <LocalPhoneOutlined className='' />
                  <div className=''>Phone number: </div>
                  <div className='text-primary-main'>{profile.user.phone}</div>
                </div>
                <div className='flex items-center gap-2 mb-5'>
                  <EmailOutlined className='' />
                  <div className=''>Email: </div>
                  <div className='text-primary-main'>{profile.user.email}</div>
                </div>
                <div className='flex items-center gap-2 mb-5'>
                  <Inventory2Outlined className='' />
                  <div className=''>Contracts: </div>
                  <div className='text-primary-main'>{profile.fishProcessing}</div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>

      {items && items.length > 0 && (
        <Container className='bg-white p-5 rounded'>
          <Grid container spacing={2} justifyContent={items.length % 4 === 0 ? 'center' : 'left'} className='mb-10'>
            {items.map((item) => (
              <Grid item key={item.id}>
                <Card sx={{ width: 272, height: '100%' }}>
                  <CardMedia
                    onClick={() => {
                      setSelectedFish(item);
                      setOpenProductDetailPop(true);
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
                      onClick={() => window.open(pinataUrl(item.IPFSHash), '_blank')}
                    >
                      Document
                    </Button>
                    <Button size='small' variant='contained' color='secondary'>
                      Contract
                    </Button>
                    <div className='flex-1'></div>
                    {role === RoleType.retailerRole && (
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

      <Dialog open={openProductDetailPop} fullWidth maxWidth='md'>
        <ProductDetail onClose={() => setOpenProductDetailPop(false)} item={selectedFish} />
      </Dialog>

      <Dialog open={openOrderPopup} fullWidth maxWidth='xs'>
        <FishOfDistributorOrderPopup
          refetch={refetchInventory}
          onClose={() => setOpenOrderPopup(false)}
          item={selectedFish}
        />
      </Dialog>
    </>
  );
};

export default Products;