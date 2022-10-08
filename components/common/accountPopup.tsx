import { ReactNode, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { useModal } from '../../hooks/useModal';
import { useOverlay } from '../../hooks/useOverlay';
import { User, userState } from '../../store/account.store';
import { UserRole } from '../../types/UserRole';
import { decodeBase64 } from '../../utils/util';
import { NumberInput } from './inputs/numberInput';
import { TextInput } from './inputs/textInput';
import Modal from './modal';

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
                    return false;
                }
                setLoginStep(1);
                return false;
            }
        });
    }

    const bottomMenuView = (): ReactNode => (
        <div className='modal--bottom-menu-box'>
            <span onClick={() => openModal('signUp')}>회원가입</span>
            <span onClick={() => openModal('resetPwMail')}>비밀번호 복구</span>
            <span onClick={() => openModal('findIdMail')}>ID 찾기</span>
        </div>
    )

    const loginView = (): ReactNode => {
        switch (loginStep) {
            case 0: return (
                <form
                    className='cols gap-1'
                    autoComplete='off'
                    onSubmit={e => {
                        e.preventDefault();
                        setLoginStep(1);
                    }}
                >
                    <TextInput
                        key='id'
                        setCallback={setId}
                        placeholder='아이디'
                        full
                        required
                    />
                    {bottomMenuView()}
                    <button type='submit' className='button main accent'>다음</button>
                </form>
            )
            case 1: return (
                <form 
                    className='cols gap-1'
                    autoComplete='off'
                    onSubmit={e => {
                        e.preventDefault();
                        setLoginStep(2);
                        login();
                    }}
                >
                    <TextInput
                        key='pw'
                        type='password'
                        setCallback={setPw}
                        placeholder='비밀번호'
                        full
                        required
                    />
                    {bottomMenuView()}
                    <button type='submit' className='button main accent'>로그인</button>
                </form>
            )
        }
    }

    const title = (
        <>
            <img src='/logo/logo.png' alt='logo' className='logo' />
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
        <Modal type='main' id='login' title={title}>
            {loginView()}
        </Modal>
    );
}

const SignUpBox = () => {
    const { ajax } = useAjax();
    const { showToast } = useOverlay();
    const { openModal, closeModal } = useModal();
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [checkPw, setCheckPw] = useState('');
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
            className='cols gap-1'
            autoComplete='off'
            onSubmit={e => {
                e.preventDefault();
                signUp(role);
            }}
        >
            <TextInput
                setCallback={setId}
                placeholder="아이디"
                full
                required
            />
            <TextInput
                type='password'
                setCallback={setPw}
                placeholder='비밀번호'
                full
                required
            />
            <TextInput
                type='password'
                setCallback={setCheckPw}
                placeholder='비밀번호 재입력'
                full
                required
            />
            <TextInput
                setCallback={setNickname}
                placeholder='닉네임'
                full
                required
            />
            {
                role === UserRole.TEACHER
                ? <TextInput
                    setCallback={setName}
                    placeholder='선생님 이름'
                    full
                    required
                />
                : null
            }
            <TextInput
                setCallback={setAuthCode}
                placeholder='인증코드'
                full
                required
            />
            <div className='modal--bottom-menu-box'>
                <span onClick={() => openModal('authCode')}>인증코드 발급</span>
            </div>
            <button type='submit' className='button main accent'>가입하기</button>
        </form>
    )

    const title = (
        <>
            <img src='/logo/logo.png' alt='logo' className='logo' />
            <br/>
            <span>회원가입</span>
        </>
    )
    return (
        <Modal type='main' id='signUp' title={title} menuList={
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
                className='cols gap-1 center'
                autoComplete='off'
                onSubmit={e => {
                    e.preventDefault();
                    authCodeMail(role);
                }}
            >
                {
                    authCodeInputView(role)
                }
                <p>인증코드는 학교 이메일 계정으로 보내드립니다</p>
                <button type='submit' className='button main accent'>인증코드 발급</button>
            </form>
        </>
    )

    const authCodeInputView = (role: UserRole) => {
        switch (role) {
            case UserRole.STUDENT: return (<>
                <div className='rows gap-05 center'>
                    <NumberInput
                        setCallback={setGrade}
                        min={1}
                        max={3}
                        placeholder='학년'
                        required
                    />
                    <NumberInput
                        setCallback={setClassNo}
                        min={1}
                        max={4}
                        placeholder='반'
                        required
                    />
                    <NumberInput
                        setCallback={setStudentNo}
                        min={1}
                        max={16}
                        placeholder='번호'
                        required
                    />
                </div>
                <TextInput
                    setCallback={setName}
                    placeholder="이름"
                    full
                    required
                />
            </>)
            case UserRole.TEACHER: return (
                <TextInput
                    setCallback={setEmail}
                    placeholder="학교 이메일 주소"
                    full
                    required
                />
            )
        }
    }

    return (
        <Modal type='main' id='authCode' title='인증코드 발급' menuList={
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
                <div className='rows gap-05 center'>
                    <NumberInput
                        setCallback={setGrade}
                        min={1}
                        max={3}
                        placeholder='학년'
                        required
                    />
                    <NumberInput
                        setCallback={setClassNo}
                        min={1}
                        max={4}
                        placeholder='반'
                        required
                    />
                    <NumberInput
                        setCallback={setStudentNo}
                        min={1}
                        max={16}
                        placeholder='번호'
                        required
                    />
                </div>
                <TextInput
                    setCallback={setName}
                    placeholder="이름"
                    full
                    required
                />
            </>)
            case UserRole.TEACHER: return (
                <TextInput
                    setCallback={setEmail}
                    placeholder='학교 이메일 주소'
                    full
                    required
                />
            )
        }
    }

    const findIdFormView = (role: UserRole) => (
        <>
            <form
                className='cols gap-1'
                autoComplete='off'
                onSubmit={e => {
                    e.preventDefault();
                    findIdMail(role);
                }}
            >
                {
                    findIdInputView(role)
                }
                <p>학교 이메일계정으로 복구 메일이 전송됩니다</p>
                <button type='submit' className='button main accent'>복구 메일 전송</button>
            </form>
        </>
    )

    return (
        <Modal type='main' id='findIdMail' title='ID 찾기' menuList={
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
        <Modal type='main' id='resetPwMail' title='비밀번호 복구'>
            <form
                className='cols gap-1 center'
                autoComplete='off'
                onSubmit={e => {
                    e.preventDefault();
                    resetPwMail();
                }}
            >
                <TextInput
                    setCallback={setId}
                    placeholder='복구할 아이디'
                    full
                    required
                />
                <p>학교 이메일계정으로 복구 메일이 전송됩니다</p>
                <button type='submit' className='button main accent'>복구 메일 전송</button>
            </form>
        </Modal>
    );
}