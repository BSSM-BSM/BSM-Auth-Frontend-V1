import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { HeaderOptionState } from "@/types/common/header.type";
import { PageState } from "@/types/page.type";

export const themeState = atomWithStorage<string>('theme', 'dark');

export const screenScaleState = atomWithStorage<number>('screenScale', 100);

export const headerOptionState = atom<HeaderOptionState>({
  title: '',
  headTitle: '',
  optionMenu: undefined
});

export const pageState = atom<PageState>({
  id: null
});

export const sideBarState = atom<boolean>(false);
