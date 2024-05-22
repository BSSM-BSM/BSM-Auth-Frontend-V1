'use client';

import { NextPage } from 'next';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { useEffect } from 'react';
import { headerOptionState } from '@/store/common.store';
import { useModal } from '@/hooks/useModal';
import { HttpMethod, useAjax } from '@/hooks/useAjax';
import { userState } from '@/store/account.store';
import Modal from '@/components/common/modal';
import { Button } from '@/components/common/buttons/button';

const UserProfilePage: NextPage = () => {
  const setHeaderOption = useSetRecoilState(headerOptionState);
  const { ajax } = useAjax();
  const { openModal, closeModal } = useModal();
  const user = useRecoilValue(userState);
  const resetUser = useResetRecoilState(userState);

  useEffect(() => {
    setHeaderOption({ title: '로그아웃', headTitle: '로그아웃 - BSM Auth' });
  }, []);

  useEffect(() => {
    if (!user.isLogin) return;
    openModal({ key: 'logout', closeable: false });
  }, [user]);

  const logout = async () => {
    const [, error] = await ajax({
      method: HttpMethod.DELETE,
      url: 'auth/logout',
    });
    if (error) return;

    resetUser();
    closeModal('logout');
    openModal({ key: 'logout_success', closeable: false });
    setTimeout(() => {
      window.close();
    }, 3000);
  }

  return (<>
    <Modal type="main" id="logout" title="BSM Auth 로그아웃">
      <p>정말 BSM Auth에서 로그아웃 하시겠습니까?</p>
      <form
        onSubmit={e => {
          e.preventDefault();
          logout();
        }}
      >
        <Button type="submit" className="delete" full>로그아웃</Button>
      </form>
    </Modal>
    <Modal type="main" id="logout_success">
      <p>로그아웃 되었습니다</p>
      <p>잠시 후 자동으로 탭이 닫힙니다</p>
    </Modal>
  </>);
}

export default UserProfilePage;