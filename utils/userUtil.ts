import { SetterOrUpdater } from "recoil";
import { Ajax, HttpMethod } from "../hooks/useAjax";
import { NoLoginUser, Student, Teacher } from "../types/userType";

export const getUserInfo = (ajax: Ajax, setUser: SetterOrUpdater<NoLoginUser| Student| Teacher>) => {
    localStorage.removeItem('user');
    ajax<Student | Teacher>({
        method: HttpMethod.GET,
        url: 'user',
        callback(data) {
            const userInfo: (Student| Teacher) = {...data, isLogin: true};
            setUser(userInfo);
        },
        errorCallback(data) {
            if (data && 'statusCode' in data && data.statusCode === 401) {
                return true;
            }
        }
    });
}