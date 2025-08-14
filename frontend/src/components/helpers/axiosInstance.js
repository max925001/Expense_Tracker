import axios from 'axios';

const BASE_URL = "https://expense-tracker-ti1l.onrender.com/api/"; // Adjust to your backend URL; use https://connectsphere-1.onrender.com/api/ if deployed

const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;

export default axiosInstance;
