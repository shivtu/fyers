import axios from 'axios';
import { IFyersBracketOrder } from '../types/types';

const urls = {
  baseUrl: 'http://localhost:3000/api/fyers',
  orders: 'orders',
};

export const fyersBracketOrder = async (
  bracketOrderParams: IFyersBracketOrder
) => await axios.post(`${urls.baseUrl}/${urls.orders}`, bracketOrderParams);
