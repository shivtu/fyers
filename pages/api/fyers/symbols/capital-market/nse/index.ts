//@ts-ignore
import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next/types';

function csvToJSON(csv: any) {
  var lines = csv.split('\n');

  var result = [];

  var headers = [
    'Fytoken',
    'Symbol Details',
    'Exchange Instrument type',
    'Minimum lot size',
    'Tick size',
    'ISIN',
    'Trading Session',
    'Last update date',
    'Expiry date',
    'Symbol ticker',
    'Exchange',
    'Segment',
    'Scrip code',
    'Underlying scrip code',
    'Strike price',
    'Option type',
    'xx',
    'REDUDANT',
  ];

  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(',');

    for (var j = 0; j < headers.length; j++) {
      //@ts-ignore
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }
  //return result; //JavaScript object
  return result; //JSON
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const NSE_CapitalMarketSymbols = await axios.get(
    'https://public.fyers.in/sym_details/NSE_CM.csv'
  );
  return res.json(csvToJSON(NSE_CapitalMarketSymbols.data));
}
