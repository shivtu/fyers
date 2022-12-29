import Drawer from '@mui/material/Drawer';
import Link from 'next/link';

export default function NavBar() {
  return (
    <Drawer anchor={'right'} open variant='permanent'>
      <Link href='/home'>Home</Link>
      <Link href='/orders'>Orders</Link>
    </Drawer>
  );
}
