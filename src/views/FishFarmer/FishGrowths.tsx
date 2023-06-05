import { Assignment, CategoryOutlined, Visibility } from '@mui/icons-material';
import {
  Avatar,
  Button,
  Chip,
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
import { ProcessStatus } from 'components/ConfirmStatus';
import { useAnchor, useSearch } from 'hooks';
import { parse } from 'qs';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { getRoute } from 'routes';
import { fishFarmerService, fishSeedCompanyService } from 'services';
import { FishSeedCompanyFishFarmerOrderType } from 'types/FishFarmer';
import { pinataUrl } from 'utils/common';

const FILTERS = [
  { label: 'Species name', orderBy: 'speciesName' },
  { label: 'Total number of fish', orderBy: 'totalNumberOfFish' },
  { label: 'Water temperature', orderBy: 'waterTemperature' },
  { label: 'Geographic origin', orderBy: 'geographicOrigin' },
  { label: 'Method of reproduction', orderBy: 'methodOfReproduction' },
  { label: 'Fish weight', orderBy: 'fishWeight' },
  { label: 'Updated time', orderBy: 'updatedAt' },
];

const SORT_TYPES = [
  { label: 'Low to High', desc: 'false' },
  { label: 'High to Low', desc: 'true' },
];

const FishGrowths = () => {
  const { id, role } = useSelector(profileSelector);
  const location = useLocation();
  const { tab, page = 1, ...query } = parse(location.search, { ignoreQueryPrefix: true });
  const [dataSearch, onSearchChange] = useSearch({
    page,
    fishSeedsPurchaseOrderDetailsStatus: ProcessStatus.Received,
    fishSeedsPurchaser: id,
  });
  const [anchorFilter, openFilter, onOpenFilter, onCloseFilter] = useAnchor();
  const [anchorSort, openSort, onOpenSort, onCloseSort] = useAnchor();

  const { data, isFetching, refetch } = useQuery(
    ['fishFarmerService.getOrders', dataSearch],
    () => fishFarmerService.getOrders(dataSearch),
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
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<FishSeedCompanyFishFarmerOrderType>(
    {} as FishSeedCompanyFishFarmerOrderType,
  );
  const privateRoute = getRoute(role);

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
      <TableContainer component={Paper}>
        <Spinner loading={isFetching}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Contract address</TableCell>
                <TableCell>Species name</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Geographic origin</TableCell>
                <TableCell>Method of reproduction</TableCell>
                <TableCell>Water temperature</TableCell>
                <TableCell>Number of fish seeds available</TableCell>
                <TableCell>Fish weight</TableCell>
                <TableCell>IPFS hash</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell align='center'>{item.farmedFishId.farmedFishContract}</TableCell>
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
                  <TableCell align='center'>{item.totalNumberOfFish}kg</TableCell>
                  <TableCell align='center'>{item.fishWeight ? `${item.fishWeight}kg` : 'NA'}</TableCell>
                  <TableCell
                    align='center'
                    className='cursor-pointer hover:text-blue-500'
                    onClick={() => window.open(pinataUrl(item.IPFSHash), '_blank')}
                  >
                    {item.IPFSHash}
                  </TableCell>
                  <TableCell align='center'>
                    <Link to={privateRoute.growthDetail.url?.(item)!}>
                      <Visibility />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              <TableRowEmpty visible={!isFetching && items.length === 0} />
            </TableBody>
            <caption className='font-bold border-t'>{total ?? 0} Growth details</caption>
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

export default FishGrowths;
