import Autocomplete, {
  AutocompleteRenderInputParams,
} from '@mui/material/Autocomplete/Autocomplete';
import TextField from '@mui/material/TextField/TextField';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { IStock } from '../../types/types';
import { csvToJSON, removeDuplicatesFromJSONArray } from '../../utils/utils';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks';
import { setStock } from '../../redux/slices/selected-stock/selectedStockSlice';

const StockList = () => {
  const { selectedStock } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const [stocks, setStocks] = useState<IStock[]>([]);

  useEffect(() => {
    const getSymbols = async () => {
      const res = await axios.get(
        'https://public.fyers.in/sym_details/NSE_CM.csv'
      );
      const data = res.data;
      const jsonData = csvToJSON(data);

      const uniqueList = removeDuplicatesFromJSONArray(jsonData);

      setStocks(
        uniqueList.map((v) => ({
          name: v['Symbol Details'],
          segment: v['Segment'],
          symbol: v['Symbol ticker'],
        }))
      );
    };

    getSymbols();
  }, []);

  if (!stocks.length) return <>loading symbols...</>;

  return (
    <Autocomplete
      size='small'
      value={selectedStock}
      options={stocks}
      getOptionLabel={(option) => option.name || ''}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField {...params} label='NSE Symbols' />
      )}
      onChange={(event: any, newValue: IStock | null) => {
        if (newValue) dispatch(setStock(newValue));
      }}
    />
  );
};

export default StockList;
