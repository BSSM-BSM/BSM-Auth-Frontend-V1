import styles from '../../styles/user.module.css';
import { NextPage } from 'next';
import { useRecoilState } from 'recoil';
import { userState } from '../../store/account.store';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { UserPopup } from '../../components/user/userPopup';
import { useModal } from '../../hooks/useModal';
import { HttpMethod, useAjax } from '../../hooks/useAjax';
import { headerOptionState } from '../../store/common.store';
import { useOverlay } from '../../hooks/useOverlay';
import Image, { StaticImageData } from 'next/image';
import DefaultProfilePic from '../../public/icons/profile_default.png';

const UserProfilePage: NextPage = () => {
    const [, setHeaderOption] = useRecoilState(headerOptionState);
    const {ajax} = useAjax();
    const {openModal} = useModal();
    const {showToast} = useOverlay();
    const [user] = useRecoilState(userState);
    const [userInfo, setUserInfo] = useState<UserInfo>({
        code: 0,
        createdAt: '',
        nickname: ''
    });
    const [detailDate, setDetailDate] = useState(false);
    const profileInputRef = useRef<HTMLInputElement>(null);
    const [profileSrc, setProfileSrc] = useState<string | StaticImageData>(DefaultProfilePic);

    interface UserInfo {
        code: number,
        createdAt: string,
        nickname: string,
        student?: {
            enrolledAt: number,
            grade: number,
            classNo: number,
            studentNo: number,
            name: string
        },
        teacher?: {
            name: string
        }
    }

    useEffect(() => {
        setHeaderOption({title: '유저 정보'});
    }, []);

    useEffect(() => {
        ajax<UserInfo>({
            method: HttpMethod.GET,
            url: 'user',
            callback(data) {
                setUserInfo(data);
                setProfileSrc(`https://auth.bssm.kro.kr/resource/user/profile/${data.code}.png`);
            },
        });
    }, [user]);

    const profileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        ajax({
            url: 'user/profile',
            method: HttpMethod.POST,
            payload: formData,
            callback() {
                e.target.files = null;
                showToast('프로필 이미지 업로드에 성공하였습니다\n모든 서비스에 적용되기까지 시간이 걸릴 수 있습니다');
            }
        });
    }

    return (
        <div className='container _50'>
            <UserPopup />
        {
            userInfo.code !== 0 &&
            <div>
                <div className={styles.user_profile_wrap} onClick={() => profileInputRef.current?.click()}>
                    <div className='user-profile'>
                        <Image
                            src={profileSrc}
                            onError={() => setProfileSrc(DefaultProfilePic)}
                            width='128px'
                            height='128px'
                            alt='user profile'
                        />
                    </div>
                    <input ref={profileInputRef} type="file" onChange={profileUpload} style={{display: 'none'}} />
                </div>
                <br /><br />
                <h2 className='bold'>{userInfo.nickname}</h2>
                <ul className='list-wrap left'>
                    <li>
                        <h3>유저 정보</h3>
                        <ul className='list'>
                            <li>
                                <span>유저 코드</span>
                                <span>{userInfo.code}</span>
                            </li>
                            <li>
                                <span>가입 날짜</span>
                                <span>{
                                    detailDate?
                                    new Date(userInfo.createdAt).toLocaleString():
                                    new Date(userInfo.createdAt).toLocaleDateString()
                                }</span>
                                {!detailDate && <span onClick={() => setDetailDate(true)}>자세히 보기</span>}
                            </li>
                            {userInfo.student && <>
                                <li>
                                    <span>이름</span>
                                    <span>{userInfo.student.name}</span>
                                </li>
                                <li>
                                    <span>학반번호</span>
                                    <span>{`${userInfo.student.grade}학년 ${userInfo.student.classNo}반 ${userInfo.student.studentNo}번`}</span>
                                </li>
                                <li>
                                    <span>입학 연도</span>
                                    <span>{`${userInfo.student.enrolledAt}년`}</span>
                                </li>
                            </>}
                            {userInfo.teacher && <>
                                <li>
                                    <span>이름</span>
                                    <span>{userInfo.teacher.name}</span>
                                </li>
                            </>}
                        </ul>
                    </li>
                    <li>
                        <h3>설정</h3>
                        <ul className='list'>
                            <li className='pointer' onClick={() => profileInputRef.current?.click()}>
                                <span>프로필 사진 변경</span>
                            </li>
                            <li className='pointer' onClick={() => openModal('updateNickname')}>
                                <span>닉네임 변경</span>
                            </li>
                            <li className='pointer' onClick={() => openModal('updatePw')}>
                                <span>비밀번호 변경</span>
                            </li>
                            <li>
                                <span>연결된 서비스 관리</span>
                                <span>(준비중)</span>
                            </li>
                            <li className='pointer' onClick={() => openModal('setting')}>
                                <span>다른 설정</span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        }</div>
    );
}

export default UserProfilePage;