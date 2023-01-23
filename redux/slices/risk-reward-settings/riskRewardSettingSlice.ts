import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { AppState } from '../../store';

export interface IRiskRewardSetting {
  riskPertrade: number;
  riskToRewardRatio: number;
}

const initialState: IRiskRewardSetting = {
  riskPertrade: 1000,
  riskToRewardRatio: 2,
};

export const riskRewardSettingSlice = createSlice({
  name: 'riskToRewardSetting',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setRiskPerTrade: (
      state: IRiskRewardSetting,
      action: PayloadAction<number>
    ) => {
      state.riskPertrade = action.payload;
    },
    setRiskToRewardRatio: (
      state: IRiskRewardSetting,
      action: PayloadAction<number>
    ) => {
      state.riskToRewardRatio = action.payload;
    },
  },
});

export const { setRiskPerTrade, setRiskToRewardRatio } =
  riskRewardSettingSlice.actions;

export const selectRiskPerTrade = (state: AppState) =>
  state.riskRewardSetting.riskPertrade;
export const selectRiskRewardRatio = (state: AppState) =>
  state.riskRewardSetting.riskToRewardRatio;

export default riskRewardSettingSlice.reducer;
