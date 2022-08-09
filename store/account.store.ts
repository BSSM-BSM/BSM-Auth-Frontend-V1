import { atom } from "recoil";

export interface User {
    code: number,
    level: number,
    nickname: string,
    uniqNo: string,
    enrolledAt: number,
    grade: number,
    classNo: number,
    studentNo: number,
    name: string
}

export const userState = atom<User>({
    key: 'user',
    default: {
        code: 0,
        level: -1,
        nickname: '',
        uniqNo: '',
        enrolledAt: 0,
        grade: 0,
        classNo: 0,
        studentNo: 0,
        name: ''
    }
});

export const showLoginBoxState = atom<boolean>({
    key: 'showLoginBox',
    default: false
});