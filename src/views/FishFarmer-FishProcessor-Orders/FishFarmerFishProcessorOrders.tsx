import { CategoryOutlined } from '@mui/icons-material';
import {
  Button,
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
} from '@mui/material';
import { Spinner, TableRowEmpty } from 'components';
import { statusStep } from 'components/ConfirmStatus';
import { useAnchor, useSearch } from 'hooks';
import { parse } from 'qs';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { fishProcessorService } from 'services';
import { RoleType } from 'types/Auth';
import { FishFarmerFishProcessorOrderType } from 'types/FishProcessor';
import { ConfirmPopup } from './popups';
import CreateContractPopup from './popups/CreateContractPopup';

const FILTERS = [
  { label: 'Number of fish ordered', orderBy: 'numberOfFishOrdered' },
  { label: 'Species name', orderBy: 'speciesName' },
];

const SORT_TYPES = [
  { label: 'Low to High', desc: 'false' },
  { label: 'High to Low', desc: 'true' },
];

const FishFarmerFishProcessorOrders = () => {
  const location = useLocation();
  const { tab, page = 1, ...query } = parse(location.search, { ignoreQueryPrefix: true });
  const [dataSearch, onSearchChange] = useSearch({ page });
  const [anchorFilter, openFilter, onOpenFilter, onCloseFilter] = useAnchor();
  const [anchorSort, openSort, onOpenSort, onCloseSort] = useAnchor();
  const { role } = useSelector(profileSelector);
  const { data, isFetching, refetch } = useQuery(
    ['fishProcessorService.getOrders', dataSearch],
    () => fishProcessorService.getOrders(dataSearch),
    {
      keepPreviousData: true,
      staleTime: 0,
    },
  );

  const { items = [], total, currentPage, pages: totalPage } = data ?? {};
  const [orderBy, setOrderBy] = useState(query.orderBy || FILTERS[0].orderBy);
  const [desc, setDesc] = useState(query.desc || SORT_TYPES[0].desc);
  const [search, setSearch] = useState(query.search || '');
  const [params, setParams] = useState({ search, page });
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [openCreateContractPopup, setOpenCreateContractPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<FishFarmerFishProcessorOrderType>(
    {} as FishFarmerFishProcessorOrderType,
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  //   const debounceChangeParams = useCallback(
  //     debounce((values) => {
  //       setParams((prev) => ({ ...prev, ...values }));
  //     }, 300),
  //     [],
  //   );
  useEffect(() => {
    onSearchChange({ orderBy, desc, ...params });
  }, [onSearchChange, orderBy, desc, params]);

  return (
    <>
      <div className='flex items-center justify-between'>
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
      <TableContainer component={Paper}>
        <Spinner loading={isFetching}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Farmed fish purchaser</TableCell>
                <TableCell>Farmed fish seller</TableCell>
                <TableCell>Species name</TableCell>
                <TableCell>Number of fish ordered (kg)</TableCell>
                <TableCell>Status</TableCell>
                {role === RoleType.fishProcessorRole && <TableCell>Action</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell align='center'>{item.id}</TableCell>
                  <TableCell align='center'>{item.farmedFishPurchaser.address}</TableCell>
                  <TableCell align='center'>{item.farmedFishSeller.address}</TableCell>
                  <TableCell align='center'>{item.speciesName}</TableCell>
                  <TableCell align='center'>{item.numberOfFishOrdered}</TableCell>
                  <TableCell align='center'>
                    <Button
                      variant='contained'
                      sx={{
                        backgroundColor: `${statusStep[item.status].color}`,
                        color: 'white',
                      }}
                      onClick={() => {
                        setSelectedOrder(item);
                        setOpenConfirmPopup(true);
                      }}
                      disabled={item.status === 6}
                    >
                      {`${statusStep[item.status].label}`}
                    </Button>
                  </TableCell>
                  {role == RoleType.fishProcessorRole && (
                    <TableCell align='center'>
                      <Button
                        variant='contained'
                        onClick={() => {
                          setOpenCreateContractPopup(true);
                          setSelectedOrder(item);
                        }}
                        disabled={item.status !== 4}
                      >
                        Create contract
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              <TableRowEmpty visible={!isFetching && items.length === 0} />
            </TableBody>
            <caption className='font-bold border-t'>{total ?? 0} Contracts</caption>
          </Table>
        </Spinner>
      </TableContainer>

      <div className='flex justify-center'>
        <Pagination
          page={currentPage ?? 1}
          count={totalPage}
          onChange={(event, value) => onSearchChange({ page: value })}
        />
      </div>

      <Dialog maxWidth='lg' open={openConfirmPopup} fullWidth>
        <ConfirmPopup item={selectedOrder} refetch={refetch} onClose={() => setOpenConfirmPopup(false)} />
      </Dialog>

      <Dialog maxWidth='sm' open={openCreateContractPopup} fullWidth>
        <CreateContractPopup item={selectedOrder} refetch={refetch} onClose={() => setOpenCreateContractPopup(false)} />
      </Dialog>
    </>
  );
};

export default FishFarmerFishProcessorOrders;