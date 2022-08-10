import { useState } from "react";
import { useRecoilState } from "recoil";
import { showLoginBoxState, User, userState } from "../../store/account.store";
import { showUpdateNicknameBoxState, showUpdatePwBoxState } from "../../store/user.store copy";
import { ajax } from "../../utils/ajax";
import { decodeBase64 } from "../../utils/util";
import Modal from "../common/Modal";

const UserPopup = () => {

    return (
        <div className="user-popup">
            {updateNicknameBox()}
            {updatePwBox()}
        </div>
    );
}

const updatePwBox = () => {
    const [, setShowLoginBox] = useRecoilState(showLoginBoxState);
    const [showUpdatePwBox, setShowUpdatePwBox] = useRecoilState(showUpdatePwBoxState);
    const [newPw, setNewPw] = useState('');
    const [checkNewPw, setCheckNewPw] = useState('');

    const updatePw = () => {
        if (!confirm('닉네임을 변경하시겠습니까?')) {
            return;
        }
        ajax<{accessToken: string}>({
            setShowLoginBox,
            method: 'put',
            url: '/user/pw',
            payload: {
                newPw,
                checkNewPw
            },
            callback: (data) => {
                alert('비밀번호 재설정이 완료되었습니다');
                setShowUpdatePwBox(false);
            }
        });
    }

    return (
        <Modal type="main" active={showUpdatePwBox} setActive={setShowUpdatePwBox} title="비밀번호 재설정">
            <form
                autoComplete="off"
                onSubmit={e => {
                    e.preventDefault();
                    updatePw();
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
    );
}

const updateNicknameBox = () => {
    const [, setUser] = useRecoilState(userState);
    const [, setShowLoginBox] = useRecoilState(showLoginBoxState);
    const [showUpdateNicknameBox, setShowUpdateNicknameBox] = useRecoilState(showUpdateNicknameBoxState);
    const [newNickname, setNewNickname] = useState('');

    const updateNickname = () => {
        if (!confirm('닉네임을 변경하시겠습니까?')) {
            return;
        }
        ajax<{accessToken: string}>({
            setShowLoginBox,
            method: 'put',
            url: '/user/nickname',
            payload: {
                newNickname
            },
            callback: (data) => {
                alert('닉네임 변경이 완료되었습니다');
                const userInfo = JSON.parse(decodeBase64(data.accessToken.split('.')[1])) as User;
                setUser({
                    ...userInfo,
                    isLogin: true
                });
                setShowUpdateNicknameBox(false);
            }
        });
    }

    return (
        <Modal type="main" active={showUpdateNicknameBox} setActive={setShowUpdateNicknameBox} title="닉네임 변경">
            <form
                autoComplete="off"
                onSubmit={e => {
                    e.preventDefault();
                    updateNickname();
                }}
            >
                <input
                    type="text"
                    className="input-text"
                    placeholder="변경할 닉네임"
                    required
                    onChange={e => {
                        e.preventDefault();
                        setNewNickname(e.target.value);
                    }}
                />
                <button type="submit" className="button main accent">닉네임 변경</button>
            </form>
        </Modal>
    );
}

export default UserPopup;