import styles from '../../styles/oauth.module.css';
import type { NextPage } from 'next'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import Modal from '../../components/common/modal';
import { userState } from '../../store/account.store';
import { OauthScope } from '../../types/OauthTypes';
import { useModal } from '../../hooks/useModal';
import { useAjax } from '../../hooks/useAjax';

const Oauth: NextPage = () => {
    const { ajax } = useAjax();
    const { openModal, closeModal } = useModal();
    const router = useRouter();
    const { clientId, redirectURI } = router.query;
    const [user] = useRecoilState(userState);

    useEffect(() => {
        if (!user.isLogin) {
            openModal('login');
        }
    }, []);
    
    useEffect(() => {
        if (user.isLogin) authenticate();
    }, [user]);

    interface ServiceInfo {
        authorized: boolean,
        domain: string,
        name: string,
        scopeList: OauthScope[]
    }
    const [serviceInfo, setServiceInfo] = useState<ServiceInfo>({
        authorized: false,
        domain: '',
        name: '',
        scopeList: []
    });

    const authenticate = () => {
        ajax<ServiceInfo>({
            method: 'get',
            url: `/oauth/authenticate?clientId=${clientId}&redirectURI=${redirectURI}`,
            errorCallback:() => {
                openModal('oauthAuthenticateFailed');
            },
            callback: data => {
                if (data.authorized) {
                    return authorize();
                }
                setServiceInfo(data);
                openModal('oauth');
                closeModal('oauthAuthenticateFailed');
                closeModal('oauthAuthorizeFailed');
            }
        })
    }
    
    const authorize = () => {
        ajax({
            method: 'post',
            url: '/oauth/authorize',
            payload: {
                clientId,
                redirectURI
            },
            errorCallback: () => {
                closeModal('oauth');
                openModal('oauthAuthorizeFailed');
            },
            callback: (data: any) => {
                window.location = data.redirectURI;
            }
        })
    }

    const oauthModalTitle = (
        <>
            <img src="/logo/logo.png" alt="logo" className="logo" />
            <br />
            <span>BSM 계정으로 계속하기</span>
        </>
    );

    return (
        <div>
            <Head>
                <title>OAuth 간편로그인 - BSM Auth</title>
            </Head>
            <Modal id='oauth' title={oauthModalTitle}>
                <p>{serviceInfo.domain}</p>
                <p>
                    <span className="accent-text">{serviceInfo.name}</span>
                    <span>에서 다음의 정보들을 요청합니다. 동의하시겠습니까?</span>
                </p>
                <br/>
                <p>제공되는 정보</p>
                <ul className={styles.scope_list}>{
                    serviceInfo.scopeList.map(scope => (
                        <li key={scope.id}>
                            <details>
                                {scope.description}
                                <summary>{scope.name}</summary>
                            </details>
                        </li>
                    ))
                }</ul>
                <br/>
                <button className="button main accent" onClick={() => authorize()}>동의</button>
            </Modal>
            <Modal id='oauthAuthenticateFailed' title="OAuth 인증에 실패하였습니다">
                <p>정보를 요청하는 클라이언트 서버가 인증에 실패하였습니다</p>
                <p>정말 안전한 인증된 사이트인지 확인해주세요.</p>
                <button className="button main accent" onClick={() => authenticate()}>다시 시도</button>
            </Modal>
            <Modal id='oauthAuthorizeFailed' title="OAuth 인가에 실패하였습니다">
                <p>클라이언트 서버를 인증할 수 없거나 서버 내부에서 문제가 발생하였습니다</p>
                <p>잠시후에 다시 시도해주세요.</p>
                <button className="button main accent" onClick={() => authorize()}>다시 시도</button>
            </Modal>
        </div>
    )
}

export default Oauth
