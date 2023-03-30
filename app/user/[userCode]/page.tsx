'use client';

import styles from '../../../styles/user.module.css';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { userState } from '../../../store/account.store';
import { useEffect, useState } from 'react';
import { HttpMethod, useAjax } from '../../../hooks/useAjax';
import { headerOptionState, pageState } from '../../../store/common.store';
import Image, { StaticImageData } from 'next/image';
import DefaultProfilePic from '../../../public/icons/profile_default.png';
import { Student, Teacher } from '../../../types/user.type';
import { UserInfoList } from '../../../components/user/userInfoList';
import { useSearchParams } from 'next/navigation';

const OtherUserProfilePage = () => {
  const setHeaderOption = useSetRecoilState(headerOptionState);
  const setPage = useSetRecoilState(pageState);
  const { ajax } = useAjax();
  const searchParams = useSearchParams();
  const userCode = searchParams.get('userCode');

  const [user] = useRecoilState(userState);
  const [userInfo, setUserInfo] = useState<null | Student | Teacher>(null);
  const [profileSrc, setProfileSrc] = useState<string | StaticImageData>(DefaultProfilePic);

  useEffect(() => {
    setHeaderOption({ title: '유저 정보', headTitle: '유저 정보 - BSM Auth' });
    setPage({ id: 'user_info', subId: 'other' });
  }, []);

  useEffect(() => {
    if (!userCode) return;
    loadUserInfo(Number(userCode));
  }, [user, userCode]);

  const loadUserInfo = async (userCode: number) => {
    const [data, error] = await ajax<Student | Teacher>({
      method: HttpMethod.GET,
      url: `user/${userCode}`
    });
    if (error) return;

    setUserInfo(data);
    setProfileSrc(`https://auth.bssm.kro.kr/resource/user/profile/${data.code}.png`);
  }

  return (
    userInfo &&
    <div className='container _50'>
      <div className={styles.user_profile_wrap}>
        <div className='user-profile'>
          <Image
            src={profileSrc}
            onError={() => setProfileSrc(DefaultProfilePic)}
            width='128'
            height='128'
            alt='user profile'
          />
        </div>
      </div>
      <br /><br />
      <h2 className='bold'>{userInfo.nickname}</h2>
      <ul className='list-wrap left'>
        {userInfo && <UserInfoList userInfo={userInfo} />}
      </ul>
    </div>
  );
}

export default OtherUserProfilePage;