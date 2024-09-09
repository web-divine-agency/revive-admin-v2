import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://revive.imseoninja.com/api', // Replace with your backend base URL
    withCredentials: true,  
});

let isRefreshing = false;
let failedQueue = [];

const processTokenQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (token){
            prom.resolve(token);
        } else{
            prom.reject(error); 
        }
    });
    failedQueue = []; 
}

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;


        if (error.response && error.response.status === 401 && !originalRequest._retry) {
 
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {

                const { data } = await axiosInstance.post('/refresh');

                localStorage.setItem('accessToken', data.accessToken);

                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

                processTokenQueue(null, data.accessToken);
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processTokenQueue(refreshError, null);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;