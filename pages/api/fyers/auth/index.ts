// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
// @ts-ignore
import fyers from 'fyers-api-v2';
import fs from 'fs';

type Data = {
  token: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  fyers.setAppId('9DQFIB120O-100');

  /**Extract auth code from the redirected url */
  const authCode: string = `${req.url?.slice(40).split('&')[0]}`;

  console.log('authcode', authCode);

  if (authCode) {
    /**GET ACCESS TOKEN */
    fyers
      .generate_access_token({
        auth_code: authCode,
        secret_key: 'EVFCE6GK9B',
      })
      .then(
        (response: {
          code: number;
          s: string;
          message?: string;
          access_token: string;
          refresh_token: string;
        }) => {
          fs.writeFile(
            'db/db.json',
            JSON.stringify({ accessToken: response.access_token }),
            function (err) {
              if (err) console.log(err);
            }
          );
          res.redirect(`/scanner/${response.access_token}`);
        }
      )
      .catch((e: any) => console.log('access_token_err>>', e));
  } else {
    res.redirect('/errors');
  }
}
