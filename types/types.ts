export interface IHistoryParams {
  rangeFrom: string;
  rangeTo: string;
  symbol: string;
  resolution: string;
}

export interface IUserProfile {
  pan: string;
  display_name: string | null;
  email_id: string;
  fy_id: string;
  mobile_number: string;
  name: string;
  pin_change_date: string;
  pwd_change_date: null | string;
  pwd_to_expire: number;
  totp: boolean;
}

export interface IFyersBracketOrderParams {
  limitPrice: number;
  stopPrice: number;
  stopLoss: number;
  takeProfit: number;
}

export interface IFyersBracketSellOrder {
  noConfirm: boolean;
  productType: string;
  side: number;
  symbol: string;
  qty: string;
  disclosedQty: number;
  type: number;
  limitPrice: number;
  stopPrice: number;
  stopLoss: number;
  takeProfit: number;
  validity: string;
  filledQty: number;
  offlineOrder: boolean;
}

export interface IAUthState {
  token: string;
  refreshToken: string;
  feedToken: string;
}

export interface IOrderParameters {
  riskPerTrade: number;
  riskToRewardRatio: number;
  riskyCandleSize: number;
}

export interface INSESymbol {
  name: string;
  symbol: string;
}
