import styles from '../../styles/user-search.module.css';
import { useState } from "react";
import { Student, Teacher, UserRole } from "../../types/user.type";
import Image from 'next/image';
import DefaultProfilePic from '../../public/icons/profile_default.png';

interface SearchUserInfoProps {
  user: Student | Teacher
}

export const SearchUserInfo = ({
  user
}: SearchUserInfoProps) => (<li>
  <div className={styles.profile_wrap}>
    <Image
      src={user.profileUrl ?? DefaultProfilePic}
      width='64'
      height='64'
      alt='user profile'
    />
    <div className='cols flex-main space-between'>
      <h3>{user.nickname}</h3>
      <div>
        {user.role === UserRole.STUDENT && <>
          <p>{user.student.name} 학생</p>
          <p>{`${user.student.grade}학년 ${user.student.classNo}반 ${user.student.studentNo}번`}</p>
        </>}
        {user.role === UserRole.TEACHER && <>
          <p>{user.teacher.name} 선생님</p>
        </>}
      </div>
    </div>
  </div>
  <ul className='list-wrap left'>
    <li>
      <h3>닉네임 기록</h3>
      <ul className='list'>
        {user.nicknameHistory?.map(history => (
          <li key={`${history.nickname}-${history.modifiedAt}`}>
            <span>{history.nickname}</span>
            <span></span>
            <span>{new Date(history.modifiedAt).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </li>
  </ul>
</li>);