import { atom } from "recoil";

export const modalState = atom<{
    [index: string]: boolean
}>({
    key: 'modalState',
    default: {}
});