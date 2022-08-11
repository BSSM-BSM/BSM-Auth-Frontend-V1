import styles from '../../styles/oauth.module.css';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { OauthClientList } from '../../components/oauth/clientList';
import { showLoginBoxState } from '../../store/account.store';
import { ajax } from '../../utils/ajax';

const OauthManagePage: NextPage = () => {
    const [, setShowLoginBox] = useRecoilState(showLoginBoxState);

    useEffect(() => {
        getClientList();
    }, []);

    interface Client {
        clientId: string,
        clientSecret: string,
        domain: string,
        serviceName: string,
        redirectURI: string,
        scopeList: string[]
    }

    const [clientList, setClientList] = useState<Client[]>([]);

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

    return (
        <div className='container _100'>
            <Head>
                <title>OAuth 클라이언트 - BSM Auth</title>
            </Head>
            <div className={styles.client_manage}>
                <h1 className='title'>OAuth 클라이언트</h1>
                <div className={`${styles.oauth_menu} rows space-between`}>
                    <button className='button accent'>추가</button>
                    <button className='button'>새로 고침</button>
                </div>
                <ul className={styles.client_list}>{
                    !clientList.length?
                    <p>클라이언트가 없습니다, 상단 추가 버튼을 눌러 추가하세요</p>
                    :clientList.map(client => (
                        <OauthClientList client={client} />
                    ))
                }</ul>
            </div>
        </div>
    )
}

export default OauthManagePage;