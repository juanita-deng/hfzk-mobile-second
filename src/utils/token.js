//用于操作token
const TOKEN_NAME = 'hkzf_token';

//单行注释
/* 多行注释 */
/**文档注释,使用时vscode会由提示 */

/**
 * 把token保存到localstorage中
 * @param {string} token 需要保存的token
 */

export function setToken(token) {
	localStorage.setItem(TOKEN_NAME, token);
}
/**
 * 从localstorage中获取token
 * @return 返回的token
 */
export function getToken() {
	return localStorage.getItem(TOKEN_NAME);
}
/**
 * 移除token
 */

export function removeToken() {
	localStorage.removeItem(TOKEN_NAME);
}
/**
 * 判断token是否存在
 * @return {boolean}
 */

export function hasToken() {
	return !!getToken();
}
