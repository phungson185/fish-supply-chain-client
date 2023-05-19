import { useSearch } from 'hooks';
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
import { ProcessedFishOrderPopup } from 'views/Batch/components';
import { FishProcessingType } from 'types/FishProcessing';
import { useSelector } from 'react-redux';
import { profileSelector } from 'reducers/profile';
import { RoleType } from 'types/Auth';
import UpdateContractPopup from './popups/UpdateContractPopup';

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

const Inventory = () => {
  const { role, id } = useSelector(profileSelector);
  const param = useParams();
  const location = useLocation();
  const { tab, page = 1, ...query } = parse(location.search, { ignoreQueryPrefix: true });
  const [dataSearch, onSearchChange] = useSearch({
    page,
    size: 4,
    fishProcessor: param.fishProcessor,
  });

  const [orderBy, setOrderBy] = useState(query.orderBy || FILTERS[0].orderBy);
  const [desc, setDesc] = useState(query.desc || SORT_TYPES[0].desc);
  const [search, setSearch] = useState(query.search || '');
  const [params, setParams] = useState({ search, page });
  const [openOrderPopup, setOpenOrderPopup] = useState(false);
  const [selectedFish, setSelectedFish] = useState<FishProcessingType>({} as FishProcessingType);
  const [openUpdateContractPopup, setOpenUpdateContractPopup] = useState(false);

  const {
    data: inventory,
    isFetching: isFetchingInventory,
    refetch: refetchInventory,
  } = useQuery(['fishProcessorService.getProcessingContracts', dataSearch], () =>
    fishProcessorService.getProcessingContracts(dataSearch),
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
    onSearchChange({ orderBy, desc, ...params });
  }, [onSearchChange, orderBy, desc, params]);

  if (isFetchingInventory) return <></>;
  return (
    <>
      {items && items.length > 0 && (
        <Container className='bg-white p-5 rounded'>
          <Grid container spacing={2} justifyContent={items.length % 4 === 0 ? 'center' : 'left'} className='mb-10'>
            {items.map((item) => (
              <Grid item key={item.id}>
                <Card sx={{ width: 272, height: '100%' }}>
                  <CardMedia
                    sx={{ height: 200 }}
                    style={item.disable || item.numberOfPackets === 0 ? { filter: 'blur(3px)' } : {}}
                    image={item.image}
                    title='green iguana'
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
                          item.disable || item.numberOfPackets === 0
                            ? 'default'
                            : (fishSeedCompanyService.handleMapGeographicOrigin(item?.fishProcessorId.geographicOrigin!)
                                .color as any)
                        }
                      />
                      <Chip
                        label={
                          fishSeedCompanyService.handleMapMethodOfReproduction(item?.fishProcessorId.geographicOrigin!)
                            .label
                        }
                        color={
                          item.disable || item.numberOfPackets === 0
                            ? 'default'
                            : (fishSeedCompanyService.handleMapMethodOfReproduction(
                                item?.fishProcessorId.geographicOrigin!,
                              ).color as any)
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
                    >
                      Contract
                    </Button>
                    <div className='flex-1'></div>
                    {role === RoleType.fishProcessorRole && (
                      <Button
                        size='small'
                        variant='contained'
                        onClick={() => {
                          setSelectedFish(item);
                          setOpenUpdateContractPopup(true);
                        }}
                        disabled={item.disable || item.numberOfPackets === 0}
                      >
                        Update
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

      <Dialog open={openOrderPopup} fullWidth maxWidth='xs'>
        <ProcessedFishOrderPopup onClose={() => setOpenOrderPopup(false)} item={selectedFish} />
      </Dialog>

      <Dialog open={openUpdateContractPopup} fullWidth maxWidth='lg'>
        <UpdateContractPopup
          item={selectedFish}
          refetch={refetchInventory}
          onClose={() => setOpenUpdateContractPopup(false)}
        />
      </Dialog>
    </>
  );
};

export default Inventory;
