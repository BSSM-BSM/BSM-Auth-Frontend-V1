import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { useModal } from '../../hooks/useModal';
import { useOverlay } from '../../hooks/useOverlay';
import { userState } from '../../store/account.store';
import styles from '../../styles/header.module.css';

export const Header = () => {
    const [mounted, setMounted] = useState(false);
    const { openModal } = useModal();
    const { ajax } = useAjax();
    const { showToast } = useOverlay();
    const [user] = useRecoilState(userState);
    const resetUser = useResetRecoilState(userState);
    const [sideBar, setSideBar] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const logout = () => {
        ajax({
            method: HttpMethod.DELETE,
            url: 'user/logout',
            callback() {
                localStorage.removeItem('user');
                resetUser();
                showToast('로그아웃 되었습니다');
            }
        })
    }

    const userMenuView = () => (
        mounted && (
            user.isLogin
            ?<div className={`dropdown-menu ${styles.dropdown}`}>
                <span className={styles.item}>{user.nickname}</span>
                <ul className='dropdown-content'>
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
                        <li>
                            <Link href='/oauth/manage'><a className={`option ${styles.item}`}>OAuth</a></Link>
                        </li>
                    </ul>
                    <ul className={styles.right}>
                    <li onClick={() => openModal('setting')} className={`${styles.item} ${styles.setting}`}>
                        <img src="/icons/setting.svg" alt="setting" />
                    </li>
                        <li>{userMenuView()}</li>
                    </ul>
                </nav>
            </div>
            <div onClick={() => setSideBar(false)} className={`${styles.side} ${sideBar? styles.on: ''}`}>
                <div className={`close_button ${styles.close_button}`}></div>
                <div className={`dim ${styles.dim}`}></div>
                <ul className={styles.menus}>
                    <li className={styles.home}><Link href='/'><img src='/logo/logo.png' alt='logo' className='logo'/></Link></li>
                    <li>
                        <Link href='/oauth/manage'><a className={styles.item}>OAuth</a></Link>
                    </li>
                    <li>
                        <a href='https://github.com/BSSM-BSM' className={styles.item}>깃허브</a>
                    </li>
                </ul>
            </div>
        </header>
    )
}