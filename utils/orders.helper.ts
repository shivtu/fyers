import { IFyersBracketSellOrder } from '../types/types';
import { getRoundNumber } from './utils';

export const initialBoSellOrder: IFyersBracketSellOrder = {
  noConfirm: true,
  productType: 'BO',
  side: -1,
  symbol: 'NSE:CANBK-EQ',
  qty: 1,
  disclosedQty: 0,
  type: 4,
  limitPrice: 0,
  stopPrice: 0,
  stopLoss: 1.0,
  takeProfit: 1,
  validity: 'DAY',
  filledQty: 0,
  offlineOrder: false,
};

export function getFyersBOSellOrderParams(
  high: number,
  low: number,
  variationLimit: number
) {
  const stopPrice = getRoundNumber(low - variationLimit); // trigger price
  const limitPrice = getRoundNumber(stopPrice - 0.05); // price to enter the trade
  const stopLoss = getRoundNumber(high + variationLimit - low); // difference of entery price - (high + variation)
  const takeProfit = getRoundNumber(high + variationLimit - limitPrice) * 2;

  return { stopPrice, limitPrice, stopLoss, takeProfit };
}
