import { ReactNode, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useModal } from "../../hook/useModal";
import { User, userState } from "../../store/account.store";
import { ajax } from "../../utils/ajax";
import { decodeBase64 } from "../../utils/util";
import Modal from "./Modal";

export const AccountBox = () => {
    return (
        <>
            <LoginBox />
            <SignUpBox />
            <AuthCodeBox />
        </>
    )
}

const LoginBox = () => {
    const { openModal, closeModal } = useModal();
    const [user, setUser] = useRecoilState(userState);
    const [loginStep, setLoginStep] = useState(0);
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');

    useEffect(() => {
        setLoginStep(0);
        if (user.isLogin) {
            ajax({
                method: 'get',
                url: 'user',
                errorCallback(data) {
                    if (data && data.statusCode === 401) {
                        setUser({
                            isLogin: false,
                            code: 0,
                            level: -1,
                            nickname: '',
                            uniqNo: '',
                            enrolledAt: 0,
                            grade: 0,
                            classNo: 0,
                            studentNo: 0,
                            name: ''
                        });
                        return true;
                    }
                },
            });
        }
    }, []);

    interface LoginRes {
        accessToken: string,
        refreshToken: string
    }

    const login = () => {
        ajax<LoginRes>({
            method: 'post',
            url: '/user/login',
            payload: {
                id,
                pw
            },
            callback: data => {
                const userInfo = JSON.parse(decodeBase64(data.accessToken.split('.')[1])) as User;
                setUser({
                    ...userInfo,
                    isLogin: true
                });
                console.log(userInfo);
                closeModal('login');
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
                        key="id"
                        type="text"
                        className="input-text"
                        placeholder="아이디"
                        required
                        onChange={e => {
                            e.preventDefault();
                            setId(e.target.value);
                        }}
                    />
                    <div className="modal--bottom-menu-box">
                        <span onClick={() => openModal('signUp')}>회원가입</span>
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
                        login();
                    }}
                >
                    <input
                        key="pw"
                        type="password"
                        className="input-text"
                        placeholder="비밀번호"
                        required
                        onChange={e => {
                            e.preventDefault();
                            setPw(e.target.value);
                        }}
                    />
                    <div className="modal--bottom-menu-box">
                        <span onClick={() => openModal('signUp')}>회원가입</span>
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
                `${id}(으)로 계속`
                : '인증 중...'
            }</span>
        </>
    );
    return (
        <Modal type="main" id="login" title={title}>
            {loginView()}
        </Modal>
    );
}

const SignUpBox = () => {
    const { openModal, closeModal } = useModal();
    const [id, setId] = useState('');
    const [pw, setpw] = useState('');
    const [checkPw, setcheckPw] = useState('');
    const [nickname, setNickname] = useState('');
    const [authCode, setAuthCode] = useState('');

    const signUp = () => {
        if (!confirm('회원 가입하시겠습니까?')) {
            return;
        }
        ajax({
            method: 'post',
            url: '/user',
            payload: {
                id,
                pw,
                checkPw,
                nickname,
                authCode
            },
            callback: () => {
                alert('회원가입이 완료되었습니다');
                closeModal('signUp');
            }
        });
    }

    const title = (
        <>
            <img src="/logo/logo.png" alt="logo" className="logo" />
            <br />
            <span>회원가입</span>
        </>
    )
    return (
        <Modal type="main" id="signUp" title={title}>
            <form
                autoComplete="off"
                onSubmit={e => {
                    e.preventDefault();
                    signUp();
                }}
            >
                <input
                    type="text"
                    className="input-text"
                    placeholder="아이디"
                    required
                    onChange={e => {
                        e.preventDefault();
                        setId(e.target.value);
                    }}
                />
                <input
                    type="password"
                    className="input-text"
                    placeholder="비밀번호"
                    required
                    onChange={e => {
                        e.preventDefault();
                        setpw(e.target.value);
                    }}
                />
                <input
                    type="password"
                    className="input-text"
                    placeholder="비밀번호 재입력"
                    required
                    onChange={e => {
                        e.preventDefault();
                        setcheckPw(e.target.value);
                    }}
                />
                <input
                    type="text"
                    className="input-text"
                    placeholder="닉네임"
                    required
                    onChange={e => {
                        e.preventDefault();
                        setNickname(e.target.value);
                    }}
                />
                <input
                    type="text"
                    className="input-text"
                    placeholder="인증코드"
                    required
                    onChange={e => {
                        e.preventDefault();
                        setAuthCode(e.target.value);
                    }}
                />
                <div className="modal--bottom-menu-box">
                    <span onClick={() => openModal('authCode')}>인증코드 발급</span>
                </div>
                <button type="submit" className="button main accent">가입하기</button>
            </form>
        </Modal>
    );
}

const AuthCodeBox = () => {
    const { closeModal } = useModal();
    const [enrolledAt, setEnrolledAt] = useState(0);
    const [grade, setGrade] = useState(0);
    const [classNo, setClassNo] = useState(0);
    const [studentNo, setStudentNo] = useState(0);
    const [name, setName] = useState('');

    const authCodeMail = () => {
        ajax({
            method: 'post',
            url: '/user/mail/authcode',
            payload: {
                enrolledAt,
                grade,
                classNo,
                studentNo,
                name
            },
            callback: () => {
                alert('인증코드 전송이 완료되었습니다\n메일함을 확인해주세요');
                closeModal('authCode');
            }
        });
    }

    return (
        <Modal type="main" id="authCode" title="인증코드 발급">
            <br/><p>인증코드는 학교 이메일 계정으로 보내드립니다</p>
            <form
                autoComplete="off"
                onSubmit={e => {
                    e.preventDefault();
                    authCodeMail();
                }}
            >
                <input
                    type="number"
                    className="input-text year"
                    placeholder="입학연도"
                    min="2021"
                    max="2099"
                    required
                    onChange={e => {
                        e.preventDefault();
                        setEnrolledAt(Number(e.target.value));
                    }}
                />
                <input
                    type="number"
                    className="input-text"
                    placeholder="학년"
                    min="1"
                    max="3"
                    required
                    onChange={e => {
                        e.preventDefault();
                        setGrade(Number(e.target.value));
                    }}
                />
                <input
                    type="number"
                    className="input-text"
                    placeholder="반"
                    min="1"
                    max="4"
                    required
                    onChange={e => {
                        e.preventDefault();
                        setClassNo(Number(e.target.value));
                    }}
                />
                <input
                    type="number"
                    className="input-text"
                    placeholder="번호"
                    min="1"
                    max="16"
                    required
                    onChange={e => {
                        e.preventDefault();
                        setStudentNo(Number(e.target.value));
                    }}
                />
                <input
                    type="text"
                    className="input-text"
                    placeholder="이름"
                    required
                    onChange={e => {
                        e.preventDefault();
                        setName(e.target.value);
                    }}
                />
                <button type="submit" className="button main accent">인증코드 발급</button>
            </form>
        </Modal>
    );
}