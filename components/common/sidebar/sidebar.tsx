import * as S from '../../../styles/common/sidebar.style';
import { AiFillGithub } from 'react-icons/ai';
import { BiServer } from 'react-icons/bi';
import SidebarItem from './sidebarItem';
import SidebarUserMenu from './sidebarUserMenu';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const router = useRouter();

  return (
    <S.Sidebar>
      <S.SidebarItemList>
        <SidebarUserMenu />
        <SidebarItem
          Icon={BiServer}
          iconSize={22}
          onClick={() => router.push('/oauth/manage')}
        >
          OAuth 클라이언트
        </SidebarItem>
        <SidebarItem
          Icon={AiFillGithub}
          iconSize={26}
          onClick={() => window.location.href = 'https://github.com/BSSM-BSM'}
        >
          깃허브
        </SidebarItem>
      </S.SidebarItemList>
    </S.Sidebar>
  );
}

export default Sidebar;
