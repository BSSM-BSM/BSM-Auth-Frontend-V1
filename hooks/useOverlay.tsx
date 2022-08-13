import { useRecoilState } from "recoil";
import { loadingState } from "../store/overlay.store";

interface UseOverlay {
    loading: (flag: boolean) => void;
}

export const useOverlay = (): UseOverlay => {
    const [, setLoading] = useRecoilState(loadingState);

    const loading = (flag: boolean) => {
        setLoading(() => flag);
    }

    return {
        loading
    }
}