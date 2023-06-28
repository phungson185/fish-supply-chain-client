import { Assignment, CategoryOutlined, FiveG, Visibility } from '@mui/icons-material';
import {
  Avatar,
  Button,
  Chip,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Spinner, TableRowEmpty } from 'components';
import { useAnchor, useSearch } from 'hooks';
import { parse } from 'qs';
import { useEffect, useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { getRoute, publicRoute } from 'routes';
import { fishSeedCompanyService } from 'services';
import { RoleType } from 'types/Auth';
import { BatchType } from 'types/Batch';
import { ProcessStatus } from './components';
import { formatTimeDate, pinataUrl } from 'utils/common';

const Batches = () => {
  const location = useLocation();
  const { role } = useSelector(profileSelector);
  const [batchType, setBatchType] = useState(0);
  const [batchStep, setBatchStep] = useState(0);
  const privateRoute = getRoute(role);
  const { tab, page = 1, ...query } = parse(location.search, { ignoreQueryPrefix: true });
  const [dataSearch, onSearchChange] = useSearch({ page });
  const { data, isFetching } = useQuery(
    ['fishSeedCompanyService.getBatchs', dataSearch],
    () => fishSeedCompanyService.getBatchs(dataSearch),
    {
      keepPreviousData: true,
      staleTime: 0,
    },
  );
  const { items = [], total, currentPage, pages: totalPage } = data ?? {};

  const [selectedBatch, setSelectedBatch] = useState<BatchType>({} as BatchType);
  const [openBatchDetail, setOpenBatchDetail] = useState(false);
  const [orderBy, setOrderBy] = useState(query.orderBy);
  const [desc, setDesc] = useState(query.desc);
  const [search, setSearch] = useState(query.search || '');
  const [params, setParams] = useState({ search, page });

  const [anchorFilter, openFilter, onOpenFilter, onCloseFilter] = useAnchor();
  const [anchorSort, openSort, onOpenSort, onCloseSort] = useAnchor();

  const handleOpenBatchDetail = (item: BatchType) => {
    setSelectedBatch(item);
    setOpenBatchDetail(true);
  };

  useEffect(() => {
    onSearchChange({ orderBy, desc, ...params, batchType, batchStep });
  }, [onSearchChange, orderBy, desc, params, batchType, batchStep]);

  const batchStepOptions = useMemo(() => {
    if (batchType === 0) {
      return [
        { label: 'All', value: 0 },
        { label: 'Fish seed company', value: 1 },
        { label: 'Fish farmer', value: 2 },
        { label: 'Fish processor', value: 3 },
        { label: 'Distributor', value: 4 },
        { label: 'Retailer', value: 5 },
      ];
    } else if (batchType === 1) {
      return [
        { label: 'All', value: 0 },
        { label: 'Fish seed company', value: 1 },
        { label: 'Fish farmer', value: 2 },
      ];
    } else {
      return [
        { label: 'All', value: 0 },
        { label: 'Fish processor', value: 3 },
        { label: 'Distributor', value: 4 },
        { label: 'Retailer', value: 5 },
      ];
    }
  }, [batchType]);

  return (
    <>
      <div className='flex flex-row gap-20'>
        <div className='flex flex-rows items-center gap-5'>
          <div className='text-primary-main text-xl'>Select batch type</div>
          <Select
            value={batchType}
            onChange={(e) => {
              setBatchStep(0);
              setBatchType(Number(e.target.value));
            }}
            sx={{ width: 150 }}
          >
            <MenuItem value={0}>All</MenuItem>
            <MenuItem value={1}>Fish seed</MenuItem>
            <MenuItem value={2}>Fish product</MenuItem>
          </Select>
        </div>

        <div className='flex flex-rows items-center gap-5'>
          <div className='text-primary-main text-xl'>Select batch step</div>
          <Select
            value={batchStep}
            onChange={(e) => {
              console.log(e.target.value);
              return setBatchStep(Number(e.target.value));
            }}
            sx={{ width: 200 }}
          >
            {batchStepOptions.map((item, index) => (
              <MenuItem value={item.value} key={index}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Spinner loading={isFetching}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company name</TableCell>
                <TableCell>Logo</TableCell>
                <TableCell>Species name / Product name</TableCell>
                <TableCell>Image</TableCell>
                {(batchType === 0 || batchType === 1) && (
                  <>
                    <TableCell>Geographic origin</TableCell>
                    <TableCell>Method of reproduction</TableCell>
                    <TableCell>Water temperature</TableCell>
                    <TableCell>Fish weight</TableCell>
                  </>
                )}
                {(batchType === 0 || batchType === 2) && (
                  <>
                    <TableCell>Date of processing</TableCell>
                    <TableCell>Date of expiry</TableCell>
                    <TableCell>Fillets in packet</TableCell>
                  </>
                )}
                <TableCell>Document</TableCell>
                <TableCell>Fish seed company</TableCell>
                <TableCell>Fish farmer</TableCell>
                <TableCell>Fish processor</TableCell>
                <TableCell>Distributor</TableCell>
                <TableCell>Retailer</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item: any) => (
                <TableRow key={item.id} className='cursor-pointer'>
                  <TableCell align='center'>{item[item?.lastChainPoint as keyof BatchType]?.owner.name}</TableCell>
                  <TableCell align='center'>
                    <Avatar src={item[item?.lastChainPoint as keyof BatchType]?.owner.avatar} variant='square'>
                      <Assignment />
                    </Avatar>
                  </TableCell>
                  <TableCell align='center'>
                    {item[item?.lastChainPoint as keyof BatchType]?.speciesName ??
                      item[item?.lastChainPoint as keyof BatchType]?.processedSpeciesName}
                  </TableCell>
                  <TableCell align='center'>
                    <Avatar src={item[item?.lastChainPoint as keyof BatchType]?.image} variant='square'>
                      <Assignment />
                    </Avatar>
                  </TableCell>
                  {(batchType === 0 || batchType === 1) && (
                    <>
                      <TableCell align='center'>
                        {item[item?.lastChainPoint as keyof BatchType]?.geographicOrigin !== undefined && (
                          <Chip
                            label={
                              fishSeedCompanyService.handleMapGeographicOrigin(
                                item[item?.lastChainPoint as keyof BatchType]?.geographicOrigin!,
                              ).label
                            }
                            color={
                              fishSeedCompanyService.handleMapGeographicOrigin(
                                item[item?.lastChainPoint as keyof BatchType]?.geographicOrigin!,
                              ).color as any
                            }
                          />
                        )}
                      </TableCell>
                      <TableCell align='center'>
                        {item[item?.lastChainPoint as keyof BatchType]?.geographicOrigin !== undefined && (
                          <Chip
                            label={
                              fishSeedCompanyService.handleMapMethodOfReproduction(
                                item[item?.lastChainPoint as keyof BatchType]?.methodOfReproduction!,
                              ).label
                            }
                            color={
                              fishSeedCompanyService.handleMapMethodOfReproduction(
                                item[item?.lastChainPoint as keyof BatchType]?.methodOfReproduction!,
                              ).color as any
                            }
                          />
                        )}
                      </TableCell>
                      <TableCell align='center'>
                        {item[item?.lastChainPoint as keyof BatchType]?.waterTemperature}
                      </TableCell>
                      <TableCell align='center'>{item[item?.lastChainPoint as keyof BatchType]?.fishWeight}</TableCell>
                    </>
                  )}
                  {(batchType === 0 || batchType === 2) && (
                    <>
                      <TableCell align='center'>
                        {item[item?.lastChainPoint as keyof BatchType]?.dateOfProcessing &&
                          formatTimeDate(item[item?.lastChainPoint as keyof BatchType]?.dateOfProcessing)}
                      </TableCell>
                      <TableCell align='center'>
                        {item[item?.lastChainPoint as keyof BatchType]?.dateOfExpiry &&
                          formatTimeDate(item[item?.lastChainPoint as keyof BatchType]?.dateOfExpiry)}
                      </TableCell>
                      <TableCell align='center'>
                        {item[item?.lastChainPoint as keyof BatchType]?.filletsInPacket}
                      </TableCell>
                    </>
                  )}
                  <TableCell
                    align='center'
                    className='cursor-pointer hover:text-blue-500'
                    onClick={() =>
                      window.open(pinataUrl(item[item?.lastChainPoint as keyof BatchType]?.IPFSHash), '_blank')
                    }
                  >
                    {item[item?.lastChainPoint as keyof BatchType]?.IPFSHash}
                  </TableCell>

                  <TableCell align='center'>
                    {[RoleType.fishSeedCompanyRole, RoleType.fishFarmerRole].includes(role as RoleType) ? (
                      <Link to={privateRoute.contractDetail.url?.(item.farmedFishId)!}>
                        <ProcessStatus
                          content={`${item.farmedFishId ? 'Completed' : 'Pending'}`}
                          backgroundColor={`${item.farmedFishId ? 'green' : 'gray'}`}
                        />
                      </Link>
                    ) : (
                      <ProcessStatus
                        content={`${item.farmedFishId ? 'Completed' : 'Pending'}`}
                        backgroundColor={`${item.farmedFishId ? 'green' : 'gray'}`}
                      />
                    )}
                  </TableCell>
                  <TableCell align='center'>
                    {[RoleType.fishFarmerRole, RoleType.fishProcessorRole].includes(role as RoleType) &&
                    item.fishFarmerId ? (
                      <Link to={privateRoute.growthDetail.url?.(item.fishFarmerId)!}>
                        <ProcessStatus
                          content={`${item.fishFarmerId ? 'Completed' : 'Pending'}`}
                          backgroundColor={`${item.fishFarmerId ? 'green' : 'gray'}`}
                        />
                      </Link>
                    ) : (
                      <ProcessStatus
                        content={`${item.fishFarmerId ? 'Completed' : 'Pending'}`}
                        backgroundColor={`${item.fishFarmerId ? 'green' : 'gray'}`}
                      />
                    )}
                  </TableCell>
                  <TableCell align='center'>
                    {[RoleType.fishProcessorRole, RoleType.distributorRole].includes(role as RoleType) &&
                    item.fishProcessingId ? (
                      <Link to={privateRoute.processorProducts.url?.(item.fishProcessingId)!}>
                        <ProcessStatus
                          content={`${item.fishProcessingId ? 'Completed' : 'Pending'}`}
                          backgroundColor={`${item.fishProcessingId ? 'green' : 'gray'}`}
                        />
                      </Link>
                    ) : (
                      <ProcessStatus
                        content={`${item.fishProcessingId ? 'Completed' : 'Pending'}`}
                        backgroundColor={`${item.fishProcessingId ? 'green' : 'gray'}`}
                      />
                    )}
                  </TableCell>
                  <TableCell align='center'>
                    {[RoleType.distributorRole, RoleType.retailerRole].includes(role as RoleType) &&
                    item.distributorId ? (
                      <Link to={privateRoute.distributorProducts.url?.(item.distributorId)!}>
                        <ProcessStatus
                          content={`${item.distributorId ? 'Completed' : 'Pending'}`}
                          backgroundColor={`${item.distributorId ? 'green' : 'gray'}`}
                        />
                      </Link>
                    ) : (
                      <ProcessStatus
                        content={`${item.distributorId ? 'Completed' : 'Pending'}`}
                        backgroundColor={`${item.distributorId ? 'green' : 'gray'}`}
                      />
                    )}
                  </TableCell>
                  <TableCell align='center'>
                    <ProcessStatus
                      content={`${item.retailerId ? 'Completed' : 'Pending'}`}
                      backgroundColor={`${item.retailerId ? 'green' : 'gray'}`}
                    />
                  </TableCell>
                  <TableCell align='center' onClick={() => handleOpenBatchDetail(item)}>
                    <Link to={publicRoute.batchDetail.url?.(item)!}>
                      <Visibility />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              <TableRowEmpty visible={!isFetching && items.length === 0} />
            </TableBody>
            <caption className='font-bold border-t'>{total ?? 0} Batchs</caption>
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

export default Batches;
