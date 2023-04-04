export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER'
}

export interface NoLoginUser {
  isLogin: false
}

interface LoginUser {
  isLogin: true,
  code: number,
  nickname: string,
  email: string,
  createdAt: string,
  role: UserRole,
  profileUrl: string
}

export interface Student extends LoginUser {
  role: UserRole.STUDENT,
  student: StudentInfo,
  nicknameHistory?: NicknameHistory[]
}

export interface Teacher extends LoginUser {
  role: UserRole.TEACHER,
  teacher: TeacherInfo,
  nicknameHistory?: NicknameHistory[]
}

export interface StudentInfo {
  name: string
  enrolledAt: number,
  grade: number,
  classNo: number,
  studentNo: number,
}

export interface TeacherInfo {
  name: string
}

export interface NicknameHistory {
  nickname: string,
  modifiedAt: string
}
