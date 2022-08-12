import styles from '../../styles/oauth.module.css';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { OauthClientList } from '../../components/oauth/clientList';
import { showLoginBoxState } from '../../store/account.store';
import { ajax } from '../../utils/ajax';
import { Client, OauthScopeList } from '../../types/OauthTypes';
import { ClientMenuPopup } from '../../components/oauth/clientMenuPopup';

const OauthManagePage: NextPage = () => {
    const [, setShowLoginBox] = useRecoilState(showLoginBoxState);
    const [showCreateClientBox, setShowCreateClientBox] = useState(false);

    useEffect(() => {
        getClientList();
        getScopeInfoList();
    }, []);

    const [clientList, setClientList] = useState<Client[]>([]);
    const [scopeInfoList, setScopeInfoList] = useState<OauthScopeList>([]);

    const getClientList = () => {
        ajax<Client[]>({
            setShowLoginBox,
            method: 'get',
            url: '/oauth/client',
            callback: data => {
                setClientList(data);
            }
        })
    }
    
    const getScopeInfoList = () => {
        ajax<OauthScopeList>({
            setShowLoginBox,
            method: 'get',
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
            <ClientMenuPopup showCreateBox={showCreateClientBox} setShowCreateBox={setShowCreateClientBox} getClientList={getClientList} scopeList={scopeInfoList} />
            <div className={styles.client_manage}>
                <h1 className='title'>OAuth 클라이언트</h1>
                <div className={`${styles.oauth_menu} rows space-between`}>
                    <button className='button accent' onClick={() => setShowCreateClientBox(true)}>추가</button>
                    <button className='button' onClick={getClientList}>새로 고침</button>
                </div>
                <ul className={styles.client_list}>{
                    !clientList.length?
                    <p>클라이언트가 없습니다, 상단 추가 버튼을 눌러 추가하세요</p>
                    :clientList.map(client => (
                        <OauthClientList client={client} key={client.clientId} scopeInfoList={scopeInfoList} />
                    ))
                }</ul>
            </div>
        </div>
    )
}

export default OauthManagePage;