// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
//@ts-ignore
import fyers from 'fyers-api-v2';
import { getAccessToken } from '../../services';
import { APP_ID } from '../../../../utils/constants';

export default async function profileHandler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const accessToken = getAccessToken();
  fyers.setAppId(APP_ID);
  fyers.setAccessToken(accessToken);
  const profile = await fyers.get_profile();

  return res.json(profile);
}
