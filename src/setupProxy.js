const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
	app.use(
		'/api', //匹配到所有以'/api'开头的请求
		createProxyMiddleware({
			target: 'http://localhost:8080',
			changeOrigin: true, //修改请求头里host属性
			pathRewrite: { '^/api': '' }, //路径重写 如果你不想始终传递 /api ，则需要重写路径 webpack.devserver.proxy配置
			secure: true, //配置以https开头的代理
		})
	);
};
