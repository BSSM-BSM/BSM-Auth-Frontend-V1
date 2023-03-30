import styles from '../../styles/oauth.module.css';
import { useState } from "react";
import { Client, OauthScopeList } from "../../types/oauth.type";
import Modal from "../common/modal";
import { useModal } from '../../hooks/useModal';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { TextInput } from '../common/inputs/textInput';
import { Button } from '../common/buttons/button';
import RedirectInputItem from './clientRedirectInputItem';
import { v4 } from 'uuid';

interface ClientMenuPopopProps {
  selectClient: Client | null,
  getClientList: () => void,
  scopeList: OauthScopeList
}

export const ClientMenuPopup = ({
  selectClient,
  getClientList,
  scopeList
}: ClientMenuPopopProps) => (
  <div className="user-popup">
    <CreateClientBox scopeList={scopeList} getClientList={getClientList} />
    {selectClient && <UpdateClientBox selectClient={selectClient} getClientList={getClientList} scopeList={scopeList} />}
  </div>
);

interface CreateClientProps {
  getClientList: () => void,
  scopeList: OauthScopeList
}

const CreateClientBox = ({
  getClientList,
  scopeList
}: CreateClientProps) => {
  const { ajax } = useAjax();
  const { closeModal } = useModal();
  const [domain, setDomain] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [redirectUriList, setRedirectUriList] = useState<{uri: string, key: string}[]>([{uri: '', key: v4()}]);
  const [selectScopeList, setSelectScopeList] = useState<string[]>([]);
  const [access, setAccess] = useState('ALL');

  const createClient = async () => {
    const [, error] = await ajax({
      method: HttpMethod.POST,
      url: '/oauth/client',
      payload: {
        domain,
        serviceName,
        redirectUriList: redirectUriList.map(redirect => redirect.uri),
        scopeList: selectScopeList,
        access
      }
    });
    if (error) return;
    
    getClientList();
    closeModal('createClient');
  }

  const addRedirectUriInput = () => setRedirectUriList(prev => prev.concat([{uri: '', key: v4()}]));

  return (
    <Modal id='createClient' title="클라이언트 생성">
      <form
        autoComplete="off"
        onSubmit={e => {
          e.preventDefault();
          createClient();
        }}
        className='left cols gap-2'
      >
        <div className='cols gap-05'>
          <h3>서비스 도메인</h3>
          <p>서비스중인 도메인 주소 또는 IP 주소를 입력해주세요.</p>
          <TextInput
            setCallback={setDomain}
            placeholder="도메인 또는 IP 주소"
            maxLength={63}
            pattern="^([0-9]{1,3}.){3}[0-9]{1,3}|localhost|([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}?$"
            required
            full
          />
        </div>
        <div className='cols gap-05'>
          <h3>서비스 이름</h3>
          <p>무슨 서비스인지 알기 쉬운 2 - 32 글자의 이름을 적어주세요.</p>
          <TextInput
            setCallback={setServiceName}
            placeholder="서비스 이름"
            minLength={2}
            maxLength={32}
            required
            full
          />
        </div>
        <div className='cols gap-05'>
          <h3>리다이렉트 URI</h3>
          <p>
            사용자가 BSM계정으로 인증된 후 쿼리스트링으로 전달되는 인증코드를 받을 리다이렉트 주소입니다.<br />
            예시: https://domain.com/oauth/bsm, http://127.0.0.1/oauth
          </p>
          <div className={`${styles.redirect_uri_list} scroll-bar no-overlay`}>
            {redirectUriList.map((value, i) => (
              <RedirectInputItem
                key={value.key}
                i={i}
                domain={domain}
                setRedirectUriList={setRedirectUriList}
              />
            ))}
            <Button onClick={addRedirectUriInput} full>리다이렉트 URI 추가</Button>
          </div>
        </div>
        <div className='cols gap-05'>
          <h3>허용 대상</h3>
          <p>해당 설정을 변경하면 선택된 대상만 가입하도록 할 수 있습니다.</p>
          <div className='rows gap-1'>{
            [{
              name: '모두',
              value: 'ALL'
            },
            {
              name: '학생만',
              value: 'STUDENT'
            },
            {
              name: '선생님만',
              value: 'TEACHER'
            }].map(accessType => (
              <label key={accessType.value} className='checkbox'>
                {accessType.name}
                <input
                  type="radio"
                  value={accessType.value}
                  checked={access === accessType.value}
                  onChange={(event) => setAccess(event.target.value)}
                />
              </label>
            ))
          }</div>
        </div>
        <div>
          <h3>사용할 정보</h3>
          <ul className={`${styles.scope_list} left`}>{
            scopeList.map(scope => (
              <li key={scope.id}>
                <details>
                  {scope.description}
                  <summary>
                    <label className='checkbox'>
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
        </div>
        <Button type="submit" className="accent" full>생성</Button>
      </form>
    </Modal>
  );
}

interface UpdateClientProps {
  selectClient: Client,
  getClientList: () => void,
  scopeList: OauthScopeList
}

const UpdateClientBox = ({
  selectClient,
  getClientList,
  scopeList
}: UpdateClientProps) => {
  const { ajax } = useAjax();
  const { closeModal } = useModal();
  const { clientId } = selectClient;
  const [domain, setDomain] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [redirectUriList, setRedirectUriList] = useState<{uri: string, key: string}[]>([]);
  const [selectScopeList, setSelectScopeList] = useState<string[]>([]);
  const [access, setAccess] = useState('ALL');

  const initClientInfo = () => {
    setDomain(selectClient.domain);
    setServiceName(selectClient.serviceName);
    setAccess(selectClient.access);
    setSelectScopeList(selectClient.scopeList);
    setRedirectUriList(() => 
      selectClient.redirectUriList.map(uri => (
        {uri, key: v4()}
      ))
    );
  }
  
  const clearClientInfo = () => {
    setDomain('');
    setServiceName('');
    setAccess('ALL');
    setSelectScopeList([]);
    setRedirectUriList([]);
  }

  const createClient = async () => {
    const [, error] = await ajax({
      method: HttpMethod.PUT,
      url: `/oauth/client/${clientId}`,
      payload: {
        domain,
        serviceName,
        redirectUriList: redirectUriList.map(redirect => redirect.uri),
        scopeList: selectScopeList,
        access
      }
    });
    if (error) return;
    
    getClientList();
    closeModal('updateClient');
  }

  const addRedirectUriInput = () => setRedirectUriList(prev => prev.concat([{uri: '', key: v4()}]));

  return (
    <Modal
      id='updateClient'
      title="클라이언트 수정"
      onOpen={initClientInfo}
      onClose={clearClientInfo}
    >
      <form
        autoComplete="off"
        onSubmit={e => {
          e.preventDefault();
          createClient();
        }}
        className='left cols gap-2'
      >
        <div className='cols gap-05'>
          <h3>서비스 도메인</h3>
          <p>서비스중인 도메인 주소 또는 IP 주소를 입력해주세요.</p>
          <TextInput
            value={domain}
            setCallback={setDomain}
            placeholder="도메인 또는 IP 주소"
            maxLength={63}
            pattern="^([0-9]{1,3}.){3}[0-9]{1,3}|localhost|([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}?$"
            required
            full
          />
        </div>
        <div className='cols gap-05'>
          <h3>서비스 이름</h3>
          <p>무슨 서비스인지 알기 쉬운 2 - 32 글자의 이름을 적어주세요.</p>
          <TextInput
            value={serviceName}
            setCallback={setServiceName}
            placeholder="서비스 이름"
            minLength={2}
            maxLength={32}
            required
            full
          />
        </div>
        <div className='cols gap-05'>
          <h3>리다이렉트 URI</h3>
          <p>
            사용자가 BSM계정으로 인증된 후 쿼리스트링으로 전달되는 인증코드를 받을 리다이렉트 주소입니다.<br />
            예시: https://domain.com/oauth/bsm, http://127.0.0.1/oauth
          </p>
          <div className={`${styles.redirect_uri_list} scroll-bar`}>
            {redirectUriList.map((value, i) => (
              <RedirectInputItem
                key={value.key}
                i={i}
                value={value.uri}
                domain={domain}
                setRedirectUriList={setRedirectUriList}
              />
            ))}
            <Button onClick={addRedirectUriInput} full>리다이렉트 URI 추가</Button>
          </div>
        </div>
        <div className='cols gap-05'>
          <h3>허용 대상</h3>
          <p>해당 설정을 변경하면 선택된 대상만 가입하도록 할 수 있습니다.</p>
          <div className='rows gap-1'>{
            [{
              name: '모두',
              value: 'ALL'
            },
            {
              name: '학생만',
              value: 'STUDENT'
            },
            {
              name: '선생님만',
              value: 'TEACHER'
            }].map(accessType => (
              <label key={accessType.value} className='checkbox'>
                {accessType.name}
                <input
                  type="radio"
                  value={accessType.value}
                  checked={access === accessType.value}
                  onChange={(event) => setAccess(event.target.value)}
                />
              </label>
            ))
          }</div>
        </div>
        <div>
          <h3>사용할 정보</h3>
          <ul className={`${styles.scope_list} left`}>{
            scopeList.map(scope => (
              <li key={`${clientId}-${scope.id}`}>
                <details>
                  {scope.description}
                  <summary>
                    <label className='checkbox'>
                      {scope.name}
                      <input
                        type="checkbox"
                        checked={selectScopeList.includes(scope.id)}
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
        </div>
        <Button type="submit" className="accent" full>수정</Button>
      </form>
    </Modal>
  );
}