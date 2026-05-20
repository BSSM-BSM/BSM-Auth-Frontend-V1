'use client';

import styles from '@/styles/user.module.css';
import { useAtom, useSetAtom } from 'jotai';
import { userState } from '@/store/account.store';
import { useEffect, useState, use } from 'react';
import { HttpMethod, useAjax } from '@/hooks/useAjax';
import { headerOptionState, pageState } from '@/store/common.store';
import Image, { StaticImageData } from 'next/image';
import DefaultProfilePic from '@/public/icons/profile_default.png';
import { Student, Teacher } from '@/types/user.type';
import { UserInfoList } from '@/components/user/userInfoList';

interface OtherUserProfilePageProps {
  params: Promise<{
    userId: number
  }>
}

const OtherUserProfilePage = (props: OtherUserProfilePageProps) => {
  const params = use(props.params);
  const { userId } = params;

  const setHeaderOption = useSetAtom(headerOptionState);
  const setPage = useSetAtom(pageState);
  const { ajax } = useAjax();

  const [user] = useAtom(userState);
  const [userInfo, setUserInfo] = useState<null | Student | Teacher>(null);
  const [profileSrc, setProfileSrc] = useState<string | StaticImageData>(DefaultProfilePic);

  useEffect(() => {
    setHeaderOption({ title: '유저 정보', headTitle: '유저 정보 - BSM Auth' });
    setPage({ id: 'user_info', subId: 'other' });
  }, []);

  useEffect(() => {
    loadUserInfo(userId);
  }, [user, userId]);

  const loadUserInfo = async (userId: number) => {
    const [data, error] = await ajax<Student | Teacher>({
      method: HttpMethod.GET,
      url: `user/${userId}`
    });
    if (error) return;

    setUserInfo(data);
    setProfileSrc(`/resource/user/profile/${data.id}.png`);
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