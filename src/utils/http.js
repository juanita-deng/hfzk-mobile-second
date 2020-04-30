import axios from 'axios';
import BASE_URL from './config';

/* http是axios创建出来的一个实例,他拥有和axios一样的功能,好处是不会影响全局的axios */
const http = axios.create({
	baseURL: BASE_URL,
});

//配置响应拦截器
http.interceptors.response.use((res) => res.data);

export default http;
