import { useState } from "react";
import { useRecoilState } from "recoil";
import { useModal } from "../../hook/useModal";
import { User, userState } from "../../store/account.store";
import { ajax } from "../../utils/ajax";
import { decodeBase64 } from "../../utils/util";
import Modal from "../common/Modal";

export const UserPopup = () => {

    return (
        <>
            <UpdatePwBox />
            <UpdateNicknameBox />
        </>
    );
}

const UpdatePwBox = () => {
    const { closeModal } = useModal();
    const [newPw, setNewPw] = useState('');
    const [checkNewPw, setCheckNewPw] = useState('');

    const updatePw = () => {
        if (!confirm('닉네임을 변경하시겠습니까?')) {
            return;
        }
        ajax<{accessToken: string}>({
            method: 'put',
            url: '/user/pw',
            payload: {
                newPw,
                checkNewPw
            },
            callback: () => {
                alert('비밀번호 재설정이 완료되었습니다');
                closeModal('updatePw');
            }
        });
    }

    return (
        <Modal type="main" id="updatePw" title="비밀번호 재설정">
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

const UpdateNicknameBox = () => {
    const { closeModal } = useModal();
    const [, setUser] = useRecoilState(userState);
    const [newNickname, setNewNickname] = useState('');

    const updateNickname = () => {
        if (!confirm('닉네임을 변경하시겠습니까?')) {
            return;
        }
        ajax<{accessToken: string}>({
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
                closeModal('updateNickname')
            }
        });
    }

    return (
        <Modal type="main" id="updateNickname" title="닉네임 변경">
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