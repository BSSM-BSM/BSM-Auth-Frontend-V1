import * as S from '@/styles/common/navbar.style';
import { AiOutlineUser, AiOutlineSearch } from 'react-icons/ai';
import { BiServer } from 'react-icons/bi';
import NavbarItem from '@/components/common/navbar/navbarItem';
import { useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { pageState } from '@/store/common.store';

const Navbar = () => {
  const router = useRouter();
  const _page = useRecoilValue(pageState);

  return (
    <S.Navbar>
      <S.NavbarItemList>
        <NavbarItem
          id='oauth'
          subId='manage'
          Icon={BiServer}
          iconSize={20}
          onClick={() => router.push('/oauth/manage')}
        >
          OAuth 클라이언트
        </NavbarItem>
        <NavbarItem
          id='search_user'
          Icon={AiOutlineSearch}
          iconSize={22}
          onClick={() => router.push('/user/search')}
        >
          유저 검색
        </NavbarItem>
        <NavbarItem
          id='user_info'
          Icon={AiOutlineUser}
          iconSize={22}
          onClick={() => router.push('/user')}
        >
          내 정보
        </NavbarItem>
      </S.NavbarItemList>
    </S.Navbar>
  );
}

export default Navbar;
