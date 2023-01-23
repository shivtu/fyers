import Stack from '@mui/material/Stack/Stack';
import Alert from '@mui/material/Alert/Alert';
import AlertTitle from '@mui/material/AlertTitle/AlertTitle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Grid from '@mui/material/Grid/Grid';
import TextField from '@mui/material/TextField/TextField';
import Button from '@mui/material/Button/Button';
import VerticalDivider from '../../../../components/dividers/VerticalDivider';
import Typography from '@mui/material/Typography/Typography';
import { useState } from 'react';
import StockList from '../../../../components/stock-list/StockList';
import { setTheme } from '../../../../utils/theme';
import { useAppSelector } from '../../../../redux/reduxHooks';
import { selectStock } from '../../../../redux/slices/selected-stock/selectedStockSlice';
import {
  getFyersBOBuyParams,
  isStockSegmentFnO,
} from '../../../../utils/orders.helper';
import {
  IFyersBracketOrder,
  IFyersBracketOrderParams,
} from '../../../../types/types';
import { fyersBracketOrder } from '../../../../services/http.services';
import { getRoundNumber } from '../../../../utils/utils';

const FyersBracketOrderBuy = () => {
  const state = useAppSelector((state) => state);
  const selectedStock = selectStock(state);
  const riskPerTrade = state.riskRewardSetting.riskPertrade;
  const riskToRewardRatio = state.riskRewardSetting.riskToRewardRatio;
  const [fyersBOParams, setFyersBOParams] =
    useState<IFyersBracketOrderParams>();
  const [candleSize, setCandleSize] = useState(100);
  const [tradingCandle, setTradingCandle] = useState({
    high: 0,
    low: 0,
  });
  const [variationLimit, setVariationLimit] = useState<number>(1);
  const [fyersBOBuyParams, setFyersBOBuyParams] = useState<{
    stopPrice: number;
    limitPrice: number;
    stopLoss: number;
    takeProfit: number;
  }>({
    limitPrice: 0,
    stopLoss: 0,
    stopPrice: 0,
    takeProfit: 0,
  });
  const [FnOQty, setFnOQty] = useState('1');
  const [openTrades, setOpenTrades] = useState<Array<any>>([]);

  const buyQty = () => {
    if (fyersBOBuyParams) {
      return (
        riskPerTrade /
        (fyersBOBuyParams.limitPrice - (tradingCandle.low - variationLimit))
      ).toFixed();
    }
    return '0';
  };

  const handleBracketBuyOrder = async () => {
    setFyersBOBuyParams(
      getFyersBOBuyParams(
        tradingCandle.high,
        tradingCandle.low,
        variationLimit,
        riskToRewardRatio
      )
    );
    const bracketBuyOrderParams: IFyersBracketOrder = {
      noConfirm: true,
      productType: 'BO',
      /** -1 for sell side and 1 for buy side */
      side: 1,
      symbol: selectedStock.symbol,
      /**if trade is in FnO set custom qty */
      qty: isStockSegmentFnO(selectedStock) ? FnOQty : buyQty(),
      disclosedQty: 0,
      type: 4,
      /** limitPrice is the entry price */
      limitPrice: fyersBOBuyParams?.limitPrice,
      /** stopPrice is the trigger price */
      stopPrice: fyersBOBuyParams?.stopPrice,
      /** stopLoss is defined as difference of amount from entry price and not the price itself  */
      stopLoss: fyersBOBuyParams?.stopLoss,
      /** takeProfit is difference of amount from entry to target price */
      takeProfit: fyersBOBuyParams?.takeProfit,
      validity: 'DAY',
      filledQty: 0,
      /** offlineOrder false for orders when markets are open and true when when markets are close (AMO) */
      offlineOrder: false,
    };

    try {
      const result = await fyersBracketOrder(bracketBuyOrderParams);

      if (result.data.id) {
        setOpenTrades([...openTrades, result.data.id]);
      }
      if (result.data.s === 'error') console.error(result.data);
    } catch (error: any) {
      alert(error.message || 'Could not place order');
    }
  };

  return (
    <Stack spacing={2}>
      <Alert severity='success' icon={<TrendingUpIcon />}>
        <AlertTitle>
          Fyers <mark>Bracket Order</mark> - Buy
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
              onChange={(e) => setFnOQty(e.target.value)}
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
            color={setTheme('buy')}
            size='small'
            variant='contained'
            onClick={handleBracketBuyOrder}
            disabled={
              !Boolean(
                tradingCandle.high && tradingCandle.low && selectedStock.name
              )
            }
          >
            {`long ${selectedStock?.name}`}
          </Button>
        </Stack>

        <VerticalDivider margin='8px' />

        {fyersBOParams?.limitPrice ? (
          <Stack spacing={2}>
            <Typography variant='subtitle1'>Orders Placed</Typography>
            <Typography>Entry : {fyersBOParams.limitPrice}</Typography>
            <Typography>
              SL : {getRoundNumber(fyersBOParams.absoluteStopLossPrice)}
            </Typography>
            <Typography>Cost to cost SL (including brokerage) :{0}</Typography>
            <Typography>
              Buy Quantity :{' '}
              {isStockSegmentFnO(selectedStock) ? FnOQty : buyQty()}
            </Typography>
            <Typography>
              Target: {getRoundNumber(fyersBOParams.absoluteTargetPrice)}
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
          <Typography>Modify current open trades</Typography>
        </Stack>
      </Grid>
    </Stack>
  );
};

export default FyersBracketOrderBuy;
