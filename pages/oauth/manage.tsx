import styles from '../../styles/oauth.module.css';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { OauthClientList } from '../../components/oauth/clientList';
import { Client, OauthScopeList } from '../../types/OauthTypes';
import { ClientMenuPopup } from '../../components/oauth/clientMenuPopup';
import { useModal } from '../../hooks/useModal';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { useRecoilState } from 'recoil';
import { userState } from '../../store/account.store';
import { titleState } from '../../store/common.store';

const OauthManagePage: NextPage = () => {
    const [, setTitle] = useRecoilState(titleState);
    const { ajax } = useAjax();
    const { openModal } = useModal();
    const [user] = useRecoilState(userState);

    useEffect(() => {
        setTitle('OAuth 클라이언트');
    }, []);

    useEffect(() => {
        getClientList();
        getScopeInfoList();
    }, [user]);

    const [clientList, setClientList] = useState<Client[]>([]);
    const [scopeInfoList, setScopeInfoList] = useState<OauthScopeList>([]);

    const getClientList = () => {
        ajax<Client[]>({
            method: HttpMethod.GET,
            url: '/oauth/client',
            callback: data => {
                setClientList(data);
            }
        })
    }
    
    const getScopeInfoList = () => {
        ajax<OauthScopeList>({
            method: HttpMethod.GET,
            url: '/oauth/scopes',
            callback: data => {
                setScopeInfoList(data);
            }
        })
    }

    return (
        <div className='container _100'>
            <Head>
                <title>OAuth 클라이언트 - BSM Auth</title>
            </Head>
            <ClientMenuPopup getClientList={getClientList} scopeList={scopeInfoList} />
            <div className={styles.client_manage}>
                <div className={`${styles.oauth_menu} rows space-between`}>
                    <button className='button accent' onClick={() => openModal('createClient')}>추가</button>
                    <button className='button' onClick={getClientList}>새로 고침</button>
                </div>
                <ul className={styles.client_list}>{
                    !clientList.length?
                    <p>클라이언트가 없습니다, 상단 추가 버튼을 눌러 추가하세요</p>
                    :clientList.map(client => (
                        <OauthClientList
                            key={client.clientId}
                            client={client}
                            scopeInfoList={scopeInfoList}
                            getClientList={getClientList}
                        />
                    ))
                }</ul>
            </div>
        </div>
    )
}

export default OauthManagePage;