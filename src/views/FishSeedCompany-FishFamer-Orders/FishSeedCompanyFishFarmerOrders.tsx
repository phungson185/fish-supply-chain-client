import { AccessTime, BalanceOutlined, CategoryOutlined, DeviceThermostat, SetMeal } from '@mui/icons-material';
import {
  Avatar,
  Button,
  Chip,
  Container,
  debounce,
  Dialog,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { Spinner, TableRowEmpty } from 'components';
import { ProcessStatus, statusStep } from 'components/ConfirmStatus';
import { useAnchor, useSearch } from 'hooks';
import { parse } from 'qs';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { fishFarmerService, fishSeedCompanyService } from 'services';
import { FishSeedCompanyFishFarmerOrderType } from 'types/FishFarmer';
import { ConfirmPopup } from './popups';
import { RoleType } from 'types/Auth';
import { useSelector } from 'react-redux';
import { profileSelector } from 'reducers/profile';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import moment from 'moment';
import { formatTime } from 'utils/common';
import useTabs, { TabType } from 'hooks/useTabs';
import PendingTab from './PendingTab';
import AllOrdersTab from './AllOrdersTab';
import AcceptedTab from './AcceptedTab';
import RejectedTab from './RejectedTab';
import ReceivedTab from './ReceivedTab';

const FILTERS = [{ label: 'Number of fish seeds ordered', orderBy: 'numberOfFishSeedsOrdered' }];

const SORT_TYPES = [
  { label: 'Low to High', desc: 'false' },
  { label: 'High to Low', desc: 'true' },
];

const FishSeedCompanyFishFarmerOrders = () => {
  const { address, role } = useSelector(profileSelector);

  const location = useLocation();
  const { tab, page = 1, ...query } = parse(location.search, { ignoreQueryPrefix: true });
  const [dataSearch, onSearchChange] = useSearch({ page });
  const [anchorFilter, openFilter, onOpenFilter, onCloseFilter] = useAnchor();
  const [anchorSort, openSort, onOpenSort, onCloseSort] = useAnchor();
  const { enqueueSnackbar } = useSnackbar();
  // const { data, isFetching, refetch } = useQuery(
  //   ['fishFarmerService.getOrders', dataSearch],
  //   () => fishFarmerService.getOrders(dataSearch),
  //   {
  //     keepPreviousData: false,
  //     staleTime: 0,
  //   },
  // );

  // const { items = [], total, currentPage, pages: totalPage } = data ?? {};
  const [orderBy, setOrderBy] = useState(query.orderBy || FILTERS[0].orderBy);
  const [desc, setDesc] = useState(query.desc || SORT_TYPES[0].desc);
  const [search, setSearch] = useState(query.search || '');
  const [params, setParams] = useState({ search, page });
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<FishSeedCompanyFishFarmerOrderType>(
    {} as FishSeedCompanyFishFarmerOrderType,
  );

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

  const tabs = ([] as TabType[])
    .concat([{ code: 'all', label: 'All orders', component: <AllOrdersTab /> }])
    .concat([{ code: 'pending', label: 'Pending orders', component: <PendingTab /> }])
    .concat([{ code: 'accepted', label: 'Accepted orders', component: <AcceptedTab /> }])
    .concat([{ code: 'rejected', label: 'Rejected orders', component: <RejectedTab /> }])
    .concat([{ code: 'received', label: 'Received orders', component: <ReceivedTab /> }]);

  const [activeTab, onTabChange] = useTabs(tabs);

  // useEffect(() => {
  //   onTabChange({} as SyntheticEvent<Element, Event>, 'account');
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <>
      <Container>
        <Tabs value={activeTab} onChange={onTabChange} classes={{ flexContainer: 'border-b justify-center' }}>
          {tabs.map((tab) => (
            <Tab
              key={tab.code}
              className='w-[120px] sm:w-[180px] border-none'
              style={{ wordBreak: 'break-word' }}
              label={tab.label}
              value={tab.code}
            />
          ))}
        </Tabs>
        {tabs.map((tab) => (
          <div key={tab.code} hidden={tab.code !== activeTab} className=''>
            {tab.component}
          </div>
        ))}
      </Container>
    </>
  );
};

export default FishSeedCompanyFishFarmerOrders;
