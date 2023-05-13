import { Article, ArticleOutlined, Assignment, Visibility } from '@mui/icons-material';

import {
  Avatar,
  Button,
  Chip,
  Dialog,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  debounce,
} from '@mui/material';
import { Spinner, TableRowEmpty } from 'components';
import { ProcessStatus } from 'components/ConfirmStatus';
import { useAnchor, useSearch } from 'hooks';
import { parse } from 'qs';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { getRoute } from 'routes';
import { fishProcessorService, fishSeedCompanyService } from 'services';
import { pinataUrl } from 'utils/common';
import CreateContractPopup from './popups/CreateContractPopup';
import { FishFarmerFishProcessorOrderType } from 'types/FishProcessor';

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

const Fishes = () => {
  const { role, address } = useSelector(profileSelector);

  const location = useLocation();
  const { tab, page = 1, ...query } = parse(location.search, { ignoreQueryPrefix: true });
  const [dataSearch, onSearchChange] = useSearch({
    page,
    farmedFishPurchaser: address,
    status: ProcessStatus.Received,
  });
  const [openCreateContractPopup, setOpenCreateContractPopup] = useState(false);
  const [selectedFish, setSelectedFish] = useState<FishFarmerFishProcessorOrderType>(
    {} as FishFarmerFishProcessorOrderType,
  );
  const navigate = useNavigate();
  const [anchorFilter, openFilter, onOpenFilter, onCloseFilter] = useAnchor();
  const [anchorSort, openSort, onOpenSort, onCloseSort] = useAnchor();
  const privateRoute = getRoute(role);

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
        {/* <div className='flex justify-between gap-2'>
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

        {/* <Button
          variant='contained'
          onClick={() => {
            setOpenCreatePopup(true);
          }}
        >
          Create Farmed Fish Contract
        </Button> */}
      </div>
      <TableContainer component={Paper}>
        <Spinner loading={isFetching}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Species name</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Geographic origin</TableCell>
                <TableCell>Method of reproduction</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>IPFS hash</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell align='center'>{item.id}</TableCell>
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
                  <TableCell align='center'>{item.numberOfFishOrdered}kg</TableCell>
                  <TableCell
                    align='center'
                    className='cursor-pointer hover:text-blue-500'
                    onClick={() => window.open(pinataUrl(item.IPFSHash), '_blank')}
                  >
                    {item.IPFSHash}
                  </TableCell>
                  <TableCell align='center'>
                    <div
                      className='cursor-pointer'
                      onClick={() => {
                        setOpenCreateContractPopup(true);
                        setSelectedFish(item);
                      }}
                    >
                      <ArticleOutlined />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              <TableRowEmpty visible={!isFetching && items.length === 0} />
            </TableBody>
            <caption className='font-bold border-t'>{total ?? 0} Fishes</caption>
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

      <Dialog open={openCreateContractPopup} fullWidth maxWidth='sm'>
        <CreateContractPopup item={selectedFish} refetch={refetch} onClose={() => setOpenCreateContractPopup(false)} />
      </Dialog>
    </>
  );
};

export default Fishes;
