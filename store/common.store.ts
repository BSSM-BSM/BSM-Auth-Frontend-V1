import { atom } from "recoil";
import { localStorageEffect } from "../utils/localStorage";

export const themeState = atom<string>({
    key: 'theme',
    default: 'dark',
    effects: [localStorageEffect('theme', false)?? 'dark']
});