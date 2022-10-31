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
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { headerOptionState } from '../../store/common.store';

const Oauth: NextPage = () => {
    const [, setHeaderOption] = useRecoilState(headerOptionState);
    const { ajax } = useAjax();
    const { openModal, closeModal } = useModal();
    const router = useRouter();
    const { clientId, redirectURI } = router.query;
    const [user] = useRecoilState(userState);

    useEffect(() => {
        setHeaderOption({title: 'BSM OAuth'});
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

    const authenticate = () => {
        ajax<ServiceInfo>({
            method: HttpMethod.GET,
            url: `/oauth/authenticate?clientId=${clientId}&redirectURI=${redirectURI}`,
            errorCallback:(data) => {
                if (data && 'statusCode' in data && data.statusCode === 401) {
                    return false;
                }
                openModal('oauthAuthenticateFailed', false);
            },
            callback: data => {
                setServiceInfo(data);
                closeModal('oauthAuthenticateFailed');
                closeModal('oauthAuthorizeFailed');
                if (data.authorized) {
                    openModal('oauth-continue', false);
                    return;
                }
                openModal('oauth', false);
            }
        });
    }
    
    const authorize = () => {
        ajax<{redirectURI: string}>({
            method: HttpMethod.POST,
            url: '/oauth/authorize',
            payload: {
                clientId,
                redirectURI
            },
            errorCallback: (data) => {
                closeModal('oauth');
                if (data && 'statusCode' in data && data.statusCode === 401) {
                    return false;
                }
                openModal('oauthAuthorizeFailed', false);
            },
            callback: (data) => {
                window.location.href = data.redirectURI;
            }
        })
    }

    return (
        <div>
            <Head>
                <title>OAuth 간편로그인 - BSM Auth</title>
            </Head>
            <Modal id='oauth-continue' type='main' title='BSM 계정으로 계속하기'>
                <p>{serviceInfo.domain}</p>
                <p>
                    <span className="accent-text">{serviceInfo.serviceName}</span>
                    <span>에서 인증을 요청합니다.</span>
                </p>
                <br/>
                <button className="button main accent" onClick={() => authorize()}>인증</button>
            </Modal>
            <Modal id='oauth' type='main' title='BSM 계정으로 계속하기'>
                <p>{serviceInfo.domain}</p>
                <p>
                    <span className="accent-text">{serviceInfo.serviceName}</span>
                    <span>에서 다음의 정보들을 요청합니다. 동의하시겠습니까?</span>
                </p>
                <br/>
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
    );
}

export default Oauth;
