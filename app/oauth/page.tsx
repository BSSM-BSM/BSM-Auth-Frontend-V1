'use client';

import styles from '@/styles/oauth.module.css';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import Modal from '@/components/common/modal';
import { userState } from '@/store/account.store';
import { OauthScope } from '@/types/oauth.type';
import { useModal } from '@/hooks/useModal';
import { HttpMethod, useAjax } from '@/hooks/useAjax';
import { headerOptionState, pageState } from '@/store/common.store';
import { Button } from '@/components/common/buttons/button';
import { useOverlay } from '@/hooks/useOverlay';

const Oauth = () => {
  const setHeaderOption = useSetRecoilState(headerOptionState);
  const setPage = useSetRecoilState(pageState);
  const { ajax } = useAjax();
  const { openModal, closeModal } = useModal();
  const { loading } = useOverlay();
  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId');
  const redirectURI = searchParams.get('redirectURI');
  const [user] = useRecoilState(userState);

  useEffect(() => {
    setHeaderOption({ title: 'BSM OAuth', headTitle: 'BSM OAuth - BSM Auth' });
    setPage({ id: 'oauth' })
  }, []);

  useEffect(() => {
    if (clientId) authenticate();
  }, [user, clientId]);

  interface ServiceInfo {
    authorized: boolean,
    domain: string,
    serviceName: string,
    scopeList: OauthScope[]
  }
  const [serviceInfo, setServiceInfo] = useState<ServiceInfo>({
    authorized: false,
    domain: '',
    serviceName: '',
    scopeList: []
  });

  const authenticate = async () => {
    const [data, error] = await ajax<ServiceInfo>({
      method: HttpMethod.GET,
      url: `/oauth/authenticate?clientId=${clientId}&redirectURI=${redirectURI}`,
      errorCallback: (data) => {
        if (!data || !('fields' in data)) {
          return false;
        }
        if (!data.fields?.redirectURI) {
          return false;
        }
        openModal({ key: 'oauthAuthenticateFailed', closeable: false });
      }
    });
    if (error) return;

    setServiceInfo(data);
    closeModal('oauthAuthenticateFailed');
    closeModal('oauthAuthorizeFailed');
    if (data.authorized) {
      openModal({ key: 'oauth-continue', closeable: false });
      return;
    }
    openModal({ key: 'oauth', closeable: false });
  }

  const authorize = async () => {
    const [data, error] = await ajax<{ redirectURI: string }>({
      method: HttpMethod.POST,
      url: '/oauth/authorize',
      payload: {
        clientId,
        redirectURI
      },
      errorCallback: (data) => {
        closeModal('oauth');
        if (!data || !('fields' in data)) {
          return false;
        }
        if (!data.fields?.redirectURI) {
          return false;
        }
        openModal({ key: 'oauthAuthorizeFailed', closeable: false });
      }
    });
    if (error) return;

    window.location.href = data.redirectURI;
    loading(true);
  }

  return (
    <div>
      <Head>
        <title>OAuth 간편로그인 - BSM Auth</title>
      </Head>
      {
        user.isLogin &&
        <Modal id='oauth-continue' type='main' title={`${user.nickname}(으)로 계속`}>
          <div className='cols gap-1'>
            <div>
              <p>{serviceInfo.domain}</p>
              <p>
                <span className="accent-text">{serviceInfo.serviceName}</span>
                <span>에서 인증을 요청합니다.</span>
              </p>
            </div>
            <div className='modal--bottom-menu-box'>
              <span onClick={() => {
                openModal({ key: 'login', closeable: false });
                closeModal('oauth-continue');
              }}>
                다른 계정 사용
              </span>
            </div>
            <Button className="accent" full onClick={() => authorize()}>인증</Button>
          </div>
        </Modal>
      }
      {
        user.isLogin &&
        <Modal id='oauth' type='main' title={`${user.nickname}(으)로 계속`}>
          <p>{serviceInfo.domain}</p>
          <p>
            <span className="accent-text">{serviceInfo.serviceName}</span>
            <span>에서 다음의 정보들을 요청합니다. 동의하시겠습니까?</span>
          </p>
          <br />
          <p>제공되는 정보</p>
          <ul className={styles.scope_list}>{
            serviceInfo.scopeList &&
            serviceInfo.scopeList.map(scope => (
              <li key={scope.id}>
                <details>
                  {scope.description}
                  <summary>{scope.name}</summary>
                </details>
              </li>
            ))
          }</ul>
          <br />
          <p onClick={() => {
            openModal({ key: 'login', closeable: false });
            closeModal('oauth');
          }}>
            다른 계정 사용
          </p>
          <br />
          <Button className="accent" full onClick={() => authorize()}>동의</Button>
        </Modal>
      }
      <Modal id='oauthAuthenticateFailed' title="OAuth 인증에 실패하였습니다">
        <p>정보를 요청하는 클라이언트 서버가 인증에 실패하였습니다</p>
        <p>정말 안전한 인증된 사이트인지 확인해주세요.</p>
        <br />
        <Button className="accent" full onClick={() => authenticate()}>다시 시도</Button>
      </Modal>
      <Modal id='oauthAuthorizeFailed' title="OAuth 인가에 실패하였습니다">
        <p>클라이언트 서버를 인증할 수 없거나 서버 내부에서 문제가 발생하였습니다</p>
        <p>잠시후에 다시 시도해주세요.</p>
        <br />
        <Button className="accent" full onClick={() => authorize()}>다시 시도</Button>
      </Modal>
    </div>
  );
}

export default Oauth;
