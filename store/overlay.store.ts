import { atom } from "recoil";

export const loadingState = atom<boolean>({
    key: 'loadingState',
    default: false
});

export const toastState = atom<{
    [index: number]: {
        id: number,
        status: string,
        msg: string
    }
}>({
    key: 'toastState',
    default: {}
});

export const toastCountState = atom<number>({
    key: 'toastCountState',
    default: 0
});