import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'reducers';
import { SystemType } from 'types/System';

export const systemSlice = createSlice({
  name: 'system',
  initialState: {} as SystemType,
  reducers: {
    saveSystem: (state, { payload }) => {
      return payload;
    },
  },
});

export const { saveSystem } = systemSlice.actions;

export const systemSelector = ({ system }: RootState) => system;

export default systemSlice.reducer;
