import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import counterReducer from './slices/counter/counterSlice';
import riskRewardSettingReducer from './slices/risk-reward-settings/riskRewardSettingSlice';
import selectedStockReducer from './slices/selected-stock/selectedStockSlice';

export function makeStore() {
  return configureStore({
    reducer: {
      counter: counterReducer,
      riskRewardSetting: riskRewardSettingReducer,
      selectedStock: selectedStockReducer,
    },
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
