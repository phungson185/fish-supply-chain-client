import { Assignment, CategoryOutlined } from '@mui/icons-material';
import {
  Avatar,
  Button,
  Chip,
  Dialog,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Switch,
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
import { useSnackbar } from 'notistack';
import { parse } from 'qs';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { profileSelector } from 'reducers/profile';
import { fishSeedCompanyService, userService } from 'services';
import { formatTime } from 'utils/common';

const FILTERS = [
  { label: 'Company name', orderBy: 'name' },
  { label: 'Company address', orderBy: 'userAddress' },
  { label: 'Role', orderBy: 'role' },
  { label: 'Updated time', orderBy: 'updatedAt' },
];

const SORT_TYPES = [
  { label: 'Low to High', desc: 'false' },
  { label: 'High to Low', desc: 'true' },
];

const AccountManagement = () => {
  const { id, role, address } = useSelector(profileSelector);

  const location = useLocation();
  const { tab, page = 1, ...query } = parse(location.search, { ignoreQueryPrefix: true });
  const [dataSearch, onSearchChange] = useSearch({
    page,
  });
  const { data, isFetching, refetch } = useQuery(
    ['userService.getAllUsers', dataSearch],
    () => userService.getAllUsers(dataSearch),
    {
      keepPreviousData: false,
      staleTime: 0,
    },
  );
  const { enqueueSnackbar } = useSnackbar();

  const { items = [], total, currentPage, pages: totalPage } = data ?? {};
  const [orderBy, setOrderBy] = useState(query.orderBy || FILTERS[0].orderBy);
  const [desc, setDesc] = useState(query.desc || SORT_TYPES[0].desc);
  const [search, setSearch] = useState(query.search || '');
  const [params, setParams] = useState({ search, page });
  const [anchorFilter, openFilter, onOpenFilter, onCloseFilter] = useAnchor();
  const [anchorSort, openSort, onOpenSort, onCloseSort] = useAnchor();
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

  const { mutate: updateUser } = useMutation(userService.updateUser, {
    onSuccess: () => {
      enqueueSnackbar('Update user successfully', { variant: 'success' });
      refetch();
    },
  });

  const handleUpdateUser = async (id: string, userAddress: string, active: boolean) => {
    try {
      await userService.updateUserStatus(address, userAddress, !active);
      updateUser({ userId: id, active: !active });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Update user failed', { variant: 'error' });
    }
  };

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
          placeholder='Search...'
          InputProps={{ className: 'bg-white text-black' }}
          value={search}
          sx={{ width: '30%' }}
          onChange={(event) => {
            const { value } = event.target;
            setSearch(value);
            debounceChangeParams({ search: value });
          }}
        />
      </div>
      <TableContainer component={Paper}>
        <Spinner loading={isFetching}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Avatar</TableCell>
                <TableCell>Wallet address</TableCell>
                <TableCell>Company name</TableCell>
                <TableCell>Company phone</TableCell>
                <TableCell>Company address</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Updated time</TableCell>
                <TableCell>Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell align='center'>{item.id}</TableCell>
                  <TableCell align='center'>
                    <Avatar src={item.avatar} variant='square' />
                  </TableCell>
                  <TableCell align='center'>{item.address}</TableCell>
                  <TableCell align='center'>{item.name}</TableCell>
                  <TableCell align='center'>{item.phone}</TableCell>
                  <TableCell align='center'>{item.userAddress}</TableCell>

                  <TableCell align='center'>
                    <Chip color={userService.mapColorRole(item.role)} label={item.role} style={{ minWidth: '170px' }} />
                  </TableCell>
                  <TableCell align='center'>{formatTime(item.updatedAt)}</TableCell>

                  <TableCell className='text-center'>
                    <Switch
                      color={item.active ? 'primary' : 'error'}
                      checked={item.active}
                      onClick={() => {
                        handleUpdateUser(item.id, item.address, item.active);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
              <TableRowEmpty visible={!isFetching && items.length === 0} />
            </TableBody>
            <caption className='font-bold border-t'>{total ?? 0} Users</caption>
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

export default AccountManagement;
