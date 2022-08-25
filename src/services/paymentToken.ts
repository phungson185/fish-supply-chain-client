import { client } from './axios';
import {
  PaymentTokenParamsType,
  PaymentTokenPaginateType,
  PaymentTokenUpdateOrCreateType,
  PaymentTokenType,
} from 'types/PaymentToken';

const fetchPaymentTokens = (params?: PaymentTokenParamsType): Promise<PaymentTokenPaginateType> =>
  client.get(`/dashboard-apis/api/paymenttoken`, { params });

const createPaymentToken = (body: PaymentTokenUpdateOrCreateType): Promise<PaymentTokenType> =>
  client.post(`/dashboard-apis/api/paymenttoken`, body);

const updatePaymentToken = ({ id, ...body }: PaymentTokenUpdateOrCreateType): Promise<PaymentTokenType> =>
  client.put(`/dashboard-apis/api/paymenttoken/${id}`, body);

const deletePaymentToken = ({ id }: { id: string }) => client.delete(`/dashboard-apis/api/paymenttoken/${id}`);

export default {
  fetchPaymentTokens,
  createPaymentToken,
  updatePaymentToken,
  deletePaymentToken,
};
