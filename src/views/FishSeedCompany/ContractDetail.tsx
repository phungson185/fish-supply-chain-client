import { DeviceThermostat, SetMeal } from '@mui/icons-material';
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
import { fishSeedCompanyService, logService } from 'services';
import { formatTime } from 'utils/common';
import UpdateContractPopup from './popups/UpdateContractPopup';
import { LogPaginateType } from 'types/Log';

const ContractDetail = () => {
  const params = useParams();
  const location = useLocation();
  const [logs, setLogs] = useState<LogPaginateType | undefined>({} as LogPaginateType);
  const { tab, page = 1, size = 5, ...query } = parse(location.search, { ignoreQueryPrefix: true });
  const [openUpdateContractPopup, setOpenUpdateContractPopup] = useState(false);
  const [dataSearch, onSearchChange] = useSearch({ page, size });
  const {
    data: contract,
    isSuccess: getContractSuccess,
    refetch: fetchContract,
  } = useQuery(
    ['fishSeedCompanyService.getFarmedFishContract', dataSearch],
    () => fishSeedCompanyService.getFarmedFishContract({ id: params.id as string }),
    {
      onSuccess: async (res) => {
        setLogs(await logService.getLogs({ ...dataSearch, objectId: res?.farmedFishContract }));
      },
      keepPreviousData: true,
      staleTime: 0,
    },
  );

  const { items = [], total, currentPage, pages: totalPage } = logs ?? {};

  useEffect(() => {
    onSearchChange({ ...params });
  }, [onSearchChange, params]);

  if (!getContractSuccess) return <></>;

  return (
    <>
      <Card className='p-5 mb-5'>
        <Grid container spacing={2}>
          <Grid item xs={8} className='w-full'>
            <div className='relative h-full'>
              <div className='flex items-center justify-between w-full mb-5'>
                <div className='w-[70%]'>
                  <Typography variant='h1'>{contract?.speciesName}</Typography>
                  <Typography variant='h6'>
                    Contract address: <span className='text-blue-600'>{contract?.farmedFishContract}</span>
                  </Typography>
                </div>
                <Typography variant='caption' className='w-[30%]'>
                  Updated time: {formatTime(contract?.updatedAt)}
                </Typography>
              </div>
              <div className='mb-1'>
                <span className='mr-2'>Geopraphic origin: </span>
                <Chip
                  label={fishSeedCompanyService.handleMapGeographicOrigin(contract?.geographicOrigin!)}
                  color='warning'
                />
              </div>
              <div className='mb-1'>
                <span className='mr-2'>Method of reproduction: </span>
                <Chip
                  label={fishSeedCompanyService.handleMapMethodOfReproduction(contract?.methodOfReproduction!)}
                  color='secondary'
                />
              </div>
              <div className='flex gap-1 items-center mb-2'>
                <div>Nhiệt độ môi trường nước nuôi cá:</div>
                <div className='font-bold'>{contract?.waterTemperature}°C</div>
                <DeviceThermostat color='error' />
              </div>
              <div className='flex gap-1 items-center'>
                <div>Số lượng có sẵn:</div>
                <div className='font-bold'>{contract?.numberOfFishSeedsAvailable}kg</div>
                <SetMeal className='text-blue-600' />
              </div>
              <Typography variant='caption' className='absolute bottom-0 left-0'>
                {contract?.owner.name + ' / ' + contract?.owner.userAddress + ' / ' + contract?.owner.phone}
              </Typography>

              <Button
                className='absolute bottom-0 right-0'
                size='small'
                onClick={() => setOpenUpdateContractPopup(true)}
              >
                Edit
              </Button>
            </div>
          </Grid>
          <Grid item xs={4}>
            <Spinner loading={!getContractSuccess}>
              <Avatar
                src={contract.images[0]}
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
                <TableCell>Log ID</TableCell>
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
                  <TableCell align='center'>{item.id}</TableCell>
                  <TableCell align='center'>{item.title}</TableCell>
                  <TableCell align='center'>{item.message}</TableCell>
                  <TableCell align='center'>{item.transactionHash}</TableCell>
                  <TableCell align='center'>{JSON.stringify(item.oldData)}</TableCell>
                  <TableCell align='center'>{JSON.stringify(item.newData)}</TableCell>
                  <TableCell align='center'>{formatTime(item.updatedAt)}</TableCell>
                </TableRow>
              ))}
              <TableRowEmpty visible={!getContractSuccess && items.length === 0} />
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

      <Dialog open={openUpdateContractPopup} fullWidth maxWidth='md'>
        <UpdateContractPopup
          data={contract!}
          onClose={() => setOpenUpdateContractPopup(false)}
          fetchContract={fetchContract}
        />
      </Dialog>
    </>
  );
};

export default ContractDetail;
