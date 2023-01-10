import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { headerOptionState } from '../store/common.store';

const Home: NextPage = () => {
  const [, setHeaderOption] = useRecoilState(headerOptionState);
  const router = useRouter();

  useEffect(() => {
    setHeaderOption({ title: '' });
    router.replace('/oauth/manage')
  }, []);

  return (<></>)
}

export default Home
