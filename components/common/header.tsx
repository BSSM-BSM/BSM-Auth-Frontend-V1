import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import { Router, useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { useModal } from '../../hooks/useModal';
import { useOverlay } from '../../hooks/useOverlay';
import { userState } from '../../store/account.store';
import { DropdownMenuOption, headerOptionState } from '../../store/common.store';
import styles from '../../styles/header.module.css';
import DefaultProfilePic from '../../public/icons/profile_default.png';
import { getProfileSrc } from '../../utils/util';
import { getUserInfo } from '../../utils/userUtil';

export const Header = () => {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { openModal } = useModal();
    const { ajax } = useAjax();
    const { showToast } = useOverlay();
    const [user, setUser] = useRecoilState(userState);
    const resetUser = useResetRecoilState(userState);
    const [sideBar, setSideBar] = useState(false);
    const [headerOption] = useRecoilState(headerOptionState);
    const [profileSrc, setProfileSrc] = useState<string | StaticImageData>(DefaultProfilePic);

    useEffect(() => {
        Router.events.on('routeChangeStart', () => setSideBar(false));
        setMounted(true);
        getUserInfo(ajax, setUser);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        setProfileSrc(getProfileSrc(user.isLogin? user.code: 0));
    }, [user]);

    const logout = () => {
        ajax({
            method: HttpMethod.DELETE,
            url: 'user/logout',
            callback() {
                resetUser();
                showToast('로그아웃 되었습니다');
            }
        });
    }

    const userMenuView = () => (
        mounted && (
            user.isLogin
            ?<div className={`dropdown-menu ${styles.dropdown}`}>
                <span className={`${styles.item} ${styles.user_profile_wrap}`}>
                    <span>{user.nickname}</span>
                    <div className='user-profile'>
                        <Image
                            src={profileSrc}
                            onError={() => setProfileSrc(DefaultProfilePic)}
                            width='128px'
                            height='128px'
                            alt='user profile'
                        />
                    </div>
                </span>
                <ul className='dropdown-content'>
                    <li><Link href='/user'><a className='option'>유저 정보</a></Link></li>
                    <li><span onClick={() => {logout(); setSideBar(false);}} className='option'>로그아웃</span></li>
                </ul>
            </div>
            :(<span className={styles.item} onClick={() => {openModal('login'); setSideBar(false);}}>로그인</span>)
        )
    );

    const allMenuFunc = (): {
        className: string,
        func: () => void
    } => {
        const {allMenu} = headerOption;
        if (allMenu?.goBack) {
            return {
                className: 'go-back',
                func: () => router.back()
            };
        }
        return {
            className: '',
            func: () => setSideBar(true)
        };
    }

    const allMenuView = () => {
        if (headerOption.allMenu?.dropdownMenu) {
            return dropdownMenuView(headerOption.allMenu.dropdownMenu);
        }

        const {className, func} = allMenuFunc();
        return (
            <li
                className={`${styles.item} ${styles.all_menu} menu-button ${className}`}
                onClick={func}
            >
                <span className='line'></span>
                <span className='line'></span>
                <span className='line'></span>
            </li>
        );
    };

    const optionMenuView = () => {
        if (headerOption.optionMenu?.dropdownMenu) {
            return dropdownMenuView(headerOption.optionMenu.dropdownMenu);
        }
        return <li onClick={() => openModal('setting')} className={`${styles.item} ${styles.setting}`}><img src="/icons/setting.svg" alt="setting" /></li>;
    }

    const dropdownMenuView = (dropdownMenu: DropdownMenuOption[]) => (
        <li className={`dropdown-menu ${styles.dropdown}`}>
            <span className={`${styles.item} ${styles.all_menu} menu-button`}>
                <span className='line'></span>
                <span className='line'></span>
                <span className='line'></span>
            </span>
            <ul className='dropdown-content'>
                {dropdownMenu.map(
                    menu => <li key={menu.text} onClick={menu.callback}><span className='option'>{menu.text}</span></li>
                )}
            </ul>
        </li>
    );

    return (
        <header className={styles.header}>
            <div className={styles.top}>
                <nav className={styles.top_menu_bar}>
                    <ul className={styles.left}>
                        <li className={styles.home}>
                            <Link href='/'><a className={`${styles.item} ${styles.home}`}>BSM</a></Link>
                        </li>
                        {allMenuView()}
                        <h2 className={styles.title}>
                            {headerOption.title}
                        </h2>
                        {optionMenuView()}
                    </ul>
                    <h2 className={styles.title}>
                        {headerOption.title}
                    </h2>
                    <ul className={styles.right}>
                        <li>
                            <Link href='/oauth/manage'><a className={`option ${styles.item}`}>OAuth</a></Link>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className={`${styles.side} ${sideBar? styles.on: ''}`}>
                <div className={`close_button ${styles.close_button}`} onClick={() => setSideBar(false)}></div>
                <div className={`dim ${styles.dim}`} onClick={() => setSideBar(false)}></div>
                <ul className={styles.menus}>
                <li><Link href='/'><a className={`${styles.item} ${styles.home}`}>BSM</a></Link></li>
                    <li>{userMenuView()}</li>
                    <li><Link href='/oauth/manage'><a className={styles.item}>OAuth</a></Link></li>
                    <li><a href='https://github.com/BSSM-BSM' className={styles.item}>깃허브</a></li>
                </ul>
            </div>
        </header>
    )
}