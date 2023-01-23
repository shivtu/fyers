import { IFyersBracketOrder, IStock } from '../types/types';
import { getRoundNumber } from './utils';

export const getFyersBOSellParams = (
  high: number,
  low: number,
  variationLimit: number,
  riskToRewardRatio: number
) => {
  const stopPrice = getRoundNumber(low - variationLimit); // trigger price
  const limitPrice = getRoundNumber(stopPrice - variationLimit); // price to enter the trade
  const absoluteStopLossPrice = high + variationLimit;
  const stopLoss = getRoundNumber(absoluteStopLossPrice - low); // difference of entery price - (high + variation)
  const takeProfit =
    getRoundNumber(absoluteStopLossPrice - limitPrice) * riskToRewardRatio;

  const absoluteTargetPrice = low - (high - low) * riskToRewardRatio;

  return {
    stopPrice,
    limitPrice,
    stopLoss,
    takeProfit,
    absoluteTargetPrice,
    absoluteStopLossPrice,
  };
};

export const getFyersBOBuyParams = (
  high: number,
  low: number,
  variationLimit: number,
  riskToRewardRatio: number
) => {
  const stopPrice = getRoundNumber(high + variationLimit); // trigger price
  const limitPrice = getRoundNumber(stopPrice + variationLimit); // price to enter the buy trade
  const absoluteStopLossPrice = low - variationLimit;
  const stopLoss = getRoundNumber(limitPrice - absoluteStopLossPrice);
  const absoluteTargetPrice = high + (high - low) * riskToRewardRatio;
  const takeProfit = getRoundNumber(absoluteTargetPrice - limitPrice);
  return {
    stopPrice,
    limitPrice,
    stopLoss,
    takeProfit,
    absoluteTargetPrice,
    absoluteStopLossPrice,
  };
};

export const isStockSegmentFnO = (selectedStock: IStock) =>
  selectedStock?.segment === '11' || selectedStock?.segment === '20';
