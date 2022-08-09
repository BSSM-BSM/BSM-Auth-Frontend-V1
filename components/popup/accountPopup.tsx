import { json } from "node:stream/consumers";
import React, { ReactNode, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { showLoginBoxState, User, userState } from "../../store/account.store";
import { ajax } from "../../utils/ajax";
import { decodeBase64 } from "../../utils/util";
import Modal from "../common/Modal";

const AccountPopup = () => {
    return (
        <div className="account-popup">
            {loginBox()}
        </div>
    );
}

const loginBox = () => {
    const [, setUser] = useRecoilState(userState);
    const [showLoginBox, setShowLoginBox] = useRecoilState(showLoginBoxState);
    const [loginStep, setLoginStep] = useState(0);
    const [loginId, setLoginId] = useState('');
    const [loginPw, setLoginPw] = useState('');

    useEffect(() => {
        setLoginStep(0);
    }, [showLoginBox]);

    interface LoginRes {
        accessToken: string,
        refreshToken: string
    }

    const login = (id: string, pw: string) => {
        ajax<LoginRes>({
            method: 'post',
            url: '/user/login',
            payload: {
                id,
                pw
            },
            callback: data => {
                const userInfo = JSON.parse(decodeBase64(data.accessToken.split('.')[1])) as User;
                setUser(userInfo);
                console.log(userInfo);
                setShowLoginBox(false);
            },
            errorCallback: (data: any) => {
                if (data.statusCode === 400) {
                    setLoginStep(0);
                    alert(data.message);
                    return true;
                }
                setLoginStep(1);
                return false;
            }
        });
    }

    const loginView = (): ReactNode => {
        switch (loginStep) {
            case 0: return (
                <form
                    autoComplete="off"
                    onSubmit={e => {
                        e.preventDefault();
                        setLoginStep(1);
                    }}
                >
                    <input
                        key="loginId"
                        type="text"
                        className="input-text"
                        placeholder="아이디"
                        required
                        onChange={e => {
                            e.preventDefault();
                            setLoginId(e.target.value);
                        }}
                    />
                    <div className="modal--bottom-menu-box">
                        <span>회원가입</span>
                        <span>비밀번호 복구</span>
                        <span>ID 찾기</span>
                    </div>
                    <button type="submit" className="button main accent">다음</button>
                </form>
            )
            case 1: return (
                <form 
                    autoComplete="off"
                    onSubmit={e => {
                        e.preventDefault();
                        setLoginStep(2);
                        login(loginId, loginPw);
                    }}
                >
                    <input
                        key="loginPw"
                        type="password"
                        className="input-text"
                        placeholder="비밀번호"
                        required
                        onChange={e => {
                            e.preventDefault();
                            setLoginPw(e.target.value);
                        }}
                    />
                    <div className="modal--bottom-menu-box">
                        <span>회원가입</span>
                        <span>비밀번호 복구</span>
                        <span>ID 찾기</span>
                    </div>
                    <button type="submit" className="button main accent">로그인</button>
                </form>
            )
        }
    }

    const title = (
        <>
            <img src="/logo/logo.png" alt="logo" className="logo" />
            <br />
            <span>{
                loginStep === 0?
                '로그인'
                : loginStep === 1?
                `${loginId}(으)로 계속`
                : '인증 중...'
            }</span>
        </>
    )
    return (
        <Modal type="main" active={showLoginBox} setActive={setShowLoginBox} title={title}>
            {loginView()}
        </Modal>
    );
}

export default AccountPopup;