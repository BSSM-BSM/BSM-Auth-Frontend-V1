import styles from '../../styles/oauth.module.css';
import { useState } from "react";
import { OauthScopeList } from "../../types/OauthTypes";
import { ajax } from "../../utils/ajax";
import Modal from "../common/Modal";
import { useModal } from '../../hook/useModal';

interface ClientMenuPopopProps {
    getClientList: () => void,
    scopeList: OauthScopeList
}

export const ClientMenuPopup = (props: ClientMenuPopopProps) => {

    return (
        <div className="user-popup">
            <CreateClientBox scopeList={props.scopeList} getClientList={props.getClientList} />
        </div>
    );
}

interface CreateClientProps {
    getClientList: () => void,
    scopeList: OauthScopeList
}

const CreateClientBox = (props: CreateClientProps) => {
    const { closeModal } = useModal();
    const { getClientList, scopeList: scopeInfoList } = props;
    const [domain, setDomain] = useState('');
    const [redirectURI, setRedirectURI] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [selectScopeList, setSelectScopeList] = useState<string[]>([]);

    const createClient = () => {
        ajax<{accessToken: string}>({
            method: 'post',
            url: '/oauth/client',
            payload: {
                domain,
                redirectURI,
                serviceName,
                scopeList: selectScopeList
            },
            callback: () => {
                getClientList();
                closeModal('createClient');
            }
        });
    }

    return (
        <Modal id='createClient' title="클라이언트 생성">
            <form
                autoComplete="off"
                onSubmit={e => {
                    e.preventDefault();
                    createClient();
                }}
                className='left'
            >
                <h3>도메인 주소</h3>
                <p>
                    도메인 주소 또는 IP 주소를 입력해주세요.<br />
                    개발환경에서 테스트하기 위해 IP 주소가 사용될 수 있지만 실제 서비스 환경에서는 도메인을 권장합니다.<br />
                    예시: domain.com, 127.0.0.1, localhost
                </p>
                <input
                    type="text"
                    className="input-text"
                    placeholder="도메인 또는 IP 주소" 
                    maxLength={63}
                    pattern="^([0-9]{1,3}.){3}[0-9]{1,3}|localhost|([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}?$"
                    required
                    onChange={e => {
                        e.preventDefault();
                        setDomain(e.target.value);
                    }}
                />
                <h3>서비스 이름</h3>
                <p>무슨 서비스인지 알기 쉬운 2 - 32 글자의 이름을 적어주세요.</p>
                <input
                    type="text"
                    className="input-text"
                    placeholder="서비스 이름"
                    minLength={2}
                    maxLength={32}
                    required
                    onChange={e => {
                        e.preventDefault();
                        setServiceName(e.target.value);
                    }}
                />
                <h3>콜백 URI</h3>
                <p>
                    사용자가 BSM계정으로 인증된 후 전달되는 인증코드를 받을 리다이렉트 주소입니다.<br />
                    이 주소는 개발환경에서 테스트하기 위해 IP 주소가 사용될 수 있지만 실제 서비스 환경에서는 도메인을 권장합니다.<br />
                    예시: https://domain.com/signup/bsm, http://127.0.0.1/afterlogin, http://localhost/oauth/bsm
                </p>
                <input
                    type="text"
                    className="input-text"
                    placeholder="콜백 URI"
                    maxLength={100}
                    pattern={`(https?://)(${domain})(:(6[0-5]{2}[0-3][0-5]|[1-5][0-9]{4}|[1-9][0-9]{0,3}))?/.*`}
                    required
                    onChange={e => {
                        e.preventDefault();
                        setRedirectURI(e.target.value);
                    }}
                />
                <h3>사용할 정보</h3>
                <ul className={`${styles.scope_list} left`}>{
                    scopeInfoList.map(scope => (
                        <li key={scope.id}>
                            <details>
                                {scope.description}
                                <summary>
                                    <label>
                                        {scope.name}
                                        <input
                                            type="checkbox"
                                            onChange={(event) => {
                                                if (event.target.checked) {
                                                    setSelectScopeList(prev => [...prev, scope.id]);
                                                } else {
                                                    setSelectScopeList(prev => prev.filter(prevScope => prevScope != scope.id));
                                                }
                                            }}
                                        />
                                    </label>
                                </summary>
                            </details>
                        </li>
                    ))
                }</ul>
                <button type="submit" className="button main accent">비밀번호 재설정</button>
            </form>
        </Modal>
    );
}