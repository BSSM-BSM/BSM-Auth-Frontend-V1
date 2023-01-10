import { useState } from "react";
import { Student, Teacher, UserRole } from "../../types/userType";

interface UserInfoListProps {
  userInfo: Student | Teacher
}

export const UserInfoList = ({
  userInfo
}: UserInfoListProps) => {
  const [detailDate, setDetailDate] = useState(false);

  return (
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
            detailDate ?
              new Date(userInfo.createdAt).toLocaleString() :
              new Date(userInfo.createdAt).toLocaleDateString()
          }</span>
          {!detailDate && <span onClick={() => setDetailDate(true)}>자세히 보기</span>}
        </li>
        {userInfo.role === UserRole.STUDENT && <>
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
        {userInfo.role === UserRole.TEACHER && <>
          <li>
            <span>이름</span>
            <span>{userInfo.teacher.name}</span>
          </li>
        </>}
      </ul>
    </li>
  )
}