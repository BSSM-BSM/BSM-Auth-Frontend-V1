import { ReactNode, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { HttpMethod, useAjax } from "../../hooks/useAjax";
import { useModal } from "../../hooks/useModal";
import { useOverlay } from "../../hooks/useOverlay";
import { User, userState } from "../../store/account.store";
import { UserRole } from "../../types/UserRole";
import { decodeBase64 } from "../../utils/util";
import Modal from "./modal";

export const AccountBox = () => {
    return (
        <>
            <LoginBox />
            <SignUpBox />
            <AuthCodeBox />
            <FindIdBox />
            <ResetPwBox />
        </>
    )
}

const LoginBox = () => {
    const { ajax } = useAjax();
    const { showAlert } = useOverlay();
    const { openModal, closeModal } = useModal();
    const [, setUser] = useRecoilState(userState);
    const [loginStep, setLoginStep] = useState(0);
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');

    interface LoginRes {
        accessToken: string,
        refreshToken: string
    }

    const login = () => {
        ajax<LoginRes>({
            method: HttpMethod.POST,
            url: 'user/login',
            payload: {
                id,
                pw
            },
            callback: data => {
                const userInfo = {
                    ...JSON.parse(decodeBase64(data.accessToken.split('.')[1])),
                    isLogin: true
                } as User;
                localStorage.setItem('user', JSON.stringify(userInfo));
                setUser(userInfo);
                closeModal('login');
            },
            errorCallback: (data: any) => {
                if (data.statusCode === 400) {
                    setLoginStep(0);
                    showAlert(data.message);
                    return true;
                }
                setLoginStep(1);
                return false;
            }
        });
    }

    const bottomMenuView = (): ReactNode => (
        <div className="modal--bottom-menu-box">
            <span onClick={() => openModal('signUp')}>회원가입</span>
            <span onClick={() => openModal('resetPwMail')}>비밀번호 복구</span>
            <span onClick={() => openModal('findIdMail')}>ID 찾기</span>
        </div>
    )

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
                    {bottomMenuView()}
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
                    {bottomMenuView()}
                    <button type="submit" className="button main accent">로그인</button>
                </form>
            )
        }
    }

    const title = (
        <>
            <img src="/logo/logo.png" alt="logo" className="logo" />
            <br/>
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
    const { ajax } = useAjax();
    const { showToast } = useOverlay();
    const { openModal, closeModal } = useModal();
    const [id, setId] = useState('');
    const [pw, setpw] = useState('');
    const [checkPw, setcheckPw] = useState('');
    const [nickname, setNickname] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [name, setName] = useState('');

    const signUp = (role: UserRole) => {
        if (!confirm('회원 가입하시겠습니까?')) {
            return;
        }
        const payload = (() => {
            switch (role) {
                case UserRole.STUDENT: return {
                    id,
                    pw,
                    checkPw,
                    nickname,
                    authCode
                }
                case UserRole.TEACHER: return {
                    id,
                    pw,
                    checkPw,
                    nickname,
                    authCode,
                    name
                }
            }
        })();
        ajax({
            method: HttpMethod.POST,
            url: `user/${role}`,
            payload,
            callback: () => {
                showToast('회원가입이 완료되었습니다');
                closeModal('signUp');
            }
        });
    }

    const signUpFormView = (role: UserRole) => (
        <form
            autoComplete="off"
            onSubmit={e => {
                e.preventDefault();
                signUp(role);
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
            {
                role === UserRole.TEACHER
                ? <input
                    type="text"
                    className="input-text"
                    placeholder="선생님 이름"
                    required
                    onChange={e => {
                        e.preventDefault();
                        setName(e.target.value);
                    }}
                />
                : null
            }
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
    )

    const title = (
        <>
            <img src="/logo/logo.png" alt="logo" className="logo" />
            <br/>
            <span>회원가입</span>
        </>
    )
    return (
        <Modal type="main" id="signUp" title={title} menuList={
            [
                {
                    element: signUpFormView(UserRole.STUDENT),
                    name: '학생'
                },
                {
                    element: signUpFormView(UserRole.TEACHER),
                    name: '선생님'
                }
            ]
        }></Modal>
    );
}


const AuthCodeBox = () => {
    const { ajax } = useAjax();
    const { showToast } = useOverlay();
    const { closeModal } = useModal();
    const [grade, setGrade] = useState(0);
    const [classNo, setClassNo] = useState(0);
    const [studentNo, setStudentNo] = useState(0);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const authCodeMail = (role: UserRole) => {
        const payload = (() => {
            switch (role) {
                case UserRole.STUDENT: return {
                    grade,
                    classNo,
                    studentNo,
                    name
                }
                case UserRole.TEACHER: return {
                    email
                }
            }
        })();
        ajax({
            method: HttpMethod.POST,
            url: `user/mail/authcode/${role}`,
            payload,
            callback: () => {
                showToast('인증코드 전송이 완료되었습니다\n메일함을 확인해주세요');
                closeModal('authCode');
            }
        });
    }

    const authCodeFormView = (role: UserRole) => (
        <>
            <form
                autoComplete="off"
                onSubmit={e => {
                    e.preventDefault();
                    authCodeMail(role);
                }}
            >
                {
                    authCodeInputView(role)
                }
                <p>인증코드는 학교 이메일 계정으로 보내드립니다</p>
                <button type="submit" className="button main accent">인증코드 발급</button>
            </form>
        </>
    )

    const authCodeInputView = (role: UserRole) => {
        switch (role) {
            case UserRole.STUDENT: return (<>
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
            </>)
            case UserRole.TEACHER: return (
                <input
                    type="text"
                    className="input-text"
                    placeholder="학교 이메일 주소"
                    required
                    onChange={e => {
                        e.preventDefault();
                        setEmail(e.target.value);
                    }}
                />
            )
        }
    }

    return (
        <Modal type="main" id="authCode" title="인증코드 발급" menuList={
            [
                {
                    element: authCodeFormView(UserRole.STUDENT),
                    name: '학생'
                },
                {
                    element: authCodeFormView(UserRole.TEACHER),
                    name: '선생님'
                }
            ]
        }></Modal>
    );
}

const FindIdBox = () => {
    const { ajax } = useAjax();
    const { showToast } = useOverlay();
    const { closeModal } = useModal();
    const [email, setEmail] = useState('');
    const [grade, setGrade] = useState(0);
    const [classNo, setClassNo] = useState(0);
    const [studentNo, setStudentNo] = useState(0);
    const [name, setName] = useState('');

    const findIdMail = (role: UserRole) => {
        const payload = (() => {
            switch (role) {
                case UserRole.STUDENT: return {
                    grade,
                    classNo,
                    studentNo,
                    name
                }
                case UserRole.TEACHER: return {
                    email
                }
            }
        })();
        ajax({
            method: HttpMethod.POST,
            url: `user/mail/id/${role}`,
            payload,
            callback: () => {
                showToast('ID 복구 메일 전송이 완료되었습니다.\n메일함을 확인해주세요.');
                closeModal('findIdMail');
            }
        });
    }

    const findIdInputView = (role: UserRole) => {
        switch (role) {
            case UserRole.STUDENT: return (<>
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
            </>)
            case UserRole.TEACHER: return (
                <input
                    type="text"
                    className="input-text"
                    placeholder="학교 이메일 주소"
                    required
                    onChange={e => {
                        e.preventDefault();
                        setEmail(e.target.value);
                    }}
                />
            )
        }
    }

    const findIdFormView = (role: UserRole) => (
        <>
            <p>학교 이메일계정으로 복구 메일이 전송됩니다</p>
            <form
                autoComplete="off"
                onSubmit={e => {
                    e.preventDefault();
                    findIdMail(role);
                }}
            >
                {
                    findIdInputView(role)
                }
                <button type="submit" className="button main accent">복구 메일 전송</button>
            </form>
        </>
    )

    return (
        <Modal type="main" id="findIdMail" title="ID 찾기" menuList={
            [
                {
                    element: findIdFormView(UserRole.STUDENT),
                    name: '학생'
                },
                {
                    element: findIdFormView(UserRole.TEACHER),
                    name: '선생님'
                }
            ]
        }></Modal>
    );
}

const ResetPwBox = () => {
    const { ajax } = useAjax();
    const { showToast } = useOverlay();
    const { closeModal } = useModal();
    const [id, setId] = useState('');

    const resetPwMail = () => {
        ajax({
            method: HttpMethod.POST,
            url: 'user/mail/pw',
            payload: {
                id
            },
            callback: () => {
                showToast('비밀번호 복구 메일 전송이 완료되었습니다.\n메일함을 확인해주세요.');
                closeModal('resetPwMail');
            }
        });
    }

    return (
        <Modal type="main" id="resetPwMail" title="비밀번호 복구">
            <p>학교 이메일계정으로 복구 메일이 전송됩니다</p>
            <form
                autoComplete="off"
                onSubmit={e => {
                    e.preventDefault();
                    resetPwMail();
                }}
            >
                <input
                    type="text"
                    className="input-text"
                    placeholder="복구할 아이디"
                    required
                    onChange={e => {
                        e.preventDefault();
                        setId(e.target.value);
                    }}
                />
                <button type="submit" className="button main accent">복구 메일 전송</button>
            </form>
        </Modal>
    );
}