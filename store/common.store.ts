import { atom } from "recoil";
import { localStorageEffect } from "../utils/localStorage";

export const themeState = atom<string>({
    key: 'theme',
    default: 'dark',
    effects: [localStorageEffect('theme', 'string')?? 'dark']
});

export const screenScaleState = atom<number>({
    key: 'screenScale',
    default: 100,
    effects: [localStorageEffect('screenScale', 'number')?? 100]
});

export interface headerOption {
    title: string,
    allMenu?: {
        goBack?: boolean;
        dropdownMenu?: DropdownMenuOption[];
    },
    optionMenu?: {
        dropdownMenu?: DropdownMenuOption[];
    }
}

export interface DropdownMenuOption {
    text: string,
    callback: () => void
};

export const headerOptionState = atom<headerOption>({
    key: 'title',
    default: {
        title: '',
        allMenu: undefined,
        optionMenu: undefined
    }
});