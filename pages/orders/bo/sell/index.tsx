import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid/Grid';
import Stack from '@mui/material/Stack/Stack';
import TextField from '@mui/material/TextField/TextField';
import { useState } from 'react';
import {
  getFyersBOSellParams,
  isStockSegmentFnO,
} from '../../../../utils/orders.helper';
import { fyersBracketOrder } from '../../../../services/http.services';
import {
  IFyersBracketOrder,
  IFyersBracketOrderParams,
} from '../../../../types/types';
import { getRoundNumber } from '../../../../utils/utils';
import Typography from '@mui/material/Typography/Typography';
import VerticalDivider from '../../../../components/dividers/VerticalDivider';
import { setTheme } from '../../../../utils/theme';
import { Alert, AlertTitle } from '@mui/material';
import TrendingDown from '@mui/icons-material/TrendingDown';
import { useAppSelector } from '../../../../redux/reduxHooks';
import { selectRiskPerTrade } from '../../../../redux/slices/risk-reward-settings/riskRewardSettingSlice';
import StockList from '../../../../components/stock-list/StockList';
import { selectStock } from '../../../../redux/slices/selected-stock/selectedStockSlice';

const FyersBracketOrderSell = () => {
  const state = useAppSelector((state) => state);
  const riskPerTrade = selectRiskPerTrade(state);
  const selectedStock = selectStock(state);
  const [tradingCandle, setTradingCandle] = useState({
    high: 0,
    low: 0,
  });
  const [FnOQty, setFnOQty] = useState('1');
  const [variationLimit, setVariationLimit] = useState<number>(1);
  const [candleSize, setCandleSize] = useState(100);
  const [openTrades, setOpenTrades] = useState<Array<any>>([]);
  const [fyersBOParams, setFyersBOParams] = useState<IFyersBracketOrderParams>({
    limitPrice: 0,
    stopLoss: 0,
    stopPrice: 0,
    takeProfit: 0,
    absoluteStopLossPrice: 0,
    absoluteTargetPrice: 0,
  });

  const handleBracketSellOrder = async () => {
    if (tradingCandle.high - tradingCandle.low > candleSize) {
      const continueIfHighRisk = confirm(
        'High risk, do you want to continue ?'
      );
      if (!continueIfHighRisk) {
        return;
      }
    }
    const fyersBoSellParams = getFyersBOSellParams(
      tradingCandle.high,
      tradingCandle.low,
      variationLimit,
      riskPerTrade
    );

    setFyersBOParams(fyersBoSellParams);

    const bracketSellOrderParams: IFyersBracketOrder = {
      noConfirm: true,
      productType: 'BO',
      /** -1 for sell side and 1 for buy side */
      side: -1,
      symbol: selectedStock.symbol,
      /**if trade is in FnO set custom qty */
      qty: isStockSegmentFnO(selectedStock) ? FnOQty : sellQty(),
      disclosedQty: 0,
      type: 4,
      /** limitPrice is the entry price */
      limitPrice: fyersBoSellParams.limitPrice,
      /** stopPrice is the trigger price */
      stopPrice: fyersBoSellParams.stopPrice,
      /** stopLoss is defined as difference of amount from entry price and not the price itself  */
      stopLoss: fyersBoSellParams.stopLoss,
      /** takeProfit is difference of amount from entry to target price */
      takeProfit: fyersBoSellParams.takeProfit,
      validity: 'DAY',
      filledQty: 0,
      /** offlineOrder false for orders when markets are open and true when when markets are close (AMO) */
      offlineOrder: false,
    };

    try {
      const result = await fyersBracketOrder(bracketSellOrderParams);
      if (result.data.id) {
        setOpenTrades([...openTrades, result.data.id]);
      }
      if (result.data.s === 'error') console.error(result.data);
    } catch (error: any) {
      alert(error.message || 'Could not place order');
    }
  };

  const sellQty = () => {
    const SLPrice = fyersBOParams.limitPrice + fyersBOParams.stopLoss;

    return getRoundNumber(
      riskPerTrade / (SLPrice - fyersBOParams.limitPrice)
    ).toFixed(); /** Risk amount / (SL - entry)  */
  };

  const getTrailingSL = () =>
    fyersBOParams.limitPrice +
    (fyersBOParams.limitPrice / 100) * variationLimit;

  return (
    <Stack spacing={2}>
      <Alert severity='error' icon={<TrendingDown />}>
        <AlertTitle>
          Fyers <mark>Bracket Order</mark> - Sell
        </AlertTitle>
      </Alert>
      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='center'
      >
        <TextField
          size='small'
          label='Avoid trade if candle greater than'
          placeholder={`Defaults to ${candleSize}`}
          type='number'
          onChange={(e) => setCandleSize(Number(e.target.value))}
        />
      </Grid>
      <Grid
        container
        direction='row'
        justifyContent='space-between'
        alignItems='center'
      >
        <Stack spacing={2}>
          <StockList />
          {isStockSegmentFnO(selectedStock) && (
            <TextField
              size='small'
              label='Quantity'
              type='number'
              helperText='custom qty for FnO'
              onChange={(e) => setFnOQty(Number(e.target.value).toFixed())}
            />
          )}
          <TextField
            size='small'
            label='Variation limit'
            type='number'
            onChange={(e) => setVariationLimit(Number(e.target.value))}
          />
          <TextField
            size='small'
            label='High'
            type='number'
            onChange={(e) =>
              setTradingCandle({
                ...tradingCandle,
                ...{ high: Number(e.target.value) },
              })
            }
          />
          <TextField
            size='small'
            label='Low'
            type='number'
            onChange={(e) =>
              setTradingCandle({
                ...tradingCandle,
                ...{ low: Number(e.target.value) },
              })
            }
          />
          <Button
            color={setTheme('sell')}
            size='small'
            onClick={handleBracketSellOrder}
            variant='contained'
            disabled={
              !Boolean(
                tradingCandle.high && tradingCandle.low && selectedStock.name
              )
            }
          >
            {`short ${selectedStock?.name}`}
          </Button>
        </Stack>

        <VerticalDivider margin='8px' />

        {fyersBOParams.limitPrice ? (
          <Stack spacing={2}>
            <Typography variant='subtitle1'>Orders Placed</Typography>
            <Typography>Entry : {fyersBOParams?.limitPrice}</Typography>
            <Typography>
              SL :{getRoundNumber(fyersBOParams.absoluteStopLossPrice)}
            </Typography>
            <Typography>
              Cost to cost SL (including brokerage) :
              {getRoundNumber(getTrailingSL())}
            </Typography>
            <Typography>
              Sell Quantity :
              {isStockSegmentFnO(selectedStock) ? FnOQty : sellQty()}
            </Typography>
            <Typography>
              Target:
              {getRoundNumber(fyersBOParams.absoluteTargetPrice)}
            </Typography>
            <Button size='small' variant='contained'>
              Cancel trade
            </Button>
          </Stack>
        ) : (
          <div>
            <Typography variant='subtitle1'>Orders Placed</Typography>
            <Typography variant='caption'>No orders placed yet</Typography>
          </div>
        )}

        <VerticalDivider margin='8px' />

        <Stack spacing={2}>
          <Typography>Modify executed trades</Typography>

          {openTrades.length ? (
            openTrades.map((ot) => (
              <div key={ot}>
                <span>
                  {`Fyers Order-ID: ${ot}`}
                  <Button variant='contained' size='small'>
                    Modify order
                  </Button>
                  <Button variant='contained' size='small'>
                    Trail SL to break even
                  </Button>
                </span>
              </div>
            ))
          ) : (
            <Typography variant='caption'>No open trades yet</Typography>
          )}
        </Stack>
      </Grid>
    </Stack>
  );
};

export default FyersBracketOrderSell;
