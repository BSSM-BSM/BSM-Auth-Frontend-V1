import styles from '../../styles/oauth.module.css';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Client, OauthScopeList } from '../../types/OauthTypes';
import { ClientMenuPopup } from '../../components/oauth/clientMenuPopup';
import { useModal } from '../../hooks/useModal';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { useRecoilState } from 'recoil';
import { userState } from '../../store/account.store';
import { headerOptionState } from '../../store/common.store';
import { Button } from '../../components/common/buttons/button';
import OauthClientItem from '../../components/oauth/clientItem';

const OauthManagePage: NextPage = () => {
  const [, setHeaderOption] = useRecoilState(headerOptionState);
  const { ajax } = useAjax();
  const { openModal } = useModal();
  const [user] = useRecoilState(userState);

  useEffect(() => {
    setHeaderOption({
      title: 'OAuth 클라이언트'
    });
  }, []);

  useEffect(() => {
    getClientList();
    getScopeInfoList();
  }, [user]);

  const [clientList, setClientList] = useState<Client[]>([]);
  const [scopeInfoList, setScopeInfoList] = useState<OauthScopeList>([]);

  const getClientList = async () => {
    const [data, error] = await ajax<Client[]>({
      method: HttpMethod.GET,
      url: '/oauth/client'
    });
    if (error) return;
    setClientList(data);
  }

  const getScopeInfoList = async () => {
    const [data, error] = await ajax<OauthScopeList>({
      method: HttpMethod.GET,
      url: '/oauth/scopes'
    });
    if (error) return;
    setScopeInfoList(data);
  }

  return (
    <div className='container _100'>
      <Head>
        <title>OAuth 클라이언트 - BSM Auth</title>
      </Head>
      <ClientMenuPopup getClientList={getClientList} scopeList={scopeInfoList} />
      <div className={styles.client_manage}>
        <ul className={styles.client_list}>
          {!clientList.length && <p>클라이언트가 없습니다, 여기를 눌러 생성하세요</p>}
          <Button onClick={() => openModal('createClient')}>클라이언트 추가</Button>
          {
            clientList.length &&
            clientList.map(client => (
              <OauthClientItem
                key={client.clientId}
                client={client}
                scopeInfoList={scopeInfoList}
                getClientList={getClientList}
              />
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export default OauthManagePage;