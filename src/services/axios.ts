import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { API_URL } from 'env';
import { stringify } from 'querystring';
import { store } from 'reducers';
import { ProfileState, signOut } from 'reducers/profile';
import { openAlert } from 'reducers/notification';
import { camelizeKeys } from 'humps';

// const beforeRequest = (config: AxiosRequestConfig) => {
//   const { isLoggedIn, accessToken }: ProfileState = store.getState().profile;
//   if (isLoggedIn) {
//     Object.assign(config.headers as any, { Authorization: `Bearer ${accessToken}` });
//   }
//   if (config.data instanceof FormData) {
//     Object.assign(config.headers as any, { 'Content-Type': 'multipart/form-data' });
//   }
//   return config;
// };

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
client.interceptors.response.use((response) => {
  if (['POST', 'PUT', 'DELETE'].includes(response.config.method?.toUpperCase()!)) {
    store.dispatch(openAlert({ message: 'Successfully' }));
  }

  const { success = 1, data, errors } = response.data;
  if (success) {
    return data;
  } else {
    const { message } = errors;
    store.dispatch(openAlert({ message, variant: 'error' }));
  }
}, onError);

client.defaults.transformResponse = [...(axios.defaults.transformResponse as []), (data) => camelizeKeys(data)];

export { client };
