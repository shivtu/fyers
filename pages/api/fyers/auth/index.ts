// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
//@ts-ignore
import fyers from 'fyers-api-v2';
import fs from 'fs';
import { APP_ID, CLIENT_SECRET } from '../../../../utils/constants';

type Data = {
  token: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  fyers.setAppId(APP_ID);

  /**Extract auth code from the redirected url */
  const authCode: string = `${req.url?.slice(40).split('&')[0]}`;

  if (authCode) {
    /**GET ACCESS TOKEN */
    fyers
      .generate_access_token({
        auth_code: authCode,
        client_id: APP_ID,
        secret_key: CLIENT_SECRET,
      })
      .then(
        (response: {
          code: number;
          s: string;
          message?: string;
          access_token: string;
          refresh_token: string;
        }) => {
          // console.log('response>>>', response);
          fs.writeFile(
            'db/db.json',
            JSON.stringify({ accessToken: response.access_token }),
            function (err) {
              if (err) console.error(err);
            }
          );
          res.redirect(`/scanner/${response.access_token}`);
        }
      )
      .catch((e: any) => console.error('access_token_err>>', e));
  } else {
    res.redirect('/errors');
  }
}
