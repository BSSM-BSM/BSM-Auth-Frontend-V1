'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { headerOptionState } from '@/store/common.store';
import { useSetAtom } from 'jotai';

const Home = () => {
  const setHeaderOption = useSetAtom(headerOptionState);
  const router = useRouter();

  useEffect(() => {
    setHeaderOption({ title: '' });
    router.replace('/oauth/manage')
  }, []);

  return (<></>);
}

export default Home
