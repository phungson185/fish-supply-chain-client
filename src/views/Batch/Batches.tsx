import { Visibility } from '@mui/icons-material';
import { Dialog, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Spinner, TableRowEmpty } from 'components';
import { useSearch } from 'hooks';
import { useSnackbar } from 'notistack';
import { parse } from 'qs';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { getRoute } from 'routes';
import { fishSeedCompanyService } from 'services';
import { RoleType } from 'types/Auth';
import { BatchType } from 'types/Batch';
import { FarmedFishOrderPopup, FishSeedsOrderPopup, ProcessedFishOrderPopup, ProcessStatus } from './components';

const Batches = () => {
  const location = useLocation();
  const { role } = useSelector(profileSelector);
  const privateRoute = getRoute(role);
  const { tab, page = 1, ...query } = parse(location.search, { ignoreQueryPrefix: true });
  const [dataSearch, onSearchChange] = useSearch({ page });
  const { data, isFetching } = useQuery(
    ['fishSeedCompanyService.getFarmedFishContracts', dataSearch],
    () => fishSeedCompanyService.getBatchs(dataSearch),
    {
      keepPreviousData: true,
      staleTime: 0,
    },
  );
  const { items = [], total, currentPage, pages: totalPage } = data ?? {};
  const [openPlaceFishSeedsPurchaseOrderPopup, setOpenPlaceFishSeedsPurchaseOrderPopup] = useState(false);
  const [openPlaceFarmedFishPurchaseOrderPopup, setOpenPlaceFarmedFishPurchaseOrderPopup] = useState(false);
  const [openPlaceProcessedFishPurchaseOrderPopup, setOpenPlaceProcessedFishPurchaseOrderPopup] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [selectedBatch, setSelectedBatch] = useState<BatchType>({} as BatchType);
  const [openBatchDetail, setOpenBatchDetail] = useState(false);

  const handleOrderPopup = (item: BatchType, roleType: RoleType) => {
    if (role !== roleType) {
      enqueueSnackbar('You are not authorized to access this page', {
        variant: 'error',
      });
      return;
    }
    setSelectedBatch(item);

    switch (roleType) {
      case RoleType.fishFarmerRole:
        setOpenPlaceFishSeedsPurchaseOrderPopup(true);
        break;
      case RoleType.fishProcessorRole:
        setOpenPlaceFarmedFishPurchaseOrderPopup(true);
        break;
      case RoleType.distributorRole:
        setOpenPlaceProcessedFishPurchaseOrderPopup(true);
        break;
      default:
        break;
    }
  };

  const handleOpenBatchDetail = (item: BatchType) => {
    setSelectedBatch(item);
    setOpenBatchDetail(true);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Spinner loading={isFetching}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Batch Id</TableCell>
                <TableCell>Species name</TableCell>
                <TableCell>Geographic origin</TableCell>
                <TableCell>Number of fish seeds available</TableCell>
                <TableCell>Aquaculture water type</TableCell>
                <TableCell>IPFS hash</TableCell>
                <TableCell>Fish seed company</TableCell>
                <TableCell>Fish farmer</TableCell>
                <TableCell>Fish processor</TableCell>
                <TableCell>Distributor</TableCell>
                <TableCell>Retailer</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id} className='cursor-pointer'>
                  <TableCell align='center'>{item.id}</TableCell>
                  <TableCell align='center'>{item.farmedFishId?.speciesName}</TableCell>
                  <TableCell align='center'>{item.farmedFishId?.geographicOrigin}</TableCell>
                  <TableCell align='center'>{item.farmedFishId?.numberOfFishSeedsAvailable}</TableCell>
                  <TableCell align='center'>{item.farmedFishId?.aquacultureWaterType}</TableCell>
                  <TableCell align='center'>{item.farmedFishId?.IPFSHash}</TableCell>
                  <TableCell align='center'>
                    <ProcessStatus
                      content={`${item.farmedFishId ? 'Completed' : 'Pending'}`}
                      backgroundColor={`${item.farmedFishId ? 'green' : 'gray'}`}
                    />
                  </TableCell>
                  <TableCell align='center' onClick={() => handleOrderPopup(item, RoleType.fishFarmerRole)}>
                    <ProcessStatus
                      content={`${item.fishFarmerId ? 'Completed' : 'Pending'}`}
                      backgroundColor={`${item.fishFarmerId ? 'green' : 'gray'}`}
                    />
                  </TableCell>
                  <TableCell align='center' onClick={() => handleOrderPopup(item, RoleType.fishProcessorRole)}>
                    <ProcessStatus
                      content={`${item.fishProcessorId ? 'Completed' : 'Pending'}`}
                      backgroundColor={`${item.fishProcessorId ? 'green' : 'gray'}`}
                    />
                  </TableCell>
                  <TableCell align='center' onClick={() => handleOrderPopup(item, RoleType.distributorRole)}>
                    <ProcessStatus
                      content={`${item.distributorId ? 'Completed' : 'Pending'}`}
                      backgroundColor={`${item.distributorId ? 'green' : 'gray'}`}
                    />
                  </TableCell>
                  <TableCell align='center' onClick={() => handleOrderPopup(item, RoleType.distributorRole)}>
                    <ProcessStatus
                      content={`${item.retailerId ? 'Completed' : 'Pending'}`}
                      backgroundColor={`${item.retailerId ? 'green' : 'gray'}`}
                    />
                  </TableCell>
                  <TableCell align='center' onClick={() => handleOpenBatchDetail(item)}>
                    <Link to={privateRoute.batchDetail.url?.(item)!}>
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

      <Dialog open={openPlaceFishSeedsPurchaseOrderPopup} fullWidth maxWidth='sm'>
        <FishSeedsOrderPopup item={selectedBatch} onClose={() => setOpenPlaceFishSeedsPurchaseOrderPopup(false)} />
      </Dialog>

      <Dialog open={openPlaceFarmedFishPurchaseOrderPopup} fullWidth maxWidth='sm'>
        <FarmedFishOrderPopup item={selectedBatch} onClose={() => setOpenPlaceFarmedFishPurchaseOrderPopup(false)} />
      </Dialog>

      <Dialog open={openPlaceProcessedFishPurchaseOrderPopup} fullWidth maxWidth='sm'>
        <ProcessedFishOrderPopup item={selectedBatch} onClose={() => setOpenPlaceProcessedFishPurchaseOrderPopup(false)} />
      </Dialog>
    </>
  );
};

export default Batches;
