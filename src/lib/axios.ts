import axios from "axios";
import {logout} from "./keycloak";

const baseUrl = 'http://localhost:20005' // import.meta.env.VITE_API_ROOT as string;

const axiosIns = axios.create({
    baseURL: baseUrl,
});

axiosIns.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        // const authStore = useAuthStore();
        if (
            error.response &&
            error.response.status === 401 &&
            error.message === "Unauthorized"
        ) {
            logout();
        }
        return Promise.reject(error);
    }
);

export const setAxiosAuthHeader = (token: string) => {
    axiosIns.defaults.headers.common.Authorization = "Bearer " + token;
};

export default axiosIns;