/* 
    问题1:在城市选择中清掉了缓存,则后面页面获取的数据有问题
    问题2:如果在city中修改了当前定位的城市，那么首页就不需要调用百度地图，
          直接使用修改的城市即可 
    解决:1.优先从本地存储中获取当前城市信息
         2.如果没有获取到,调用百度地图的API,去定位当前城市
         3.如果有,直接返回该城市信息
         4.根据定位当前城市的name发送Ajax请求,得到真实的真实信息,
           存到本地再返回
           问题:定位发请求是异步的,拿不到返回值
           解决:方法一:使用回调函数 问题:如果回调嵌套过多,造成回调地狱
               方法二:用promise
           优化:在promise中传入回调函数,两种方法均可调用实现
         5.Home/index.js中修改类似逻辑的代码
          直接调用即可
*/
import axios from 'axios';

//将本地存储当前城市统一变量暴露出去
const CURRENT_CITY = 'currentCity';
export function setCity(city) {
	localStorage.setItem(CURRENT_CITY, JSON.stringify(city));
}

//方法二:promise
export function getCurrentCity(callback) {
	return new Promise((resolve, reject) => {
		const currentCity = JSON.parse(localStorage.getItem(CURRENT_CITY));
		if (currentCity) {
			resolve(currentCity);
			callback && callback(currentCity);
		} else {
			const MyCity = new window.BMap.LocalCity();
			MyCity.get((result) => {
				axios
					.get('http://localhost:8080/area/info?name=' + result.name)
					.then((res) => {
						const { body } = res.data;
						// localStorage.setItem('currentCity', JSON.stringify(body));
						setCity(body);
						resolve(body);
						callback && callback(body);
					})
					.catch((err) => {
						reject(err);
						callback && callback(err);
					});
			});
		}
	});
}

//方法一:回调函数
// export function getCurrentCity(callback) {
// 	// console.log('当前城市');
// 	const currentCity = JSON.parse(localStorage.getItem('currentCity'));
// 	if (currentCity) {
// 		callback(currentCity);
// 	} else {
// 		const MyCity = new window.BMap.LocalCity();
// 		MyCity.get(async (result) => {
// 			// console.log(result);
// 			const res = await axios.get(
// 				'http://localhost:8080/area/info?name=' + result.name
// 			);
// 			// console.log(res);
// 			const { status, body } = res.data;
// 			if (status === 200) {
// 				localStorage.setItem('currentCity', JSON.stringify(body));
// 				callback(body);
// 			}
// 		});
// 	}
// }
