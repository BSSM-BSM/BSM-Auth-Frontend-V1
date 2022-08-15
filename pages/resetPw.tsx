import type { NextPage } from 'next'
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Modal from '../components/common/modal';
import { useModal } from '../hooks/useModal';
import { useAjax } from '../hooks/useAjax';
import { useOverlay } from '../hooks/useOverlay';
import { useInterval } from '../hooks/useInterval';

const ResetPwPage: NextPage = () => {
    const { ajax } = useAjax();
    const { openModal, closeModal } = useModal();
    const { showAlert, showToast } = useOverlay();
    const router = useRouter();
    const { token } = router.query;
    const [newPw, setNewPw] = useState('');
    const [checkNewPw, setCheckNewPw] = useState('');
    const [leftTime, setLeftTime] = useState('');

    interface TokenInfo {
        used: boolean,
        expireIn: string
    }
    const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
        used: false,
        expireIn: ''
    });

    useEffect(() => {
        let flag = false;
        if (tokenInfo.used) {
            flag = true;
            showAlert('이미 사용된 토큰입니다');
        }
        if (calcLeftTime() < 0) {
            flag = true;
            showAlert('토큰이 만료되었습니다');
        }

        if (flag) {
            closeModal('resetPw')
        }
    }, [leftTime]);

    useEffect(() => {
        token && getTokenInfo();
    }, [token])

    const getTokenInfo = () => {
        ajax<TokenInfo>({
            method: 'get',
            url: `/user/pw/token?token=${token}`,
            callback: data => {
                setTokenInfo(data);
                openModal('resetPw', false);
            }
        });
    }

    const calcLeftTime = (): number => {
        if (!tokenInfo.expireIn) return 1;
        const leftTime = new Date(
            new Date(tokenInfo.expireIn).getTime() - new Date().getTime()
        );

        setLeftTime(`${String(leftTime.getMinutes()).padStart(2, '0')}:${String(leftTime.getSeconds()).padStart(2, '0')}`);
        return leftTime.getTime();
    }

    useInterval(calcLeftTime, 500);
    
    const resetPw = () => {
        ajax({
            method: 'post',
            url: '/user/pw/token',
            payload: {
                token,
                newPw,
                checkNewPw
            },
            callback: () => {
                showToast('비밀번호 재설정이 완료되었습니다');
                window.location.href = '/';
            }
        })
    }

    return (
        <>
            <Head>
                <title>비밀번호 재설정 - BSM Auth</title>
            </Head>
            <Modal type="main" id="resetPw" title="비밀번호 재설정">
                <h3>남은 시간 {leftTime}</h3>
                <form
                    autoComplete="off"
                    onSubmit={e => {
                        e.preventDefault();
                        resetPw();
                    }}
                >
                    <input
                        type="password"
                        className="input-text"
                        placeholder="재설정할 비밀번호"
                        required
                        onChange={e => {
                            e.preventDefault();
                            setNewPw(e.target.value);
                        }}
                    />
                    <input
                        type="password"
                        className="input-text"
                        placeholder="재설정할 비밀번호 재입력"
                        required
                        onChange={e => {
                            e.preventDefault();
                            setCheckNewPw(e.target.value);
                        }}
                    />
                    <button type="submit" className="button main accent">비밀번호 재설정</button>
                </form>
            </Modal>
        </>
    );
}

export default ResetPwPage;
