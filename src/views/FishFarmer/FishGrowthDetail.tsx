import {
  Autorenew,
  BalanceOutlined,
  DeviceThermostat,
  DoneAll,
  DoneOutline,
  DoneOutlined,
  SetMeal,
} from '@mui/icons-material';
import {
  Avatar,
  Button,
  Card,
  Chip,
  Dialog,
  Grid,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Spinner, TableRowEmpty } from 'components';
import { useSearch } from 'hooks';
import { parse } from 'qs';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useLocation, useParams } from 'react-router-dom';
import { fishFarmerService, fishSeedCompanyService, logService } from 'services';
import { formatTime, pinataUrl } from 'utils/common';
// import UpdateContractPopup from './popups/UpdateContractPopup';
import { LogPaginateType, TransactionType } from 'types/Log';
import { useSelector } from 'react-redux';
import { profileSelector } from 'reducers/profile';
import { RoleType } from 'types/Auth';
import { FarmedFishOrderPopup, FishSeedsOrderPopup } from 'views/Batch/components';
import { UpdateFishGrowthDetailPopup } from './popups';
import { useSnackbar } from 'notistack';
import { UpdateGrowthDetailType } from 'types/FishFarmer';

const FishGrowthDetail = () => {
  const { role } = useSelector(profileSelector);
  const params = useParams();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [logs, setLogs] = useState<LogPaginateType | undefined>({} as LogPaginateType);
  const { tab, page = 1, size = 5, ...query } = parse(location.search, { ignoreQueryPrefix: true });
  const [dataSearch, onSearchChange] = useSearch({ page, size });
  const [openUpdatePopup, setOpenUpdatePopup] = useState(false);
  const [openOrderPopup, setOpenOrderPopup] = useState(false);

  const {
    data: growth,
    isSuccess: getGrowthSuccess,
    refetch: fetchGrowthDetail,
  } = useQuery(
    ['fishFarmerService.getOrder', dataSearch],
    () => fishFarmerService.getOrder({ id: params.id as string }),
    {
      onSuccess: async (res) => {
        setLogs(
          await logService.getLogs({
            ...dataSearch,
            objectId: res?.id,
            transactionType: TransactionType.FISH_GROWTH,
          }),
        );
      },
      keepPreviousData: true,
      staleTime: 0,
    },
  );

  const { mutate: updateGrowthDetail, isLoading } = useMutation(fishFarmerService.updateGrowthDetail, {
    onSuccess: () => {
      enqueueSnackbar('Update growth successfully', {
        variant: 'success',
      });
      fetchGrowthDetail();
    },
    onError: (error: any) => {
      enqueueSnackbar(error, { variant: 'error' });
    },
  });

  const { items = [], total, currentPage, pages: totalPage } = logs ?? {};

  useEffect(() => {
    onSearchChange({ ...params });
  }, [onSearchChange, params]);

  const handleChangeOrderable = (fishWeight?: number) => {
    if (!fishWeight) return enqueueSnackbar('Please update fish weight', { variant: 'error' });
    if (role === RoleType.fishFarmerRole)
      updateGrowthDetail({ orderId: growth?.id, orderable: !growth?.orderable } as UpdateGrowthDetailType);
  };

  if (!getGrowthSuccess) return <></>;

  return (
    <>
      <Card className='p-5 mb-5'>
        <Grid container spacing={2}>
          <Grid item xs={8} className='w-full'>
            <div className='relative h-full'>
              <div className='flex items-center justify-between w-full mb-1'>
                <div className='w-[70%]'>
                  <div className='flex items-center gap-3'>
                    <Typography variant='h1' className='mb-2'>
                      {growth?.speciesName}
                    </Typography>

                    {growth.orderable ? (
                      <Chip
                        label='Orderable'
                        color='success'
                        deleteIcon={<DoneOutlined />}
                        className='text-white mb-2'
                        onDelete={handleChangeOrderable}
                      />
                    ) : (
                      <Chip
                        label='Not orderable'
                        color='error'
                        deleteIcon={<Autorenew />}
                        className='text-white mb-2'
                        onDelete={() => handleChangeOrderable(growth.fishWeight)}
                      />
                    )}
                  </div>
                  <Typography variant='h6'>
                    Contract address: <span className='text-blue-600'>{growth?.farmedFishId.farmedFishContract}</span>
                  </Typography>
                  <Typography variant='h6'>
                    Document:
                    <span
                      className='text-blue-600 cursor-pointer'
                      onClick={() => window.open(pinataUrl(growth?.IPFSHash), '_blank')}
                    >
                      {growth?.IPFSHash}
                    </span>
                  </Typography>
                </div>
                <Typography variant='caption' className='w-[30%]'>
                  Updated time: {formatTime(growth?.updatedAt)}
                </Typography>
              </div>
              <div className='mb-1'>
                <span className='mr-2'>Geopraphic origin: </span>
                <Chip
                  label={fishSeedCompanyService.handleMapGeographicOrigin(growth?.geographicOrigin!).label}
                  color={fishSeedCompanyService.handleMapGeographicOrigin(growth?.geographicOrigin!).color as any}
                />
              </div>
              <div className='mb-1'>
                <span className='mr-2'>Method of reproduction: </span>
                <Chip
                  label={fishSeedCompanyService.handleMapMethodOfReproduction(growth?.methodOfReproduction!).label}
                  color={
                    fishSeedCompanyService.handleMapMethodOfReproduction(growth?.methodOfReproduction!).color as any
                  }
                />
              </div>
              <div className='flex gap-1 items-center mb-2'>
                <div>Water temperature in fish farming environment:</div>
                <div className='font-bold'>{growth?.waterTemperature}°C</div>
                <DeviceThermostat color='error' />
              </div>
              {growth.fishWeight && (
                <div className='flex gap-1 items-center mb-2'>
                  <div>Fish weight:</div>
                  <div className='font-bold'>{growth?.fishWeight}kg</div>
                  <SetMeal className='text-blue-600' />
                </div>
              )}
              <div className='flex gap-1 items-center'>
                <div>Total number of fish:</div>
                <div className='font-bold'>{growth?.totalNumberOfFish}kg</div>
                <BalanceOutlined color='primary' />
              </div>
              <Typography variant='caption' className='absolute -bottom-1 left-0'>
                {growth?.owner.name + ' / ' + growth?.owner.userAddress + ' / ' + growth?.owner.phone}
              </Typography>

              {role === RoleType.fishFarmerRole && (
                <Button className='absolute bottom-0 right-0' size='small' onClick={() => setOpenUpdatePopup(true)}>
                  Update growth
                </Button>
              )}

              {role === RoleType.fishProcessorRole && growth.orderable && (
                <Button className='absolute bottom-0 right-0' size='small' onClick={() => setOpenOrderPopup(true)}>
                  Make order
                </Button>
              )}
            </div>
          </Grid>
          <Grid item xs={4}>
            <Spinner loading={!getGrowthSuccess}>
              <Avatar
                src={growth.image}
                alt='fish image'
                variant='square'
                className='mx-auto bg-cover bg-no-repeat w-full h-full'
              />
            </Spinner>
          </Grid>
        </Grid>
      </Card>

      <Card className='p-5'>
        <Typography variant='h4' className='mb-5'>
          Transactions
        </Typography>
        <TableContainer className='max-w-screen-2xl'>
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell>Log ID</TableCell>  */}
                <TableCell>Title</TableCell>
                <TableCell>Message</TableCell>
                <TableCell className='max-w-[200px]'>Transaction hash</TableCell>
                <TableCell>Old data</TableCell>
                <TableCell>New data</TableCell>
                <TableCell>Updated time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  {/* <TableCell align='center'>{item.id}</TableCell> */}
                  <TableCell align='center'>{item.title}</TableCell>
                  <TableCell align='center'>{item.message}</TableCell>
                  <TableCell align='center'>{item.transactionHash}</TableCell>
                  <TableCell dangerouslySetInnerHTML={{ __html: item.oldData }}></TableCell>
                  <TableCell dangerouslySetInnerHTML={{ __html: item.newData }}></TableCell>
                  <TableCell align='center'>{formatTime(item.updatedAt)}</TableCell>
                </TableRow>
              ))}
              <TableRowEmpty visible={!getGrowthSuccess && items.length === 0} />
            </TableBody>
            <caption className='font-bold border-t'>{total ?? 0} Transactions</caption>
          </Table>
        </TableContainer>
        <div className='flex justify-center'>
          <Pagination
            page={currentPage ?? 1}
            count={totalPage}
            onChange={(event, value) => onSearchChange({ page: value })}
          />
        </div>
      </Card>

      <Dialog maxWidth='sm' open={openUpdatePopup} fullWidth>
        <UpdateFishGrowthDetailPopup
          item={growth}
          refetch={fetchGrowthDetail}
          onClose={() => setOpenUpdatePopup(false)}
        />
      </Dialog>

      <Dialog maxWidth='sm' open={openOrderPopup} fullWidth>
        <FarmedFishOrderPopup refetch={fetchGrowthDetail} item={growth} onClose={() => setOpenOrderPopup(false)} />
      </Dialog>
    </>
  );
};

export default FishGrowthDetail;
