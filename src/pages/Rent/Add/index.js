import React, { Component } from 'react';
import {
	Flex,
	List,
	InputItem,
	Picker,
	ImagePicker,
	TextareaItem,
	Toast,
} from 'antd-mobile';
import NavHeader from 'common/navHeader';
import HousePackge from 'common/HousePackage';
import styles from './index.module.scss';
import http from 'utils/http';

// 房屋类型
const roomTypeData = [
	{ label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
	{ label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
	{ label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
	{ label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
	{ label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' },
];

// 朝向：
const orientedData = [
	{ label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
	{ label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
	{ label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
	{ label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
	{ label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
	{ label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
	{ label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
	{ label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' },
];

// 楼层
const floorData = [
	{ label: '高楼层', value: 'FLOOR|1' },
	{ label: '中楼层', value: 'FLOOR|2' },
	{ label: '低楼层', value: 'FLOOR|3' },
];

export default class RentAdd extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// 小区的名称和id
			community: {
				name: '',
				id: '',
			},
			// 价格
			price: '',
			// 面积
			size: '',
			// 房屋类型
			roomType: [],
			// 楼层
			floor: [],
			// 朝向：
			oriented: [],
			// 房屋标题
			title: '',
			// 房屋图片
			houseImg: [],
			// 房屋配套：
			supporting: '',
			// 房屋描述
			description: '',
		};
	}
	componentDidMount() {
		// console.log(this.props);
		const { state } = this.props.location;
		if (state) {
			this.setState({
				community: state,
			});
		}
	}
	//添加房源提交按钮
	addHouse = async () => {
		//处理图片上传
		let fd = new FormData();
		this.state.houseImg.forEach((v) => {
			fd.append('file', v.file);
		});
		//发送请求上传图片
		const res = await http.post('/houses/image', fd);
		let imgData = res.body;
		console.log(this.state);
		const {
			community,
			price,
			roomType,
			floor,
			oriented,
			description,
			supporting,
			size,
			title,
		} = this.state;
		//发送请求添加房源
		const res2 = await http.post('/user/houses', {
			description,
			title,
			houseImg: imgData.join('|'),
			oriented: oriented[0],
			supporting,
			price,
			roomType: roomType[0],
			size,
			floor: floor[0],
			community: community.id,
		});
		if (res2.status === 200) {
			Toast.success('发布成功');
			this.props.history.push('/rent');
		}
	};
	//配套信息逻辑
	onSelect = (active) => {
		// console.log(active);
		this.setState({
			supporting: active.join('|'),
		});
	};
	handImg = (files, type, index) => {
		console.log(files, type, index);
		this.setState({
			houseImg: files,
		});
	};
	handleChange = (params, val) => {
		// console.log(params, val);
		this.setState({
			[params]: val,
		});
	};
	render() {
		const Item = List.Item;
		const { history } = this.props;
		const {
			community,
			price,
			roomType,
			floor,
			oriented,
			description,
			houseImg,
			size,
			title,
		} = this.state;

		return (
			<div className={styles['rent-add']}>
				<NavHeader className="NavHeader">发布房源</NavHeader>

				<List className="header" renderHeader={() => '房源信息'}>
					{/* 选择所在小区 */}
					<Item
						extra={community.name || '请输入小区名称'}
						arrow="horizontal"
						onClick={() => history.replace('/rent/search')}
					>
						小区名称
					</Item>
					<InputItem
						placeholder="请输入租金/月"
						extra="￥/月"
						onChange={this.handleChange.bind(this, 'price')}
						value={price}
					>
						租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
					</InputItem>
					<InputItem
						placeholder="请输入建筑面积"
						onChange={this.handleChange.bind(this, 'size')}
						value={size}
						extra="㎡"
					>
						建筑面积
					</InputItem>
					<Picker
						data={roomTypeData}
						onChange={this.handleChange.bind(this, 'roomType')}
						value={roomType}
						cols={1}
					>
						<Item arrow="horizontal">
							户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
						</Item>
					</Picker>

					<Picker
						data={floorData}
						onChange={this.handleChange.bind(this, 'floor')}
						value={floor}
						cols={1}
					>
						<Item arrow="horizontal">所在楼层</Item>
					</Picker>
					<Picker
						data={orientedData}
						onChange={this.handleChange.bind(this, 'oriented')}
						value={oriented}
						cols={1}
					>
						<Item arrow="horizontal">
							朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
						</Item>
					</Picker>
				</List>

				<List className="title" renderHeader={() => '房屋标题'}>
					<InputItem
						placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
						value={title}
						onChange={this.handleChange.bind(this, 'title')}
					/>
				</List>

				<List className="pics" renderHeader={() => '房屋图像'}>
					<ImagePicker
						files={houseImg}
						onChange={this.handImg}
						multiple={true}
						className="imgpicker"
					/>
				</List>

				<List className="supporting" renderHeader={() => '房屋配置'}>
					{/* <HousePackge list={['空调']} /> */}
					<HousePackge onSelect={this.onSelect} />
				</List>

				<List className="desc" renderHeader={() => '房屋描述'}>
					<TextareaItem
						rows={5}
						placeholder="请输入房屋描述信息"
						autoHeight
						value={description}
						onChange={this.handleChange.bind(this, 'description')}
					/>
				</List>

				<Flex className="bottom">
					<Flex.Item className="cancel" onClick={this.onCancel}>
						取消
					</Flex.Item>
					<Flex.Item className="confirm" onClick={this.addHouse}>
						提交
					</Flex.Item>
				</Flex>
			</div>
		);
	}
}
