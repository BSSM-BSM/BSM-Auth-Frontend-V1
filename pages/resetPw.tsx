import type { NextPage } from 'next'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Modal from '../components/common/modal';
import { useModal } from '../hooks/useModal';
import { HttpMethod, useAjax } from '../hooks/useAjax';
import { useOverlay } from '../hooks/useOverlay';
import { useInterval } from '../hooks/useInterval';
import { useRecoilState } from 'recoil';
import { headerOptionState } from '../store/common.store';
import { TextInput } from '../components/common/inputs/textInput';
import { Button } from '../components/common/buttons/button';

const ResetPwPage: NextPage = () => {
  const [, setHeaderOption] = useRecoilState(headerOptionState);
  const { ajax } = useAjax();
  const { openModal, closeModal } = useModal();
  const { showAlert, showToast } = useOverlay();
  const router = useRouter();
  const { token } = router.query;
  const [newPw, setNewPw] = useState('');
  const [checkNewPw, setCheckNewPw] = useState('');
  const [leftTime, setLeftTime] = useState('');

  interface TokenInfo {
    used: boolean,
    expireIn: string
  }
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    used: false,
    expireIn: ''
  });

  useEffect(() => {
    setHeaderOption({ title: '비밀번호 재설정' });
  }, []);

  useEffect(() => {
    let flag = false;
    if (tokenInfo.used) {
      flag = true;
      showAlert('이미 사용된 토큰입니다');
    }
    if (calcLeftTime() < 0) {
      flag = true;
      showAlert('토큰이 만료되었습니다');
    }

    if (flag) {
      closeModal('resetPw')
    }
  }, [leftTime]);

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
    openModal('resetPw', false);
  }

  const calcLeftTime = (): number => {
    if (!tokenInfo.expireIn) return 1;
    const leftTime = new Date(
      new Date(tokenInfo.expireIn).getTime() - new Date().getTime()
    );

    setLeftTime(`${String(leftTime.getMinutes()).padStart(2, '0')}:${String(leftTime.getSeconds()).padStart(2, '0')}`);
    return leftTime.getTime();
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
    window.location.href = '/';
  }

  return (
    <>
      <Head>
        <title>비밀번호 재설정 - BSM Auth</title>
      </Head>
      <Modal type="main" id="resetPw" title="비밀번호 재설정">
        <h3>남은 시간 {leftTime}</h3>
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
      </Modal>
    </>
  );
}

export default ResetPwPage;
