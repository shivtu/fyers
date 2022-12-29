import axios from 'axios';
import { IFyersBracketSellOrder } from '../types/types';

const urls = {
  baseUrl: 'http://localhost:3000/api/fyers',
  boSell: 'orders/sell',
};

export const fyersBracketSellOrder = async (
  bracketSellOrderParams: IFyersBracketSellOrder
) => await axios.post(`${urls.baseUrl}/${urls.boSell}`, bracketSellOrderParams);
