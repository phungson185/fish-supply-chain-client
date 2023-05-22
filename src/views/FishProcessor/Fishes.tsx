import { ArticleOutlined, Assignment, KeyboardArrowDownOutlined, KeyboardArrowUpOutlined } from '@mui/icons-material';

import {
  Avatar,
  Box,
  Chip,
  Collapse,
  Dialog,
  IconButton,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  debounce,
} from '@mui/material';
import { Spinner, TableRowEmpty } from 'components';
import { ProcessStatus } from 'components/ConfirmStatus';
import { useAnchor, useSearch } from 'hooks';
import { parse } from 'qs';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { getRoute } from 'routes';
import { fishProcessorService, fishSeedCompanyService } from 'services';
import { FishFarmerFishProcessorOrderType } from 'types/FishProcessor';
import { formatTimeDate, pinataUrl } from 'utils/common';
import CreateContractPopup from './popups/CreateContractPopup';

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

  const {
    data,
    isFetching,
    refetch: refetchFishes,
  } = useQuery(['fishProcessorService.getOrders', dataSearch], () => fishProcessorService.getOrders(dataSearch), {
    keepPreviousData: false,
    staleTime: 0,
  });

  const { items = [], total, currentPage, pages: totalPage } = data ?? {};
  const [orderBy, setOrderBy] = useState(query.orderBy || FILTERS[0].orderBy);
  const [desc, setDesc] = useState(query.desc || SORT_TYPES[0].desc);
  const [search, setSearch] = useState(query.search || '');
  const [params, setParams] = useState({ search, page });

  const {
    data: getProcessingContracts,
    isLoading: isLoadingProcessingContracts,
    refetch: refetchProcessingContracts,
  } = useQuery(['fishProcessorService.getProcessingContracts', selectedFish], () =>
    fishProcessorService.getProcessingContracts({ page: 1, fishProcessorId: selectedFish.id, size: 100 }),
  );

  const refetch = () => {
    refetchFishes();
    refetchProcessingContracts();
  };

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

  function Row(props: { row: FishFarmerFishProcessorOrderType }) {
    const { row } = props;
    const [openCollapse, setOpenCollapse] = useState(false);

    return (
      <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label='expand row'
              size='small'
              onClick={() => {
                setSelectedFish(row);
                setOpenCollapse(!openCollapse);
              }}
            >
              {openCollapse ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined />}
            </IconButton>
          </TableCell>
          <TableCell align='center'>{row.id}</TableCell>
          <TableCell align='center'>{row.speciesName}</TableCell>
          <TableCell align='center'>
            <Avatar src={row.image} variant='square'>
              <Assignment />
            </Avatar>
          </TableCell>
          <TableCell align='center'>
            <Chip
              label={fishSeedCompanyService.handleMapGeographicOrigin(row?.geographicOrigin!).label}
              color={fishSeedCompanyService.handleMapGeographicOrigin(row?.geographicOrigin!).color as any}
            />
          </TableCell>
          <TableCell align='center'>
            <Chip
              label={fishSeedCompanyService.handleMapMethodOfReproduction(row?.methodOfReproduction!).label}
              color={fishSeedCompanyService.handleMapMethodOfReproduction(row?.methodOfReproduction!).color as any}
            />
          </TableCell>
          <TableCell align='center'>{row.numberOfFishOrdered}kg</TableCell>
          <TableCell
            align='center'
            className='cursor-pointer hover:text-blue-500'
            onClick={() => window.open(pinataUrl(row.IPFSHash), '_blank')}
          >
            {row.IPFSHash}
          </TableCell>
          <TableCell align='center'>
            <div
              className='cursor-pointer'
              onClick={() => {
                setOpenCreateContractPopup(true);
                setSelectedFish(row);
              }}
            >
              <ArticleOutlined />
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
            <Collapse in={openCollapse} timeout='auto' unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant='h2' gutterBottom component='div'>
                  Inventory
                </Typography>
                <Table size='small' aria-label='purchases'>
                  <TableHead>
                    <TableRow>
                      <TableCell align='center'>Contract address</TableCell>
                      <TableCell align='center'>Species name</TableCell>
                      <TableCell align='center'>Image</TableCell>
                      <TableCell align='center'>Date of processing</TableCell>
                      <TableCell align='center'>Date of expiry</TableCell>
                      <TableCell align='right'>Fillets in packet</TableCell>
                      <TableCell align='right'>Number of packets</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getProcessingContracts &&
                      getProcessingContracts.items.length > 0 &&
                      getProcessingContracts.items.map((contract) => (
                        <TableRow key={contract.id}>
                          <TableCell align='center'>{contract.processingContract}</TableCell>
                          <TableCell align='center'>{contract.processedSpeciesName}</TableCell>
                          <TableCell align='center'>
                            <Avatar src={contract.image} variant='square'>
                              <Assignment />
                            </Avatar>
                          </TableCell>
                          <TableCell align='center'>{formatTimeDate(contract.dateOfProcessing)}</TableCell>
                          <TableCell align='center'>{formatTimeDate(contract.dateOfExpiry)}</TableCell>
                          <TableCell align='right'>{contract.filletsInPacket} fillets</TableCell>
                          <TableCell align='right'>{contract.numberOfPackets} packets</TableCell>
                        </TableRow>
                      ))}
                    <TableRowEmpty
                      visible={!isLoadingProcessingContracts && getProcessingContracts?.items.length === 0}
                    />
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }

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
                <TableCell />
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
                <Row key={item.id} row={item} />
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

      <Dialog open={openCreateContractPopup} fullWidth maxWidth='lg'>
        <CreateContractPopup item={selectedFish} refetch={refetch} onClose={() => setOpenCreateContractPopup(false)} />
      </Dialog>
    </>
  );
};

export default Fishes;
