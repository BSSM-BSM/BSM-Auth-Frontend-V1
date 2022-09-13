import Link from 'next/link';
import { Router } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { useModal } from '../../hooks/useModal';
import { useOverlay } from '../../hooks/useOverlay';
import { userState } from '../../store/account.store';
import { titleState } from '../../store/common.store';
import styles from '../../styles/header.module.css';

export const Header = () => {
    const [title] = useRecoilState(titleState);
    const [mounted, setMounted] = useState(false);
    const { openModal } = useModal();
    const { ajax } = useAjax();
    const { showToast } = useOverlay();
    const [user] = useRecoilState(userState);
    const resetUser = useResetRecoilState(userState);
    const [sideBar, setSideBar] = useState(false);

    useEffect(() => {
        Router.events.on('routeChangeStart', () => setSideBar(false));
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const logout = () => {
        ajax({
            method: HttpMethod.DELETE,
            url: 'user/logout',
            callback() {
                resetUser();
                showToast('로그아웃 되었습니다');
            }
        })
    }

    const userMenuView = () => (
        mounted && (
            user.isLogin
            ?<div className={`dropdown-menu ${styles.dropdown}`}>
                <span className={`${styles.item} ${styles.user_profile_wrap}`}>
                    <span>{user.nickname}</span>
                    <img className='user-profile' src={`https://auth.bssm.kro.kr/resource/user/profile/profile_${user.code}.png`} onError={e => e.currentTarget.src = '/icons/profile_default.png'} alt='user profile' />
                </span>  <ul className='dropdown-content'>
                    <li><Link href='/user'><a className='option'>유저 정보</a></Link></li>
                    <li><span onClick={logout} className='option'>로그아웃</span></li>
                </ul>
            </div>
            :(<span className={styles.item} onClick={() => openModal('login')}>로그인</span>)
        )
    )

    return (
        <header className={styles.header}>
            <div className={styles.top}>
                <nav className={styles.top_menu_bar}>
                    <ul className={styles.left}>
                        <li className={styles.home}>
                            <Link href='/'><img src='/logo/logo.png' alt='logo' className={`logo ${styles.item}`} /></Link>
                        </li>
                        <li className={`${styles.item} ${styles.all_menu} menu-button`} onClick={() => setSideBar(true)}>
                            <span className='line'></span>
                            <span className='line'></span>
                            <span className='line'></span>
                        </li>
                        <h2 className={styles.title}>
                            {title}
                        </h2>
                        <li onClick={() => openModal('setting')} className={`${styles.item} ${styles.setting}`}>
                            <img src="/icons/setting.svg" alt="setting" />
                        </li>
                    </ul>
                    <h2 className={styles.title}>
                        {title}
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
                    <li className={styles.home}><Link href='/'><img src='/logo/logo.png' alt='logo' className='logo'/></Link></li>
                    <li>{userMenuView()}</li>
                    <li><Link href='/oauth/manage'><a className={styles.item}>OAuth</a></Link></li>
                    <li><a href='https://github.com/BSSM-BSM' className={styles.item}>깃허브</a></li>
                </ul>
            </div>
        </header>
    )
}