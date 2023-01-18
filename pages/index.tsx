import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ROUTES } from '../utils/constants';

export default function Home({ data }: any) {
  const router = useRouter();
  useEffect(() => {
    router.push(ROUTES.HOME);
  }, []);
  return <div>{data}</div>;
}
