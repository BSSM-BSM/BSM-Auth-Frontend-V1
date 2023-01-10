import styles from '../../styles/user.module.css';
import { NextPage } from 'next';
import { useRecoilState } from 'recoil';
import { userState } from '../../store/account.store';
import { useEffect, useState } from 'react';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { headerOptionState } from '../../store/common.store';
import Image, { StaticImageData } from 'next/image';
import DefaultProfilePic from '../../public/icons/profile_default.png';
import { Student, Teacher } from '../../types/userType';
import { UserInfoList } from '../../components/user/userInfoList';
import { useRouter } from 'next/router';

const OtherUserProfilePage: NextPage = () => {
  const [, setHeaderOption] = useRecoilState(headerOptionState);
  const { ajax } = useAjax();
  const router = useRouter();
  const { userCode } = router.query;

  const [user] = useRecoilState(userState);
  const [userInfo, setUserInfo] = useState<null | Student | Teacher>(null);
  const [profileSrc, setProfileSrc] = useState<string | StaticImageData>(DefaultProfilePic);

  useEffect(() => {
    setHeaderOption({ title: '유저 정보' });
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
    <div className='container _50'>
      {
        userInfo &&
        <div>
          <div className={styles.user_profile_wrap}>
            <div className='user-profile'>
              <Image
                src={profileSrc}
                onError={() => setProfileSrc(DefaultProfilePic)}
                width='128px'
                height='128px'
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
      }
    </div>
  );
}

export default OtherUserProfilePage;