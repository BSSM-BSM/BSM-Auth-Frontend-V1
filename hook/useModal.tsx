import { useRecoilState } from "recoil";
import { modalState } from "../store/modal.store";

interface UseModal {
    openModal: (key: string) => void;
    closeModal: (key: string) => void;
}

export const useModal = (): UseModal => {
    const [modalList, setModalList] = useRecoilState(modalState);

    const openModal = (key: string) => {
        setModalList(prev => ({
            ...prev,
            [key]: true
        }));
    }

    const closeModal = (key: string) => {
        setModalList(prev => {
            const { [key]: exclude, ...modals } = prev;
            return modals;
        });
    }

    return {
        openModal,
        closeModal
    }
}