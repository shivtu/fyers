// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
//@ts-ignore
import fyers from 'fyers-api-v2';
import { getAccessToken } from '../../../services';
import { APP_ID } from '../../../../../utils/constants';

export default async function modifyOrderHAndler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const accessToken = getAccessToken();

  const orderResult = await fyers.modify_order({
    data: req.body,
    app_id: APP_ID,
    token: accessToken,
  });

  return res.json(orderResult);
}
