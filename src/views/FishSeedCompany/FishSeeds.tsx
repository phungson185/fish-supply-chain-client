import { Assignment, CategoryOutlined, Visibility } from '@mui/icons-material';

import {
  Avatar,
  Button,
  Chip,
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
  TextField,
  debounce,
} from '@mui/material';
import { Spinner, TableRowEmpty } from 'components';
import { useAnchor, useSearch } from 'hooks';
import { parse } from 'qs';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { getRoute } from 'routes';
import { fishSeedCompanyService } from 'services';
import { formatTime, pinataUrl } from 'utils/common';
import AddFishSeedPopup from './popups/AddFishSeedPopup';

const FILTERS = [
  { label: 'Update time', orderBy: 'updatedAt' },
  { label: 'Species name', orderBy: 'speciesName' },
  { label: 'Geographic origin', orderBy: 'geographicOrigin' },
  { label: 'Method of reproduction', orderBy: 'methodOfReproduction' },
  { label: 'Water temperature', orderBy: 'waterTemperature' },
  { label: 'Quantity', orderBy: 'quantity' },
];

const SORT_TYPES = [
  { label: 'High to Low', desc: 'true' },
  { label: 'Low to High', desc: 'false' },
];

const FishSeeds = () => {
  const location = useLocation();
  const { tab, page = 1, ...query } = parse(location.search, { ignoreQueryPrefix: true });
  const [dataSearch, onSearchChange] = useSearch({ page });
  const { role } = useSelector(profileSelector);
  const navigate = useNavigate();
  const [anchorFilter, openFilter, onOpenFilter, onCloseFilter] = useAnchor();
  const [anchorSort, openSort, onOpenSort, onCloseSort] = useAnchor();
  const privateRoute = getRoute(role);

  const { data, isFetching, refetch } = useQuery(
    ['fishSeedCompanyService.getFishSeeds', dataSearch],
    () => fishSeedCompanyService.getFishSeeds(dataSearch),
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
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openAddFishSeedPopup, setOpenAddFishSeedPopup] = useState(false);

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

        <Button
          variant='contained'
          onClick={() => {
            setOpenAddFishSeedPopup(true);
          }}
        >
          Add fish seed
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Spinner loading={isFetching}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Species name</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Geographic origin</TableCell>
                <TableCell>Method of reproduction</TableCell>
                <TableCell>Water temperature</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>IPFS hash</TableCell>
                <TableCell>Update time</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell align='center'>{item.speciesName}</TableCell>
                  <TableCell align='center'>
                    <Avatar src={item.image} variant='square'>
                      <Assignment />
                    </Avatar>
                  </TableCell>
                  <TableCell align='center'>
                    <Chip
                      label={fishSeedCompanyService.handleMapGeographicOrigin(item?.geographicOrigin!).label}
                      color={fishSeedCompanyService.handleMapGeographicOrigin(item?.geographicOrigin!).color as any}
                    />
                  </TableCell>
                  <TableCell align='center'>
                    <Chip
                      label={fishSeedCompanyService.handleMapMethodOfReproduction(item?.methodOfReproduction!).label}
                      color={
                        fishSeedCompanyService.handleMapMethodOfReproduction(item?.methodOfReproduction!).color as any
                      }
                    />
                  </TableCell>
                  <TableCell align='center'>{item.waterTemperature}°C</TableCell>
                  <TableCell align='center'>{item.quantity}kg</TableCell>
                  <TableCell
                    align='center'
                    className='cursor-pointer hover:text-blue-500'
                    onClick={() => window.open(pinataUrl(item.IPFSHash), '_blank')}
                  >
                    {item.IPFSHash}
                  </TableCell>
                  <TableCell align='center'>{formatTime(item.updatedAt)}</TableCell>
                  <TableCell align='center'>
                    <Link to={privateRoute.fishSeedDetail.url?.(item)!}>
                      <Visibility />
                    </Link>
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

      <Dialog open={openAddFishSeedPopup} fullWidth maxWidth='md'>
        <AddFishSeedPopup refetch={refetch} onClose={() => setOpenAddFishSeedPopup(false)} />
      </Dialog>
    </>
  );
};

export default FishSeeds;
