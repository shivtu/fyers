import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IStock } from '../../../types/types';

import type { AppState } from '../../store';

const initialState: IStock = {
  name: '',
  symbol: '',
  segment: '10',
};

export const selectedStockSlice = createSlice({
  name: 'selectedStock',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setStock: (state: IStock, action: PayloadAction<IStock>) => {
      return action.payload;
    },
  },
});

export const { setStock } = selectedStockSlice.actions;

export const selectStock = (state: AppState) => state.selectedStock;

export default selectedStockSlice.reducer;
