import { useRecoilState } from "recoil";
import { loadingState, toastCountState, toastState } from "../store/overlay.store";

interface UseOverlay {
    loading: (flag: boolean) => void;
    showToast: (msg: string) => Promise<void>;
}

export const useOverlay = (): UseOverlay => {
    const [, setLoading] = useRecoilState(loadingState);
    const [, setToastList] = useRecoilState(toastState);
    const [toastCount, setToastCount] = useRecoilState(toastCountState);

    const loading = (flag: boolean) => {
        setLoading(() => flag);
    }

    const showToast = async (msg: string) => {
        let index = toastCount;
        setToastCount(prev => ++prev);

        setToastList(prev => {
            return {...prev, [index]: {
                id: index,
                status: 'active',
                msg
            }}
        });
        await new Promise((resolve) => setTimeout(() => {resolve(true)}, 5000));
        setToastList(prev => {
            return {
                ...prev,
                [index]: {
                    ...prev[index],
                    status: 'hide'
                }
            };
        });
        await new Promise((resolve) => setTimeout(() => {resolve(true)}, 200));
        setToastList(prev => {
            const {[index]: exclude, ...list} = prev;
            return list;
        });
    }

    return {
        loading,
        showToast
    }
}