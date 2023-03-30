'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { headerOptionState } from '../store/common.store';

const Home = () => {
  const [, setHeaderOption] = useRecoilState(headerOptionState);
  const router = useRouter();

  useEffect(() => {
    setHeaderOption({ title: '' });
    router.replace('/oauth/manage')
  }, []);

  return (<></>);
}

export default Home
