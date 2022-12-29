import { Button } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { IUserProfile } from '../../types/types';

export default function Token() {
  const [profile, setProfile] = useState<IUserProfile>();
  const handleGetProfile = async () => {
    try {
      const profile: {
        data: { data: IUserProfile };
        code: number;
        message?: string;
        s: string;
      } = await axios.get('http://localhost:3000/api/fyers/profile');
      setProfile(profile.data.data);
    } catch (error) {
      console.log('profile error', error);
    }
  };

  return (
    <>
      <Button onClick={handleGetProfile} variant='contained'>
        Profile
      </Button>
      <div>{profile?.email_id}</div>
    </>
  );
}
