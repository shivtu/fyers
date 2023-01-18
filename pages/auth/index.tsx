import Button from '@mui/material/Button/Button';
import {
  APP_ID,
  FYERS_BASE_API_URI,
  REDIRECT_URI,
} from '../../utils/constants';

export default function Auth() {
  const handleAuth = async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      // Within fyers-api-v2 (index.js file) modify generateAuthCode() to return the authCode instead of only printing it
      // const authCode = await fyers.generateAuthCode();
      const authCode = `${FYERS_BASE_API_URI}generate-authcode?client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&state=sample_state`;
      window.location.href = authCode;
    }
  };

  return (
    <Button variant='outlined' onClick={handleAuth}>
      Authenticate
    </Button>
  );
}
