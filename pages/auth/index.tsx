import { Button } from '@mui/material';
import fyers from 'fyers-api-v2';

export default function Auth() {
  const handleAuth = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      fyers.setAppId('9DQFIB120O-100');
      fyers.setRedirectUrl('http://localhost:3000/api/fyers/auth');

      const authCode = await fyers.generateAuthCode();
      window.location.href = authCode;
    }
  };

  return <Button onClick={handleAuth}>Authenticate</Button>;
}
