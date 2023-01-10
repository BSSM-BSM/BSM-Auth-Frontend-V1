import { useState } from "react";
import { useRecoilState } from "recoil";
import { HttpMethod, useAjax } from "../../hooks/useAjax";
import { useModal } from "../../hooks/useModal";
import { useOverlay } from "../../hooks/useOverlay";
import { userState } from "../../store/account.store";
import { getUserInfo } from "../../utils/userUtil";
import { decodeBase64 } from "../../utils/util";
import { Button } from "../common/buttons/button";
import { TextInput } from "../common/inputs/textInput";
import Modal from "../common/modal";

export const UserPopup = () => {

  return (
    <>
      <UpdatePwBox />
      <UpdateNicknameBox />
    </>
  );
}

const UpdatePwBox = () => {
  const { ajax } = useAjax();
  const { closeModal } = useModal();
  const { showToast } = useOverlay();
  const [newPw, setNewPw] = useState('');
  const [checkNewPw, setCheckNewPw] = useState('');

  const updatePw = async () => {
    if (!confirm('닉네임을 변경하시겠습니까?')) {
      return;
    }
    const [, error] = await ajax<{ accessToken: string }>({
      method: HttpMethod.PUT,
      url: '/user/pw',
      payload: {
        newPw,
        checkNewPw
      }
    });
    if (error) return;

    showToast('비밀번호 재설정이 완료되었습니다');
    closeModal('updatePw');
  }

  return (
    <Modal type="main" id="updatePw" title="비밀번호 재설정">
      <form
        className='cols gap-1'
        autoComplete="off"
        onSubmit={e => {
          e.preventDefault();
          updatePw();
        }}
      >
        <TextInput
          type='password'
          setCallback={setNewPw}
          placeholder="재설정할 비밀번호"
          full
          required
        />
        <TextInput
          type='password'
          setCallback={setCheckNewPw}
          placeholder="재설정할 비밀번호 재입력"
          full
          required
        />
        <Button type="submit" className="accent" full>비밀번호 재설정</Button>
      </form>
    </Modal>
  );
}

const UpdateNicknameBox = () => {
  const { ajax } = useAjax();
  const { closeModal } = useModal();
  const { showToast } = useOverlay();
  const [, setUser] = useRecoilState(userState);
  const [newNickname, setNewNickname] = useState('');

  const updateNickname = async () => {
    if (!confirm('닉네임을 변경하시겠습니까?')) {
      return;
    }
    const [, error] = await ajax<{ accessToken: string }>({
      method: HttpMethod.PUT,
      url: '/user/nickname',
      payload: {
        newNickname
      }
    });
    if (error) return;
    
    showToast('닉네임 변경이 완료되었습니다');
    getUserInfo(ajax, setUser);
    closeModal('updateNickname')
  }

  return (
    <Modal type="main" id="updateNickname" title="닉네임 변경">
      <form
        className='cols gap-1'
        autoComplete="off"
        onSubmit={e => {
          e.preventDefault();
          updateNickname();
        }}
      >
        <TextInput
          setCallback={setNewNickname}
          placeholder="변경할 닉네임"
          full
          required
        />
        <Button type="submit" className="accent" full>닉네임 변경</Button>
      </form>
    </Modal>
  );
}