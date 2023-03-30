import styles from '../../styles/oauth.module.css';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { useOverlay } from '../../hooks/useOverlay';
import { Client, OauthScopeList } from '../../types/oauth.type';
import { DropdownMenu } from '../common/dropdownMenu';
import { Dispatch, SetStateAction } from 'react';
import { useModal } from '../../hooks/useModal';

interface OauthClientItemProps {
  client: Client,
  scopeInfoList: OauthScopeList,
  getClientList: () => void,
  setSelectClient: Dispatch<SetStateAction<Client | null>>
}

const OauthClientItem = ({
  client,
  scopeInfoList,
  getClientList,
  setSelectClient
}: OauthClientItemProps) => {
  const { ajax } = useAjax();
  const { showToast } = useOverlay();
  const { openModal } = useModal();

  const accessType: {
    [index: string]: string
  } = {
    ALL: '모두',
    STUDENT: '학생만',
    TEACHER: '선생님만',
  }

  const deleteClient = async () => {
    const [, error] = await ajax({
      method: HttpMethod.DELETE,
      url: `/oauth/client/${client.clientId}`
    });
    if (error) return;
    getClientList();
  }

  return (
    <li className={`${styles.client} rows`}>
      <div className={`${styles.top_wrap} left`}>
        <h2 className={`${styles.service_name} bold`}>{client.serviceName}</h2>
        <div className='rows gap-1'>
          <span>허용 대상: {accessType[client.access]}</span>
          <DropdownMenu
            menus={[
              {text: '수정', callback() {
                setSelectClient(client);
                openModal('updateClient');
              }},
              {text: '삭제', callback() {
                if (confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다!')) {
                  deleteClient();
                }
              }}
            ]}
            meatballsMenu
          />
        </div>
      </div>
      <div className='left'>
        <p className='accent-text'>{client.domain}</p>
      </div>
      <details className='left'>
        <div>
          <span className={`${styles.client_id}`}>{client.clientId}</span>
        </div>
        <details className='left'>
          {client.clientSecret}
          <summary>Client Secret</summary>
        </details>
        <summary>자세히 보기</summary>
      </details>
      <details>
        <ul className={styles.uri_list}>{
          client.redirectUriList.map(uri => (
            <li
              key={uri}
              onClick={async () => {
                await navigator.clipboard.writeText(getOauthUri(client.clientId, uri));
                showToast('OAuth 인증 주소가 클립보드에 복사되었습니다');
              }}
              title='OAuth 인증 주소 복사'
            >{uri}</li>
          ))
        }</ul>
        <summary className='left'>리다이렉트 URI</summary>
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

    </li>
  )
}

const getOauthUri = (clientId: string, uri: string) =>
  `https://auth.bssm.kro.kr/oauth?clientId=${clientId}&redirectURI=${uri}`;

export default OauthClientItem;