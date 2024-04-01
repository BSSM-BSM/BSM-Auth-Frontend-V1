import { atom } from "recoil";
import { HeaderOptionState } from "@/types/common/header.type";
import { PageState } from "@/types/page.type";
import { localStorageEffect, LocalStorageType } from "@/utils/localStorage";

export const themeState = atom<string>({
  key: 'theme',
  default: 'dark',
  effects: [localStorageEffect({
    key: 'theme',
    type: LocalStorageType.string,
    defaultValue: 'dark'
  })]
});

export const screenScaleState = atom<number>({
  key: 'screenScale',
  default: 100,
  effects: [localStorageEffect({
    key: 'screenScale',
    type: LocalStorageType.number,
    defaultValue: 100
  })]
});

export const headerOptionState = atom<HeaderOptionState>({
  key: 'title',
  default: {
    title: '',
    headTitle: '',
    optionMenu: undefined
  }
});

export const pageState = atom<PageState>({
  key: 'page',
  default: {
    id: null
  }
});

export const sideBarState = atom<boolean>({
  key: 'sideBar',
  default: false
});

export const aprilFool2024State = atom<boolean>({
  key: 'aprilFool2024',
  default: false,
  effects: [localStorageEffect({
    key: 'aprilFool2024',
    type: LocalStorageType.boolean,
    defaultValue: false
  })]
});
