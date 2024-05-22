import * as S from '@/styles/common/sidebar.style';
import { useEffect, useState } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { userState } from '@/store/account.store';
import { UserRole } from "@/types/user.type";
import Image, { StaticImageData } from 'next/image';
import DefaultProfilePic from '@/public/icons/profile_default.png';
import { useModal } from '@/hooks/useModal';
import { getProfileSrc } from '@/utils/userUtil';
import SidebarItem from '@/components/common/sidebar/sidebarItem';
import { AiOutlineUser } from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';
import { HttpMethod, useAjax } from '@/hooks/useAjax';
import { useOverlay } from '@/hooks/useOverlay';
import { useRouter } from 'next/navigation';

const SidebarUserMenu = () => {
  const router = useRouter();
  const { ajax } = useAjax();
  const { showToast } = useOverlay();
  const resetUser = useResetRecoilState(userState);
  const { openModal } = useModal();
  const [profileSrc, setProfileSrc] = useState<string | StaticImageData>(DefaultProfilePic);
  const user = useRecoilValue(userState);

  useEffect(() => {
      setProfileSrc(getProfileSrc(user.isLogin? user.code: 0));
  }, [user]);

  const logout = async () => {
    const [, error] = await ajax({
      method: HttpMethod.DELETE,
      url: 'auth/logout',
    });
    if (error) return;

    resetUser();
    showToast('로그아웃 되었습니다');
  }

  const loginUserDropdownMenu = <>
    <SidebarItem
      id='user_info'
      subId='self'
      Icon={AiOutlineUser}
      iconSize={26}
      onClick={() => router.push('/user')}
      order={1}
    >
      내 정보
    </SidebarItem>
    <SidebarItem
      Icon={FiLogOut}
      iconSize={24}
      onClick={logout}
      order={2}
    >
      로그아웃
    </SidebarItem>
  </>;

  return (
    user.isLogin
    ? (
      <SidebarItem
        id='user_info'
        IconElement={
          <S.SidebarUserProfile>
            <Image
              src={profileSrc}
              onError={() => setProfileSrc(DefaultProfilePic)}
              alt='user profile'
              fill
            />
          </S.SidebarUserProfile>
        }
        dropdownMenu={loginUserDropdownMenu}
      >
        <div>
          <S.SidebarUserInfo>{
            user.role === UserRole.STUDENT
            ? `${user.student.grade}학년 ${user.student.classNo}반 ${user.student.studentNo}번 ${user.student?.name}`
            : `${user.teacher?.name} 선생님`
          }</S.SidebarUserInfo>
          <S.SidebarUserName>{user.nickname}</S.SidebarUserName>
        </div>
      </SidebarItem>
    )
    : (
      <SidebarItem
        Icon={AiOutlineUser}
        iconSize={26}
        onClick={() => openModal({ key: 'login' })}
      >
        로그인
      </SidebarItem>
    )
  );
}

export default SidebarUserMenu;