import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid/Grid';
import Stack from '@mui/material/Stack/Stack';
import TextField from '@mui/material/TextField/TextField';
import { useState } from 'react';
import { getFyersBOSellOrderParams } from '../../utils/orders.helper';
import { fyersBracketSellOrder } from '../../services/http.services';
import { IFyersBracketOrderParams } from '../../types/types';
import { getRoundNumber } from '../../utils/utils';
import Typography from '@mui/material/Typography/Typography';
import VerticalDivider from '../../components/dividers/VerticalDivider';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import Checkbox from '@mui/material/Checkbox/Checkbox';

const Orders = () => {
  const [symbol, setSymbol] = useState('NSE:CANBK-EQ');
  const [tradingCandle, setTradingCandle] = useState({
    high: 0,
    low: 0,
  });
  const [riskPerTrade, setRiskPerTrade] = useState<number>(100);
  const [variationLimit, setVariationLimit] = useState<number>(0.1);
  const [candleSize, setCandleSize] = useState(1.5);
  const [openTrades, setOpenTrades] = useState<Array<any>>([]);
  const [fyersBOParams, setBOParams] = useState<IFyersBracketOrderParams>({
    limitPrice: 0,
    stopLoss: 0,
    stopPrice: 0,
    takeProfit: 0,
  });

  const handleBracketSellOrder = async () => {
    if (tradingCandle.high - tradingCandle.low > candleSize) {
      alert('High risk');
      return;
    }
    const fyersBoSellParams = getFyersBOSellOrderParams(
      tradingCandle.high,
      tradingCandle.low,
      variationLimit
    );

    setBOParams(fyersBoSellParams);

    const bracketSellOrderParams = {
      noConfirm: true,
      productType: 'BO',
      /** -1 for sell side and 1 for buy side */
      side: -1,
      symbol,
      qty: sellQty(),
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
      const result = await fyersBracketSellOrder(bracketSellOrderParams);
      if (result.data.id) {
        setOpenTrades([...openTrades, result.data.id]);
      }
    } catch (error: any) {
      alert(error.message || 'Could not place order');
    }
  };

  const sellQty: () => number = () => {
    const SLPrice = fyersBOParams.limitPrice + fyersBOParams.stopLoss;

    return getRoundNumber(
      riskPerTrade / (SLPrice - fyersBOParams.limitPrice)
    ); /** Risk amount / (SL - entry)  */
  };

  const getTrailingSL = () =>
    fyersBOParams.limitPrice + (fyersBOParams.limitPrice / 100) * 0.01;

  return (
    <Stack spacing={2}>
      <Typography variant='h6'>Fyers Bracket Sell Orders</Typography>
      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='center'
      >
        <TextField
          size='small'
          label='Avoid trade if candle greater than'
          placeholder='Defaults to 1.5'
          type='number'
          onChange={(e) => setCandleSize(Number(e.target.value))}
        />
        <VerticalDivider margin='8px' />
        <TextField
          size='small'
          label='Risk per trade'
          type='number'
          onChange={(e) => setRiskPerTrade(Number(e.currentTarget.value))}
        />

        <FormControlLabel
          style={{ margin: '8px' }}
          control={<Checkbox defaultChecked />}
          label='Set for all trades'
        />
      </Grid>
      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='center'
      >
        <Stack spacing={2}>
          <TextField
            size='small'
            label='Symbol'
            onChange={(e) => setSymbol(e.currentTarget.value.toUpperCase())}
          />
          <TextField
            size='small'
            label='Variation limit'
            type='number'
            onChange={(e) => setVariationLimit(Number(e.target.value))}
          />
          <TextField
            size='small'
            label='Quantity'
            type='number'
            value={sellQty()}
            disabled
            // onChange={(e) => setQty(Number(e.currentTarget.value))}
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
            size='small'
            onClick={handleBracketSellOrder}
            variant='contained'
          >
            Place Bracket Sell Order
          </Button>
        </Stack>

        <VerticalDivider margin='8px' />

        <Stack spacing={2}>
          <Typography variant='subtitle1'>Open trade details</Typography>
          <Typography>Entry : {fyersBOParams?.limitPrice}</Typography>
          <Typography>
            SL :
            {getRoundNumber(
              fyersBOParams.limitPrice +
                fyersBOParams.stopLoss +
                variationLimit * 2
            )}
          </Typography>
          <Typography>
            Trailing SL :{getRoundNumber(getTrailingSL())}
          </Typography>
          <Typography>
            Sell Quantity : {isFinite(sellQty()) ? sellQty() : 0}
          </Typography>
          <Typography>
            Target:{' '}
            {getRoundNumber(
              fyersBOParams.limitPrice - fyersBOParams.takeProfit
            )}
          </Typography>
        </Stack>

        <VerticalDivider margin='8px' />

        <Stack spacing={2}>
          <Typography>Modify current open trades</Typography>
          {openTrades?.map((ot) => (
            <div key={ot}>
              <span>
                {`Fyers Order-ID: ${ot}`}
                <Button variant='contained' size='small'>
                  Canel order
                </Button>
                <Button variant='contained' size='small'>
                  Trail SL to break even
                </Button>
              </span>
            </div>
          ))}
          {!openTrades.length && (
            <Typography variant='caption'>No open trades yet</Typography>
          )}
        </Stack>
      </Grid>
    </Stack>
  );
};

export default Orders;
