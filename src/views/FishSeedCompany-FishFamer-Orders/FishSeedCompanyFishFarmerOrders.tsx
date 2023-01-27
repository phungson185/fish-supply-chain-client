import { CategoryOutlined } from '@mui/icons-material';
import {
  Button,
  debounce,
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
import { Spinner, StatusButton, TableRowEmpty } from 'components';
import { useAnchor, useSearch } from 'hooks';
import { parse } from 'qs';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { fishFarmerService } from 'services';
import { status } from 'utils/status';

const FILTERS = [{ label: 'Number of fish seeds ordered', orderBy: 'numberOfFishSeedsOrdered' }];

const SORT_TYPES = [
  { label: 'Low to High', desc: 'false' },
  { label: 'High to Low', desc: 'true' },
];

const FishSeedCompanyFishFarmerOrders = () => {
  const location = useLocation();
  const { tab, page = 1, ...query } = parse(location.search, { ignoreQueryPrefix: true });
  const [dataSearch, onSearchChange] = useSearch({ page });
  const [anchorFilter, openFilter, onOpenFilter, onCloseFilter] = useAnchor();
  const [anchorSort, openSort, onOpenSort, onCloseSort] = useAnchor();

  const { data, isFetching } = useQuery(['fishFarmerService.getOrders', dataSearch], () =>
    fishFarmerService.getOrders(dataSearch),
  );

  const { items = [], total, currentPage, pages: totalPage } = data ?? {};
  const [orderBy, setOrderBy] = useState(query.orderBy || FILTERS[0].orderBy);
  const [desc, setDesc] = useState(query.desc || SORT_TYPES[0].desc);
  const [search, setSearch] = useState(query.search || '');
  const [params, setParams] = useState({ search, page });
  const [openCreatePopup, setOpenCreatePopup] = useState(false);

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
                  <TableCell align='center'>{item.fishSeedsPurchaser.address}</TableCell>
                  <TableCell align='center'>{item.fishSeedsSeller.address}</TableCell>
                  <TableCell align='center'>{item.numberOfFishSeedsOrdered}</TableCell>
                  <TableCell align='center'>
                    <StatusButton
                      content={`${status[item.fishSeedsPurchaseOrderDetailsStatus].label}`}
                      backgroundColor={`${status[item.fishSeedsPurchaseOrderDetailsStatus].color}`}
                    />
                  </TableCell>
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
    </>
  );
};

export default FishSeedCompanyFishFarmerOrders;