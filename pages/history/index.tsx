import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack/Stack';
import TextField from '@mui/material/TextField/TextField';
import { useState } from 'react';
import { IHistoryParams } from '../../types/types';

const History = () => {
  const [history, setHistory] = useState();
  const [historyParams, setHistoryParams] = useState<IHistoryParams>({
    symbol: '',
    rangeFrom: '',
    rangeTo: '',
    resolution: '',
  });
  const getHistory = () => {};

  return (
    <Stack spacing={2}>
      <TextField
        size='small'
        placeholder='Symbol... ex: NSE:CANBK-EQ'
        onChange={(e) =>
          setHistoryParams({ ...historyParams, ...{ symbol: e.target.value } })
        }
      />
      <TextField
        size='small'
        placeholder='Date range (From)... ex: 2022-11-23'
      />
      <TextField size='small' placeholder='Date range (To)... ex: 2022-12-23' />
      <TextField size='small' placeholder='Set timeframe... ex: 1D' />
      <Button size='small' onClick={getHistory} variant='contained'>
        Get history
      </Button>
    </Stack>
  );
};

export default History;
