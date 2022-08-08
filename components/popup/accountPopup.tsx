import React, { useState } from "react";
import Modal from "../common/Modal";

const AccountPopup = () => {
    return (
        <div className="account-popup">
            {loginBox()}
        </div>
    );
}

const loginBox = () => {
    const [showLoginBox, setShowLoginBox] = useState(true);
    const title = (
        <>
            <img src="/logo/logo.png" alt="logo" className="logo" />
            <br />
            <span>로그인</span>
        </>
    )
    return (
        <Modal type="main" active={showLoginBox} setActive={setShowLoginBox} title={title}>
            <form autoComplete="off">
                <input name="id" type="text" className="input-text" placeholder="아이디" required />
                <div className="modal--bottom-menu-box">
                    <span>회원가입</span>
                    <span>비밀번호 복구</span>
                    <span>ID 찾기</span>
                </div>
                <button type="submit" className="button main accent">다음</button>
            </form>
        </Modal>
    );
}

export default AccountPopup;