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
  absoluteTargetPrice: number;
  absoluteStopLossPrice: number;
}

export interface IFyersBracketOrder {
  noConfirm: boolean;
  productType:
    | 'CNC'
    | 'INTRADAY'
    | 'MARGIN'
    | 'CO'
    | 'BO' /**CNC => For equity only INTRADAY => Applicable for all segments. MARGIN => Applicable only for derivatives CO => Cover Order BO => Bracket Order */;
  side: -1 | 1;
  symbol: string;
  qty: string;
  disclosedQty: number;
  type:
    | 1
    | 2
    | 3
    | 4 /**1 => Limit Order 2 => Market Order 3 => Stop Order (SL-M) 4 => Stoplimit Order (SL-L)*/;
  limitPrice: number;
  stopPrice: number;
  stopLoss: number;
  takeProfit: number;
  validity:
    | 'IOC'
    | 'DAY' /**IOC => Immediate or Cancel DAY => Valid till the end of the day */;
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
/**
 10	Capital Market 
 11	Equity Derivatives
 12	Currency Derivatives
 20	Commodity Derivatives
 */
export type StockSegmentTypes = '10' | '11' | '12' | '20';

export interface IStock {
  name: string;
  symbol: string;
  segment: StockSegmentTypes;
}

export type OrderType = 'buy' | 'sell';
