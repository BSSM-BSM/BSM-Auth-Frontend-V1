import styles from '../../styles/user.module.css';
import { NextPage } from 'next';
import { useRecoilState } from 'recoil';
import { showLoginBoxState, userState } from '../../store/account.store';
import { useEffect, useState } from 'react';
import { ajax } from '../../utils/ajax';
import UserPopup from '../../components/popup/userPopup';
import { showUpdateNicknameBoxState, showUpdatePwBoxState } from '../../store/user.store copy';

const UserProfilePage: NextPage = () => {
    const [user] = useRecoilState(userState);
    const [, setShowLoginBox] = useRecoilState(showLoginBoxState);
    const [userInfo, setUserInfo] = useState<UserInfo>({
        usercode: 0,
        createdAt: '',
        nickname: '',
        student: {
            enrolledAt: 0,
            grade: 0,
            classNo: 0,
            studentNo: 0,
            name: ''
        }
    });
    const [detailDate, setDetailDate] = useState(false);

    const [, setShowUpdateNicknameBox] = useRecoilState(showUpdateNicknameBoxState);
    const [, setShowUpdatePwBox] = useRecoilState(showUpdatePwBoxState);

    interface UserInfo {
        usercode: number,
        createdAt: string,
        nickname: string,
        student: {
            enrolledAt: number,
            grade: number,
            classNo: number,
            studentNo: number,
            name: string
        }
    }

    useEffect(() => {
        ajax<UserInfo>({
            setShowLoginBox,
            method: 'get',
            url: 'user',
            callback(data) {
                setUserInfo(data);
            },
        });
    }, [user]);

    return (
        <div className='container _50'>
            <UserPopup />
        {
            userInfo.usercode !== 0 &&
            <div>
                <img src='/icons/profile_default.png' alt='user profile' className={`${styles.user_profile} ${styles.big}`} />
                <br /><br />
                <p className={`${styles.user_nickname_edit_wrap} bold`}>
                    <span>{userInfo.nickname}</span>
                    <button className='edit_button' onClick={() => setShowUpdateNicknameBox(true)}></button>
                </p>
                <ul className='list-wrap left'>
                    <li>
                        <h3>유저 정보</h3>
                        <ul className='list'>
                            <li className='detail'>
                                <span>유저 코드</span>
                                <span>{userInfo.usercode}</span>
                            </li>
                            <li className='detail'>
                                <span>가입 날짜</span>
                                <span>{
                                    detailDate?
                                    new Date(userInfo.createdAt).toLocaleString():
                                    new Date(userInfo.createdAt).toLocaleDateString()
                                }</span>
                                {!detailDate && <span onClick={() => setDetailDate(true)}>자세히 보기</span>}
                            </li>
                            <li className='detail'>
                                <span>이름</span>
                                <span>{userInfo.student.name}</span>
                            </li>
                            <li className='detail'>
                                <span>학반번호</span>
                                <span>{`${userInfo.student.grade}학년 ${userInfo.student.classNo}반 ${userInfo.student.studentNo}번`}</span>
                            </li>
                            <li className='detail'>
                                <span>입학 연도</span>
                                <span>{`${userInfo.student.enrolledAt}년`}</span>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <h3>설정</h3>
                        <ul className='list'>
                            <li className='pointer' onClick={() => setShowUpdateNicknameBox(true)}>닉네임 변경</li>
                            <li className='pointer' onClick={() => setShowUpdatePwBox(true)}>비밀번호 변경</li>
                            <li className='detail'>
                                <span>연결된 서비스 관리</span>
                                <span>(준비중)</span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        }</div>
    );
}

export default UserProfilePage;