import { atom } from "recoil";

export const themeState = atom<string>({
    key: 'theme',
    default: 'dark'
});