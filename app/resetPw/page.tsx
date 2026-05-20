'use client';

import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import Modal from '@/components/common/modal';
import { useModal } from '@/hooks/useModal';
import { HttpMethod, useAjax } from '@/hooks/useAjax';
import { useOverlay } from '@/hooks/useOverlay';
import { useInterval } from '@/hooks/useInterval';
import { useSetAtom } from 'jotai';
import { headerOptionState } from '@/store/common.store';
import { TextInput } from '@/components/common/inputs/textInput';
import { Button } from '@/components/common/buttons/button';

const ResetPwPage = (
  props: {
    searchParams: Promise<{ token?: string }>;
  }
) => {
  const searchParams = use(props.searchParams);
  const { token } = searchParams;

  const router = useRouter();

  const setHeaderOption = useSetAtom(headerOptionState);
  const { ajax } = useAjax();
  const { openModal } = useModal();
  const { showToast } = useOverlay();

  const [newPw, setNewPw] = useState('');
  const [checkNewPw, setCheckNewPw] = useState('');
  const [tokenLeftTime, setTokenLeftTime] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  interface TokenInfo {
    used: boolean,
    expireIn: string
  }
  const [tokenInfo, setTokenInfo] = useState<null | TokenInfo>(null);

  useEffect(() => {
    setHeaderOption({ title: '비밀번호 재설정', headTitle: '비밀번호 재설정 - BSM Auth' });
  }, []);

  useEffect(() => {
    token && getTokenInfo();
  }, [token])

  const getTokenInfo = async () => {
    const [data, error] = await ajax<TokenInfo>({
      method: HttpMethod.GET,
      url: `/auth/pw/token?token=${token}`
    });
    if (error) return;

    setTokenInfo(data);
    openModal({ key: 'resetPw', closeable: false });
  }

  const calcLeftTime = (): number => {
    if (!tokenInfo || tokenInfo.used) return 0;
    const leftTimeMs = new Date(tokenInfo.expireIn).getTime() - new Date().getTime();
    if (leftTimeMs <= 0) {
      setIsExpired(true);
      return 0;
    }

    const leftTimeDate = new Date(leftTimeMs);
    setTokenLeftTime(`${String(leftTimeDate.getMinutes()).padStart(2, '0')}:${String(leftTimeDate.getSeconds()).padStart(2, '0')}`);
    return leftTimeMs;
  }

  useInterval(calcLeftTime, 500);

  const resetPw = async () => {
    const [, error] = await ajax({
      method: HttpMethod.POST,
      url: '/auth/pw/token',
      payload: {
        token,
        newPw,
        checkNewPw
      }
    });
    if (error) return;

    showToast('비밀번호 재설정이 완료되었습니다');
    router.replace('/');
  }

  const modal = (() => {
    if (!tokenInfo) {
      return <></>;
    }
    if (tokenInfo.used) {
      return <Modal type="main" id="resetPw" title="비밀번호 재설정">
        <h3>이미 비밀번호가 재설정 되었습니다.</h3>
      </Modal>;
    }
    if (isExpired) {
      return <Modal type="main" id="resetPw" title="비밀번호 재설정">
        <h3>비밀번호 재설정 시간이 만료되었습니다</h3>
      </Modal>;
    }
    return <Modal type="main" id="resetPw" title="비밀번호 재설정">
        <h3>남은 시간 {tokenLeftTime}</h3>
        <form
          className='cols gap-1'
          autoComplete="off"
          onSubmit={e => {
            e.preventDefault();
            resetPw();
          }}
        >
          <TextInput
            type='password'
            setCallback={setNewPw}
            placeholder='재설정할 비밀번호'
            full
            required
          />
          <TextInput
            type='password'
            setCallback={setCheckNewPw}
            placeholder='재설정할 비밀번호 재입력'
            full
            required
          />
          <Button type="submit" className="accent" full>비밀번호 재설정</Button>
        </form>
      </Modal>;
  })();

  return (
    <>
      <Head>
        <title>비밀번호 재설정 - BSM Auth</title>
      </Head>
      { modal }
    </>
  );
}

export default ResetPwPage;
