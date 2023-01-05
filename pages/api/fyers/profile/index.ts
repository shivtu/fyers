// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import fyers from 'fyers-api-v2';
import { getAccessToken } from '../../services';

export default async function profileHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const accessToken = getAccessToken();
  fyers.setAppId('9DQFIB120O-100');
  fyers.setAccessToken(accessToken);
  const profile = await fyers.get_profile();

  return res.json(profile);
}
