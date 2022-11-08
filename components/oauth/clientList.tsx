import styles from '../../styles/oauth.module.css';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { useOverlay } from '../../hooks/useOverlay';
import { Client, OauthScopeList } from '../../types/OauthTypes';

export const OauthClientList = (props: {
    client: Client,
    scopeInfoList: OauthScopeList,
    getClientList: Function
}) => {
    const {client, scopeInfoList, getClientList} = props;
    const {ajax} = useAjax();
    const {showToast} = useOverlay();
    const accessType: {
        [index: string]: string
    } = {
        ALL: '모두',
        STUDENT: '학생만',
        TEACHER: '선생님만',
    }

    const deleteClient = () => {
        ajax({
            method: HttpMethod.DELETE,
            url: `/oauth/client/${props.client.clientId}`,
            callback: () => getClientList()
        })
    }

    const oauthUri = `https://auth.bssm.kro.kr/oauth?clientId=${client.clientId}&redirectURI=${client.redirectURI}`;
    
    return (
        <li className={`${styles.client} rows`}>
            <div className='flex-main'>
                <div className={`${styles.top_wrap} left`}>
                    <h2 className={`${styles.service_name} bold`}>{client.serviceName}</h2>
                    <div className='rows gap-1'>
                        <span
                            className={styles.auth_url}
                            onClick={async () => {
                                await navigator.clipboard.writeText(oauthUri);
                                showToast('OAuth 인증 주소가 클립보드에 복사되었습니다');
                            }}
                        >
                            OAuth 주소 복사
                        </span>
                        <span>허용 대상: {accessType[client.access]}</span>
                    </div>
                </div>
                <div className='left'>
                    <p className='accent-text'>{client.domain}</p>
                </div>
                <details className='left'>
                    <div>
                        <span className={`${styles.client_id}`}>{client.clientId}</span>
                        <p className={styles.service_redirect_uri}>{client.redirectURI}</p>
                    </div>
                    <details className='left'>
                        {client.clientSecret}
                        <summary>Client Secret</summary>
                    </details>
                    <summary>자세히 보기</summary>
                </details>
                <details>
                    <ul className={`${styles.scope_list} ${styles._25} left`}>{
                        scopeInfoList.filter(scopeInfo => client.scopeList.some(scope => scope === scopeInfo.id))
                            .map(scope => (
                                <li key={scope.id}>
                                    <details>
                                        {scope.description}
                                        <summary>{scope.name}</summary>
                                    </details>
                                </li>
                            ))
                    }</ul>
                    <summary>제공되는 정보</summary>
                </details>
            </div>
            <div className='left-slide-menu'>
                <span className='menu-button'>
                    <span className='line'></span>
                    <span className='line'></span>
                    <span className='line'></span>
                </span>
                <ul className='menu-list'>
                    <li>
                        <button
                            className='button delete'
                            onClick={() => {
                                if (confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다!')) {
                                    deleteClient();
                                }
                            }}
                        >
                            삭제
                        </button>
                    </li>
                </ul>
            </div>
        </li>
    )
}