'use client';

import styles from '../../../styles/user-search.module.css';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { HttpMethod, useAjax } from '../../../hooks/useAjax';
import { headerOptionState, pageState } from '../../../store/common.store';
import { Student, Teacher } from '../../../types/user.type';
import { TextInput } from '../../../components/common/inputs/textInput';
import { SearchUserInfo } from '../../../components/user/searchUserInfo';

const UserProfilePage = () => {
  const setHeaderOption = useSetRecoilState(headerOptionState);
  const setPage = useSetRecoilState(pageState);
  const { ajax } = useAjax();
  const [searchQuery, setSearchQuery] = useState('');
  const [userList, setUserList] = useState<(Student | Teacher)[]>([]);

  useEffect(() => {
    setHeaderOption({ title: '유저 검색', headTitle: '유저 검색 - BSM Auth' });
    setPage({ id: 'search_user' });
  }, []);

  useEffect(() => {
    searchUsersByNickname();
  }, []);
  
  const searchUsersByNickname = async () => {
    if (!searchQuery) {
      setUserList([]);
      return;
    }
    
    const [data, error] = await ajax<(Student | Teacher)[]>({
      method: HttpMethod.GET,
      url: 'user/nickname',
      config: {
        params: {
          nickname: searchQuery
        }
      }
    });
    if (error) return;

    setUserList(data);
  }


  return (
    <div className='container _70'>
      <form
        className={styles.search_form}
        autoComplete='off'
        onSubmit={e => {
          e.preventDefault();
          searchUsersByNickname();
        }}
      >
        <TextInput
          setCallback={setSearchQuery}
          placeholder='검색할 유저의 닉네임'
          full
        />
      </form>
      <ul className={styles.user_list}>
        {
          userList.length
          ? <>
            <p className={styles.result_msg}>{userList.length} 명 검색 됨</p>
            {userList.map(user => <SearchUserInfo key={user.code} user={user} />)}
          </>
          : <p>해당 닉네임의 유저를 찾을 수 없습니다</p>
        }
      </ul>
    </div>
  );
}

export default UserProfilePage;