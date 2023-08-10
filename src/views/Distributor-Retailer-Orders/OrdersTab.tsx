import { CategoryOutlined, Inventory2Outlined, SetMealOutlined } from '@mui/icons-material';
import { Avatar, Button, Dialog, Menu, MenuItem, Pagination, TextField, Typography, debounce } from '@mui/material';
import { Spinner } from 'components';
import { ProcessStatus, statusStep } from 'components/ConfirmStatus';
import { useAnchor, useSearch } from 'hooks';
import { parse } from 'qs';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { retailerService } from 'services';
import { RoleType } from 'types/Auth';
import { DistributorRetailerOrderType } from 'types/Retailer';
import { formatTime, formatTimeDate } from 'utils/common';
import { ConfirmPopup } from './popups';
import { DesktopDatePicker } from '@mui/x-date-pickers';

const FILTERS = [
  {
    label: 'Updated time',
    orderBy: 'updatedAt',
  },
  { label: 'Species name', orderBy: 'speciesName' },
  { label: 'Quantity of fish package ordered', orderBy: 'quantityOfFishPackageOrdered' },
  { label: 'Date of processing', orderBy: 'dateOfProcessing' },
  { label: 'Date of expiry', orderBy: 'dateOfExpiry' },
  { label: 'Number of packets', orderBy: 'numberOfPackets' },
  { label: 'Fillets in packet', orderBy: 'filletsInPacket' },
];

const DATE_FILTERS = [
  { label: 'All', value: null },
  { label: 'Date of processing', value: 'dateOfProcessing' },
  { label: 'Date of expiry', value: 'dateOfExpiry' },
];

const SORT_TYPES = [
  { label: 'High to Low', desc: 'true' },
  { label: 'Low to High', desc: 'false' },
];

const OrdersTab = ({ status }: { status: ProcessStatus }) => {
  const { id, role } = useSelector(profileSelector);

  const location = useLocation();
  const { tab, page = 1, ...query } = parse(location.search, { ignoreQueryPrefix: true });
  const [dataSearch, onSearchChange] = useSearch({
    page,
    seller: role === RoleType.distributorRole ? id : undefined,
    buyer: role === RoleType.retailerRole ? id : undefined,
    status: status === ProcessStatus.All ? undefined : status,
  });
  const [anchorFilter, openFilter, onOpenFilter, onCloseFilter] = useAnchor();
  const [anchorSort, openSort, onOpenSort, onCloseSort] = useAnchor();
  const { data, isFetching, refetch } = useQuery(
    ['retailerService.getOrders', dataSearch],
    () => retailerService.getOrders(dataSearch),
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
  const [selectedOrder, setSelectedOrder] = useState<DistributorRetailerOrderType>({} as DistributorRetailerOrderType);

  const [fromDate, setFromDate] = useState(query.fromDate || null);
  const [toDate, setToDate] = useState(query.toDate || null);
  const [valueFromDate, setValueFromDate] = useState(null);
  const [valueToDate, setValueToDate] = useState(null);
  const [anchorDateFilter, openDateFilter, onOpenDateFilter, onCloseDateFilter] = useAnchor();
  const [dateFilter, setDateFilter] = useState(query.dateFilter || null);

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
      <div className='flex items-center justify-between mb-5'>
        <TextField
          label='Search'
          InputProps={{ className: 'bg-white text-black' }}
          value={search}
          sx={{ width: '30%' }}
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
              <Avatar src={role === RoleType.fishProcessorRole ? item.buyer.avatar ?? '' : item.seller.avatar ?? ''} />
              <div className='font-bold'>
                {role === RoleType.fishProcessorRole ? item.buyer.name ?? '' : item.seller.name ?? ''}
              </div>
              <div className='flex-1'></div>
              {statusStep.find((step) => step.code === item.status)?.component}
              {statusStep.find((step) => step.code === item.status)?.description}
            </div>

            <div className='flex flex-row gap-3 border-b-2 border-solid border-gray-200 pb-3 mb-3'>
              <Avatar variant='square' src={item.image ?? ''} sx={{ width: 240, height: 240 }} />
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
      </Spinner>
      <Dialog maxWidth='lg' open={openConfirmPopup} fullWidth>
        <ConfirmPopup item={selectedOrder} refetch={refetch} onClose={() => setOpenConfirmPopup(false)} />
      </Dialog>
    </>
  );
};
export default OrdersTab;
