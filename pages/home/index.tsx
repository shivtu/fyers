import Button from '@mui/material/Button/Button';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import TextField from '@mui/material/TextField/TextField';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  return (
    <>
      <Checkbox />
      <TextField placeholder='textfield' />
      <Button variant='contained'>Button</Button>
    </>
  );
};

export default Home;
