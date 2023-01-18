//@ts-ignore
import fyers from 'fyers-api-v2';
import { NextApiRequest, NextApiResponse } from 'next/types';
import { IHistoryParams } from '../../../../types/types';
import { APP_ID } from '../../../../utils/constants';
import { getAccessToken } from '../../services';

export async function getHistory(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const accessToken = getAccessToken();
  fyers.setAppId(APP_ID);
  fyers.setAccessToken(accessToken);
  const history = new fyers.history();
  const historyParams: IHistoryParams = { ...req.body };
  const result = await history
    .setSymbol(historyParams.symbol)
    .setResolution(historyParams.resolution)
    .setDateFormat(1)
    .setRangeFrom(historyParams.rangeFrom)
    .setRangeTo(historyParams.rangeTo)
    .getHistory();

  /**open - A[1], high - A[2], low - A[3], close A[4], volume A[5] */
  const candles = result.candles;
  res.json(candles);
}
