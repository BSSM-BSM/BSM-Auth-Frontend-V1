import { atom } from "recoil";

export const showUpdateNicknameBoxState = atom<boolean>({
    key: 'showUpdateNicknameBox',
    default: false
});

export const showUpdatePwBoxState = atom<boolean>({
    key: 'showUpdatePwBox',
    default: false
});