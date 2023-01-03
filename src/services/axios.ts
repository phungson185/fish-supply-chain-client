import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { API_URL } from 'env';
import { stringify } from 'querystring';
import { store } from 'reducers';
import { ProfileState, signOut } from 'reducers/profile';
import { openAlert } from 'reducers/notification';

const beforeRequest = (config: AxiosRequestConfig) => {
  const { isLoggedIn, accessToken }: ProfileState = store.getState().profile;
  if (isLoggedIn) {
    Object.assign(config.headers as any, { Authorization: `Bearer ${accessToken}` });
  }
  if (config.data instanceof FormData) {
    Object.assign(config.headers as any, { 'Content-Type': 'multipart/form-data' });
  }
  return config;
};

const onError = async (error: AxiosError) => {
  const { response } = error;
  if (response) {
    const { status } = response;
    if (status === 401) {
      store.dispatch(signOut());
    } else {
      const { message } = response?.data.errors || response?.data;
      store.dispatch(openAlert({ message, variant: 'error' }));
    }
  }
  return Promise.reject(error);
};

const client = axios.create({ baseURL: API_URL });
client.defaults.paramsSerializer = (params) =>
  stringify(
    Object.keys(params)
      .filter((key) => String(params[key]).trim())
      .reduce((trim, key) => ({ ...trim, [key]: params[key] }), {}),
  );
client.interceptors.request.use(beforeRequest);
client.interceptors.response.use((response) => {
  const { success = 1, data, errors } = response.data;
  if (success) {
    return data;
  } else {
    const { message } = errors;
    store.dispatch(openAlert({ message, variant: 'error' }));
  }
}, onError);

// client.defaults.transformResponse = [...(axios.defaults.transformResponse as []), (data) => camelizeKeys(data)];

const clientDownload = axios.create({ baseURL: API_URL });
clientDownload.interceptors.request.use(beforeRequest);
clientDownload.interceptors.response.use(({ data }) => data, onError);

export { client, clientDownload };
