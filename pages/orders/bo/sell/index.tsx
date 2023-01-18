import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid/Grid';
import Stack from '@mui/material/Stack/Stack';
import TextField from '@mui/material/TextField/TextField';
import { useState } from 'react';
import { getFyersBOSellParams } from '../../../../utils/orders.helper';
import { fyersBracketSellOrder } from '../../../../services/http.services';
import { IFyersBracketOrderParams, IStock } from '../../../../types/types';
import { getRoundNumber } from '../../../../utils/utils';
import Typography from '@mui/material/Typography/Typography';
import VerticalDivider from '../../../../components/dividers/VerticalDivider';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import InputAdornment from '@mui/material/InputAdornment/InputAdornment';
import { setTheme } from '../../../../utils/theme';
import { Alert, AlertTitle } from '@mui/material';
import TrendingDown from '@mui/icons-material/TrendingDown';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import { stocks } from '../../../../utils/stocks';

const FyersBracketOrderSell = () => {
  const [symbol, setSymbol] = useState<IStock>();
  const [tradingCandle, setTradingCandle] = useState({
    high: 0,
    low: 0,
  });
  const [FnOQty, setFnOQty] = useState(1);
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
      variationLimit
    );

    setBOParams(fyersBoSellParams);

    const bracketSellOrderParams = {
      noConfirm: true,
      productType: 'BO',
      /** -1 for sell side and 1 for buy side */
      side: -1,
      symbol: symbol?.symbol || '',
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
      if (result.data.s === 'error') console.log('error aa gaya!');
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
        <AlertTitle>Fyers Sell Order</AlertTitle>
        <strong>Bracket Order - Sell</strong>
      </Alert>
      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='center'
      >
        <TextField
          label='Risk to reward ratio'
          id='rsik-to-reward-ratio'
          sx={{ m: 1, width: '15ch' }}
          type='number'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>1 : </InputAdornment>
            ),
          }}
          size='small'
          variant='outlined'
        />
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
        justifyContent='space-between'
        alignItems='center'
      >
        <Stack spacing={2}>
          {/* <TextField
            size='small'
            label='Quantity'
            type='number'
            value={sellQty()}
            disabled
            helperText='Calculated on risk per trade'
          /> */}
          <Autocomplete
            size='small'
            options={stocks || []}
            renderInput={(params) => (
              <TextField {...params} label='NSE Symbols' />
            )}
            getOptionLabel={(option) => option.name}
            onChange={(event: any, newValue: any) => {
              setSymbol(newValue);
            }}
          />
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
              !Boolean(tradingCandle.high && tradingCandle.low && symbol)
            }
          >
            {`short ${symbol?.name}`}
          </Button>
        </Stack>

        <VerticalDivider margin='8px' />

        {fyersBOParams.limitPrice ? (
          <Stack spacing={2}>
            <Typography variant='subtitle1'>Orders Placed</Typography>
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
              Cost to cost SL (including brokerage) :
              {getRoundNumber(getTrailingSL())}
            </Typography>
            <Typography>Sell Quantity : {sellQty()}</Typography>
            <Typography>
              Target:
              {getRoundNumber(
                fyersBOParams.limitPrice - fyersBOParams.takeProfit
              )}
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

          {openTrades.length ? (
            openTrades.map((ot) => (
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
