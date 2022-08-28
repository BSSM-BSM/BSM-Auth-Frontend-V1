import { useAjax } from '../../hooks/useAjax';
import styles from '../../styles/oauth.module.css';
import { Client, OauthScopeList } from '../../types/OauthTypes';

export const OauthClientList = (props: {
    client: Client,
    scopeInfoList: OauthScopeList,
    getClientList: Function
}) => {
    const { client, scopeInfoList, getClientList } = props;
    const { ajax } = useAjax();
    const accessType: {
        [index: string]: string
    } = {
        ALL: '모두',
        STUDENT: '학생만',
        TEACHER: '선생님만',
    }

    const deleteClient = () => {
        ajax({
            method: 'delete',
            url: `/oauth/client/${props.client.clientId}`,
            callback: () => getClientList()
        })
    }
    
    return (
        <li className={`${styles.client} rows`}>
            <div className='flex-main'>
                <div className={`${styles.top_wrap} left`}>
                    <h2 className={`${styles.service_name} bold`}>{client.serviceName}</h2>
                    <div className='rows gap-1'>
                        <span className={`${styles.client_id}`}>{client.clientId}</span>
                        <span>허용대상: {accessType[client.access]}</span>
                    </div>
                </div>
                <div className={`${styles.bottom_wrap} left`}>
                    <p className='accent-text'>{client.domain}</p>
                    <p className={styles.service_redirect_uri}>{client.redirectURI}</p>
                </div>
                <details className='left'>
                    {client.clientSecret}
                    <summary>Client Secret</summary>
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