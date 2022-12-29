// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
// @ts-ignore
import fyers from 'fyers-api-v2';
import { getAccessToken } from '../../../services';

export default async function sellOrderHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const accessToken = getAccessToken();

  const orderResult = await fyers.place_order({
    data: req.body,
    app_id: '9DQFIB120O-100',
    token: accessToken,
  });

  return res.json(orderResult);
}
