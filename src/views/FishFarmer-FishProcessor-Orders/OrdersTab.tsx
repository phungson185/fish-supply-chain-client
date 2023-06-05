import { BalanceOutlined, CategoryOutlined, ViewListOutlined } from '@mui/icons-material';
import {
  Avatar,
  Button,
  Chip,
  Dialog,
  Menu,
  MenuItem,
  Pagination,
  TextField,
  Typography,
  debounce,
} from '@mui/material';
import { Spinner } from 'components';
import { ProcessStatus, statusStep } from 'components/ConfirmStatus';
import { useAnchor, useSearch } from 'hooks';
import { parse } from 'qs';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { fishProcessorService, fishSeedCompanyService } from 'services';
import { RoleType } from 'types/Auth';
import { FishFarmerFishProcessorOrderType } from 'types/FishProcessor';
import { formatTime } from 'utils/common';
import { ConfirmPopup } from './popups';

const FILTERS = [
  { label: 'Species name', orderBy: 'speciesName' },
  { label: 'Geographic origin', orderBy: 'geographicOrigin' },
  { label: 'Method of reproduction', orderBy: 'methodOfReproduction' },
  { label: 'Number of fish ordered', orderBy: 'numberOfFishOrdered' },
  {
    label: 'Updated time',
    orderBy: 'updatedAt',
  },
];

const SORT_TYPES = [
  { label: 'Low to High', desc: 'false' },
  { label: 'High to Low', desc: 'true' },
];

const OrdersTab = ({ status }: { status: ProcessStatus }) => {
  const { id, role } = useSelector(profileSelector);

  const location = useLocation();
  const { tab, page = 1, ...query } = parse(location.search, { ignoreQueryPrefix: true });
  const [dataSearch, onSearchChange] = useSearch({
    page,
    farmedFishSeller: role === RoleType.fishFarmerRole ? id : undefined,
    farmedFishPurchaser: role === RoleType.fishProcessorRole ? id : undefined,
    status: status === ProcessStatus.All ? undefined : status,
  });
  const [anchorFilter, openFilter, onOpenFilter, onCloseFilter] = useAnchor();
  const [anchorSort, openSort, onOpenSort, onCloseSort] = useAnchor();
  const { data, isFetching, refetch } = useQuery(
    ['fishProcessorService.getOrders', dataSearch],
    () => fishProcessorService.getOrders(dataSearch),
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
  const [selectedOrder, setSelectedOrder] = useState<FishFarmerFishProcessorOrderType>(
    {} as FishFarmerFishProcessorOrderType,
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

  return (
    <>
      <div className='flex items-center justify-between mb-5'>
        <TextField
          label='Search'
          InputProps={{ className: 'bg-white text-black' }}
          value={search}
          sx={{ width: '60%' }}
          onChange={(event) => {
            const { value } = event.target;
            setSearch(value);
            debounceChangeParams({ search: value });
          }}
        />

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
      </div>
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
              <Avatar
                src={
                  role === RoleType.fishProcessorRole
                    ? item.farmedFishSeller.avatar ?? ''
                    : item.farmedFishPurchaser.avatar ?? ''
                }
              />
              <div className='font-bold'>
                {role === RoleType.fishProcessorRole
                  ? item.farmedFishSeller.name ?? ''
                  : item.farmedFishPurchaser.name ?? ''}
              </div>
              <div className='flex-1'></div>
              {statusStep.find((step) => step.code === item.status)?.component}
              {statusStep.find((step) => step.code === item.status)?.description}
            </div>

            <div className='flex flex-row gap-3 border-b-2 border-solid border-gray-200 pb-3 mb-3'>
              <Avatar variant='square' src={item.image ?? ''} sx={{ width: 240, height: 240 }} />
              <div>
                <div className='mb-5 text-xl font-bold'>{item.speciesName}</div>
                <div className='mb-1 text-gray-400 text-sm'>
                  <span className='mr-2'>Geopraphic origin: </span>
                  <Chip
                    label={fishSeedCompanyService.handleMapGeographicOrigin(item?.geographicOrigin!).label}
                    color={fishSeedCompanyService.handleMapGeographicOrigin(item?.geographicOrigin!).color as any}
                  />
                </div>
                <div className='mb-1 text-gray-400 text-sm'>
                  <span className='mr-2'>Method of reproduction: </span>
                  <Chip
                    label={fishSeedCompanyService.handleMapMethodOfReproduction(item?.methodOfReproduction!).label}
                    color={
                      fishSeedCompanyService.handleMapMethodOfReproduction(item?.methodOfReproduction!).color as any
                    }
                  />
                </div>
                <div className='flex-1'></div>
                <div className=''>
                  <div className='inline-block mr-1'>Number of fishs ordered: </div>
                  <div className='inline-block mr-1'>{item.numberOfFishOrdered}kg</div>
                  <BalanceOutlined className='inline-block' color='primary' />
                </div>
              </div>
            </div>

            <div className='flex flex-row justify-between items-center'>
              <Typography variant='caption' className='block'>
                Transaction hash: {item.transactionHash}
              </Typography>
              <Typography variant='caption' className='block'>
                Updated time: {formatTime(item.updatedAt)}
              </Typography>
            </div>
          </div>
        ))}

        {items.length > 0 && (
          <div className='flex justify-center'>
            <Pagination
              page={currentPage ?? 1}
              count={totalPage}
              onChange={(event, value) => onSearchChange({ page: value })}
            />
          </div>
        )}

        {items.length === 0 && (
          <div className='flex flex-col gap-5 items-center justify-center'>
            <ViewListOutlined color='disabled' style={{ fontSize: '400px' }} />
            <div className='text-3xl font-medium'>No order not found</div>
          </div>
        )}
      </Spinner>
      <Dialog maxWidth='lg' open={openConfirmPopup} fullWidth>
        <ConfirmPopup item={selectedOrder} refetch={refetch} onClose={() => setOpenConfirmPopup(false)} />
      </Dialog>
    </>
  );
};
export default OrdersTab;
