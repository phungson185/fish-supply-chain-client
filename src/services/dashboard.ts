import { DashboardParamsType, DashboardServerType, DashboardType } from 'types/Dashboard';
import { ItemPaginateType, ItemParamsType, ItemEastFogPaginateType, ItemEastFogParamsType } from 'types/Item';
import { SystemType, SystemUpdateType } from 'types/System';
import {
  AccountPaginateType,
  AccountParamsType,
  AccountSetWhiteList,
  UserPaginateType,
  UserParamsType,
} from 'types/User';
import { client } from './axios';

const fetchSystem = (): Promise<SystemType> => client.get(`/market-apis/api/system`);
const updateSystem = (body: SystemUpdateType) =>
  client.put(`/dashboard-apis/api/dashboard/systemConfig/${body.id}`, body);

const fetchDashboard = (params?: DashboardParamsType): Promise<DashboardType> =>
  client.get(`/dashboard-apis/api/dashboard`, { params });
const fetchServerStatistics = (): Promise<DashboardServerType> =>
  client.get(`/dashboard-apis/api/dashboard/serverStatistics`);

const fetchItems = (params: ItemParamsType): Promise<ItemPaginateType> =>
  client.get(`/dashboard-apis/api/items`, { params });
const fetchUsers = (params: UserParamsType): Promise<UserPaginateType> =>
  client.get(`/dashboard-apis/api/users`, { params });
const fetchAccounts = (params: AccountParamsType): Promise<AccountPaginateType> =>
  client.get(`/dashboard-apis/api/dashboard/getAccounts`, { params });

const setWhiteList = (body: AccountSetWhiteList) => client.post(`/dashboard-apis/api/dashboard/setWhitelist`, body);

const fetchItemsEastFog = (params: ItemEastFogParamsType): Promise<ItemEastFogPaginateType> =>
  client.get(`dashboard-apis/api/eastfog-items`, { params });

export default {
  fetchSystem,
  updateSystem,

  fetchDashboard,
  fetchServerStatistics,

  fetchUsers,
  fetchItems,
  fetchAccounts,

  setWhiteList,
  fetchItemsEastFog,
};
