import * as S from '@/styles/common/sidebar.style';
import { AiFillGithub, AiOutlineSearch } from 'react-icons/ai';
import { BiServer } from 'react-icons/bi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { SiUptimekuma } from "react-icons/si";
import SidebarItem from '@/components/common/sidebar/sidebarItem';
import SidebarUserMenu from '@/components/common/sidebar/sidebarUserMenu';
import { useRouter } from 'next/navigation';
import { useAtomValue } from 'jotai';
import { pageState, sideBarState } from '@/store/common.store';

const Sidebar = () => {
  const router = useRouter();
  const _page = useAtomValue(pageState); // 페이지 이동 감지용 state
  const sideBar = useAtomValue(sideBarState);

  return (
    <S.Sidebar isOpen={sideBar}>
      <S.SidebarItemList>
        <SidebarUserMenu />
        <SidebarItem
          id='search_user'
          Icon={AiOutlineSearch}
          iconSize="2.6rem"
          onClick={() => router.push('/user/search')}
        >
          유저 검색
        </SidebarItem>
        <SidebarItem
          id='oauth'
          subId='manage'
          Icon={BiServer}
          iconSize="2.2rem"
          onClick={() => router.push('/oauth/manage')}
        >
          OAuth 클라이언트
        </SidebarItem>
        <SidebarItem
          Icon={HiOutlineDocumentText}
          iconSize="2.6rem"
          onClick={() => window.open('https://bssm.app/board/doc-oauth', '_blank')}
        >
          BSM OAuth 공식 문서
        </SidebarItem>
        <SidebarItem
          Icon={SiUptimekuma}
          iconSize="2.6rem"
          onClick={() => window.open('https://status.bssm.app', '_blank')}
        >
          Uptime
        </SidebarItem>
        <SidebarItem
          Icon={AiFillGithub}
          iconSize="2.6rem"
          onClick={() => window.open('https://github.com/BSSM-BSM', '_blank')}
        >
          깃허브
        </SidebarItem>
      </S.SidebarItemList>
    </S.Sidebar>
  );
}

export default Sidebar;
