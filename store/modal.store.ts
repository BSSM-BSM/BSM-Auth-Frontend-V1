import { atom } from "recoil";

export interface ModalState {
  [index: string]: {
    isOpen: boolean,
    closeable: boolean,
    props?: unknown
  }
}

export const modalState = atom<ModalState>({
  key: 'modalState',
  default: {}
});