import axios, { AxiosError, AxiosPromise } from "axios";
import { useModal } from "../hook/useModal";

const instance = axios.create({
    baseURL:'/api',
    headers: {
        'Pragma': 'no-cache'
    },
    timeout:3000,
});

interface ErrorResType {
    statusCode: number,
    message: string
}

export const ajax = async <T>({
    method,
    url,
    payload,
    config,
    callback,
    errorCallback,
}: {
    method: string,
    url: string,
    payload?: object,
    config?: object,
    callback?: (data: T) => void,
    errorCallback?: (data: ErrorResType | void) => boolean | void
}): Promise<void> => {
    
    let res;
    try {
        const get = (): AxiosPromise<T> => {
            switch (method) {
                case 'get': return instance.get(url, config);
                case 'post': return instance.post(url, payload, config);
                case 'put': return instance.put(url, payload, config);
                case 'delete': return instance.delete(url, config);
                default: throw new Error();
            }
        }
        res = (await get()).data;
    } catch (err) {
        console.log(err);
        if (!(err instanceof AxiosError) || !err.response) {
            alert('알 수 없는 에러가 발생하였습니다');
            errorCallback && errorCallback();
            return;
        };
        if (!err.response.data) {
            alert(err.message);
            errorCallback && errorCallback();
            return;
        }
        if (!err.response.data.statusCode) {
            if (err.response.status == 429) {
                alert('잠시 후에 다시 시도해주세요.');
            } else {
                alert(`HTTP ERROR ${err.response.status}`);
            }
            errorCallback && errorCallback(err.response.data);
            return;
        }

        if (errorCallback && errorCallback(err.response.data)) {
            return;
        }
        switch (err.response.data.statusCode) {
            case 401:
                const { openModal } = useModal();
                openModal('loginBox');
                break;
            default:
                alert(`에러코드: ${err.response.data.statusCode} ${err.response.data.message}`);
        }
        return;
    }
    try {
        if (callback) {
            callback(res);
        }
    } catch (err) {
        console.log(err);
        return;
    }
}