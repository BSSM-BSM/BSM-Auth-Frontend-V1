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
import { Button } from '../../components/common/buttons/button';

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
                <title>OAuth ??????????????? - BSM Auth</title>
            </Head>
            {
                user.isLogin &&
                <Modal id='oauth-continue' type='main' title={`${user.nickname}(???)??? ??????`}>
                    <p>{serviceInfo.domain}</p>
                    <p>
                        <span className="accent-text">{serviceInfo.serviceName}</span>
                        <span>?????? ????????? ???????????????.</span>
                    </p>
                    <br />
                    <p onClick={() => {
                        openModal('login', false);
                        closeModal('oauth-continue');
                    }}>
                        ?????? ?????? ??????
                    </p>
                    <br/>
                    <Button className="accent" full onClick={() => authorize()}>??????</Button>
                </Modal>
            }
            {
                user.isLogin &&
                <Modal id='oauth' type='main' title={`${user.nickname}(???)??? ??????`}>
                    <p>{serviceInfo.domain}</p>
                    <p>
                        <span className="accent-text">{serviceInfo.serviceName}</span>
                        <span>?????? ????????? ???????????? ???????????????. ?????????????????????????</span>
                    </p>
                    <br/>
                    <p>???????????? ??????</p>
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
                        openModal('login', false);
                        closeModal('oauth');
                    }}>
                        ?????? ?????? ??????
                    </p>
                    <br/>
                    <Button className="accent" full onClick={() => authorize()}>??????</Button>
                </Modal>
            }
            <Modal id='oauthAuthenticateFailed' title="OAuth ????????? ?????????????????????">
                <p>????????? ???????????? ??????????????? ????????? ????????? ?????????????????????</p>
                <p>?????? ????????? ????????? ??????????????? ??????????????????.</p>
                <Button className="accent" full onClick={() => authenticate()}>?????? ??????</Button>
            </Modal>
            <Modal id='oauthAuthorizeFailed' title="OAuth ????????? ?????????????????????">
                <p>??????????????? ????????? ????????? ??? ????????? ?????? ???????????? ????????? ?????????????????????</p>
                <p>???????????? ?????? ??????????????????.</p>
                <Button className="accent" full onClick={() => authorize()}>?????? ??????</Button>
            </Modal>
        </div>
    );
}

export default Oauth;
