import axios from 'axios';
import BASE_URL from './config';
import { getToken } from 'utils/token';
import { removeToken } from 'utils/token';

/* http是axios创建出来的一个实例,他拥有和axios一样的功能,好处是不会影响全局的axios */
const http = axios.create({
	baseURL: BASE_URL,
});
//统一处理token请求拦截器
http.interceptors.request.use((config) => {
	// console.log(config);
	if (
		config.url.startsWith('/user') &&
		config.url !== '/user/login' &&
		config.url !== 'user/registered'
	) {
		//如果请求的路径是以/user开头,且除去登录页和注册页统一添加token,可以拦截出租页
		config.headers.authorization = getToken();
	}
	return config;
});
//配置响应拦截器--统一处理失效或假token
http.interceptors.response.use((res) => {
	// console.log(res);
	const { status, description } = res.data;
	if (status === 400 && description === 'token异常或者过期') {
		removeToken();
	}
	return res.data;
});

export default http;
