import React from 'react';
import styles from './index.module.scss';
import { WhiteSpace, WingBlank, Flex, Toast } from 'antd-mobile';
import NavHeader from 'common/navHeader';
import { Link } from 'react-router-dom';
import { withFormik, Form, Field, ErrorMessage } from 'formik';
import http from 'utils/http';
import { setToken } from 'utils/token';
import * as yup from 'yup'; //表单校验

//只负责渲染
function Login(props) {
	return (
		<div className={styles.login}>
			{/* 顶部导航 */}
			<NavHeader className="navHeader">账号登录</NavHeader>
			{/* 上下留白 */}
			<WhiteSpace size="xl" />

			{/* 登录表单 */}
			<WingBlank>
				<Form>
					<div className="formItem">
						<Field
							className="input"
							autoComplete="off"
							name="username"
							placeholder="请输入账号"
						/>
					</div>
					{/* 长度为5到8位，只能出现数字、字母、下划线 */}
					{/* <div className="error">账号为必填项</div> */}
					<ErrorMessage name="username" className="error" component="div" />
					<div className="formItem">
						<Field
							className="input"
							name="password"
							type="password"
							placeholder="请输入密码"
						/>
					</div>
					{/* 长度为5到12位，只能出现数字、字母、下划线 */}
					{/* <div className="error">账号为必填项</div> */}
					<ErrorMessage name="password" className="error" component="div" />
					{/* 重复密码 */}
					<div className="formItem">
						<Field
							className="input"
							name="repassword"
							type="password"
							placeholder="请确认密码"
						/>
					</div>
					{/* 长度为5到12位，只能出现数字、字母、下划线 */}
					{/* <div className="error">账号为必填项</div> */}
					<ErrorMessage name="repassword" className="error" component="div" />
					<div className="formSubmit">
						<button className="submit" type="submit">
							登 录
						</button>
					</div>
				</Form>
				<Flex className="backHome">
					<Flex.Item>
						<Link to="/registe">还没有账号，去注册~</Link>
					</Flex.Item>
				</Flex>
			</WingBlank>
		</div>
	);
}
// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/;
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/;

//提供校验登陆逻辑
const config = {
	//给表单提供状态
	mapPropsToValues: () => ({
		// return {
		username: '',
		password: '',
		repassword: '',
		// }
	}),
	//表单提交事件
	handleSubmit: async (values, formikBag) => {
		// console.log(values, formikBag);
		//values用户输入的内容  formikBag获取到所有的表单属性
		const { status, body } = await http.post('/user/login', {
			username: values.username,
			password: values.password,
		});
		// console.log(body);
		if (status === 200) {
			// console.log('登陆成功');
			// localStorage.setItem('hkzf_token', body.token);
			setToken(body.token);
			formikBag.props.history.go(-1);
		} else {
			Toast.fail('用户名或密码错误');
		}
	},
	//表单校验
	validationSchema: yup.object().shape({
		username: yup //用户名校验
			.string()
			.matches(REG_UNAME, '用户名长度必须是5-8位，由字母，数字，下划线组成')
			.required('用户名不能为空'),
		password: yup //密码校验
			.string()
			.matches(REG_PWD, '密码长度必须是5-12位，由字母，数字，下划线组成')
			.required('密码不能为空'),
		repassword: yup.string().required('密码不一致,请确认密码'),
	}),
	//重复密码的校验
	validate: (values) => {
		// console.log(values);
		const errors = {};
		if (values.password !== values.repassword) {
			errors.repassword = '密码不一致';
			return errors;
		}
	},
};
export default withFormik(config)(Login);
