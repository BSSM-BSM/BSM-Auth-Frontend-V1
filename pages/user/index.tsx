import styles from '../../styles/user.module.css';
import { NextPage } from 'next';
import { useRecoilState } from 'recoil';
import { userState } from '../../store/account.store';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { UserPopup } from '../../components/user/userPopup';
import { useModal } from '../../hooks/useModal';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { headerOptionState } from '../../store/common.store';
import { useOverlay } from '../../hooks/useOverlay';
import Image, { StaticImageData } from 'next/image';
import DefaultProfilePic from '../../public/icons/profile_default.png';
import { Student, Teacher } from '../../types/userType';
import { UserInfoList } from '../../components/user/userInfoList';

const UserProfilePage: NextPage = () => {
  const [, setHeaderOption] = useRecoilState(headerOptionState);
  const { ajax } = useAjax();
  const { openModal } = useModal();
  const { showToast } = useOverlay();
  const [user] = useRecoilState(userState);
  const [userInfo, setUserInfo] = useState<null | Student | Teacher>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const [profileSrc, setProfileSrc] = useState<string | StaticImageData>(DefaultProfilePic);

  useEffect(() => {
    setHeaderOption({ title: '내 정보' });
  }, []);

  useEffect(() => {
    loadUserInfo();
  }, [user]);

  const loadUserInfo = async () => {
    const [data, error] = await ajax<Student | Teacher>({
      method: HttpMethod.GET,
      url: 'user'
    });
    if (error) return;

    setUserInfo(data);
    setProfileSrc(`https://auth.bssm.kro.kr/resource/user/profile/${data.code}.png`);
  }


  const profileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    const [, error] = await ajax({
      url: 'user/profile',
      method: HttpMethod.POST,
      payload: formData
    });
    if (error) return;

    e.target.files = null;
    showToast('프로필 이미지 업로드에 성공하였습니다\n모든 서비스에 적용되기까지 시간이 걸릴 수 있습니다');
  }

  return (
    <div className='container _50'>
      <UserPopup />
      {
        userInfo &&
        <div>
          <div className={`${styles.user_profile_wrap} ${styles.edit}`} onClick={() => profileInputRef.current?.click()}>
            <div className='user-profile'>
              <Image
                src={profileSrc}
                onError={() => setProfileSrc(DefaultProfilePic)}
                width='128'
                height='128'
                alt='user profile'
              />
            </div>
            <input ref={profileInputRef} type="file" onChange={profileUpload} style={{ display: 'none' }} />
          </div>
          <br /><br />
          <h2 className='bold'>{userInfo.nickname}</h2>
          <ul className='list-wrap left'>
            {userInfo && <UserInfoList userInfo={userInfo} />}
            <li>
              <h3>설정</h3>
              <ul className='list'>
                <li className='pointer' onClick={() => profileInputRef.current?.click()}>
                  <span>프로필 사진 변경</span>
                </li>
                <li className='pointer' onClick={() => openModal('updateNickname')}>
                  <span>닉네임 변경</span>
                </li>
                <li className='pointer' onClick={() => openModal('updatePw')}>
                  <span>비밀번호 변경</span>
                </li>
                <li>
                  <span>연결된 서비스 관리</span>
                  <span>(준비중)</span>
                </li>
                <li className='pointer' onClick={() => openModal('setting')}>
                  <span>다른 설정</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      }
    </div>
  );
}

export default UserProfilePage;