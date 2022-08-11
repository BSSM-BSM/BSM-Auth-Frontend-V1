import styles from '../../styles/oauth.module.css';

interface Client {
    clientId: string,
    clientSecret: string,
    domain: string,
    serviceName: string,
    redirectURI: string,
    scopeList: string[]
}

export const OauthClientList = (props: {client: Client}) => {
    const { client } = props;
    
    return (
        <li className={`${styles.client} rows`} key={client.clientId}>
            <div className='flex-main'>
                <div className={`${styles.top_wrap} left`}>
                    <h2 className={`${styles.service_name} bold`}>{client.serviceName}</h2>
                    <p className={`${styles.client_id}`}>{client.clientId}</p>
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
                    <ul className={`${styles.scope_list} left`}>{
                        client.scopeList.map(scope => (
                            <li key={scope}>
                                <details>
                                    {scope}
                                    <summary>{scope}</summary>
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
                        <button className='button delete'>삭제</button>
                    </li>
                </ul>
            </div>
        </li>
    )
}