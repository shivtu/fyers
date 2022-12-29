import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home({ data }: any) {
  const router = useRouter();
  useEffect(() => {
    router.push('/home');
  }, []);
  return <div>{data}</div>;
}
