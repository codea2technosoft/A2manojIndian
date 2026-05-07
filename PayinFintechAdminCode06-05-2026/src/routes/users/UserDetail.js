import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Descriptions, Button, Divider, Card, Checkbox, Tag, Space, Switch, Table, Modal } from 'antd';
import _ from 'lodash';
import PageTitle from 'components/PageTitle';
import Loading from 'components/Loading';
import { PencilAltIcon, TrashIcon } from '@heroicons/react/outline';
import UserUpdateForm from './UserUpdateForm';
// requests
import { getUser, assignPermissions, updateUser, assignUsersToParent, unassignUsersFromParent } from 'requests/user';
import { getPermissions } from 'requests/permission';

const UserDetail = () => {
	const [loading, setLoading] = useState(true);
	const [record, setRecord] = useState(null);
	const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
	const [permissionGroups, setPermissionGroups] = useState([]);
	const [titles, setTitles] = useState([{ path: '/users', title: 'Users' }]);
	const [visibleUpdateForm, setVisibleUpdateForm] = useState(false);
	const [loadingAssignPermissions, setLoadingAssignPermissions] = useState(false);

	const params = useParams();

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			sorter: true,
			width: 80,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			render: (text, record) => <Link to={`/users/${record.id}`}>{text}</Link>,
			sorter: true,
		},
		{
			title: 'Full Name',
			dataIndex: 'full_name',
			key: 'full_name',
			ellipsis: true,
			width: 200,
		},
		{
			title: 'Role',
			dataIndex: 'role',
			key: 'role',
			render: (text, record) => {
				return <div>{record.role?.name || ''}</div>;
			},
		},
		{
			title: 'Mobile',
			dataIndex: 'mobile',
			key: 'mobile'
		},

		{
			title: 'Email verified',
			dataIndex: 'email_verified_at',
			key: 'email_verified_at',
			render: (text, record) => {
				const date = text?.split(' ')[0];
				const time = text?.split(' ')[1];
				return (
					<Space direction="vertical" align="center">
						<span>{date}</span>
						<span>{time}</span>
					</Space>
				);
			},
		},
		{
			title: 'Mobile verified',
			dataIndex: 'mobile_verified_at',
			key: 'mobile_verified_at',
			render: (text, record) => {
				const date = text?.split(' ')[0];
				const time = text?.split(' ')[1];
				return (
					<Space direction="vertical" align="center">
						<span>{date}</span>
						<span>{time}</span>
					</Space>
				);
			},
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			width: 120,
			render: (text, record) => {
				return (
					<Switch
						checked={text === 0 ? false : true}
						checkedChildren="Active"
						unCheckedChildren="Inactive"
						onChange={(value) => onUpdateStatus(record.id, value)}
					/>
				);
			},
		},
		{
			title: 'Actions',
			render: (text, record) => (
				<Space>
					<Button
						type="link"
						size="small"
						onClick={() => { }}
					>
						<PencilAltIcon width={24} height={24} />
					</Button>
					<Button
						danger
						type="link"
						size="small"
						onClick={() => onUnassign(record.id)}
					>
						<TrashIcon width={24} height={24} />
					</Button>
				</Space>
			),
		},
	];

	useEffect(() => {
		getData();
	}, [params]);

	const getData = async () => {
		try {
			const record = await getUser(params.id);
			setTitles([
				{ path: '/users', title: 'Users' },
				{ path: `/users/${record.id}`, title: record.full_name },
			]);
			setRecord(record);

			if (record.permissions && record.permissions.length) {
				const permissionIds = record.permissions.map((item) => item.id);
				setSelectedPermissionIds(permissionIds);
			}

			// permissions list
			let permissions = await getPermissions();
			setPermissionGroups(_.groupBy(permissions, 'resource'));

			setLoading(false);
		} catch (err) {
			console.log(err);
		}
	};

	const onUpdate = async (data) => {
		try {
			await updateUser(params.id, data);

			getData();
		} catch (err) {
			console.log(err);
		} finally {
		}
	};

	const onTogglePermission = (permissionId) => {
		const permissionIds = [...selectedPermissionIds];
		const index = permissionIds.indexOf(permissionId);

		if (index >= 0) {
			permissionIds.splice(index, 1);
		} else {
			permissionIds.push(permissionId);
		}

		setSelectedPermissionIds(permissionIds);
	};

	const onAssignPermissions = async () => {
		try {
			setLoadingAssignPermissions(true);
			await assignPermissions(params.id, { permission_ids: selectedPermissionIds });
		} catch (err) {
			console.log(err);
		} finally {
			setLoadingAssignPermissions(false);
		}
	};

	const onToggleUpdateForm = () => {
		setVisibleUpdateForm(!visibleUpdateForm);
	};

	const onUnassign = (id) => {
		Modal.confirm({
			title: 'Are you sure to unassign this sub-merchant?',
			onOk: async () => {
				try {
					const userIds = [id];

					await unassignUsersFromParent({
						user_ids: userIds
					});

					getData();
				} catch (err) {
					console.log(err);
				}
			}
		})
	}

	const onUpdateStatus = (id, status) => {
		Modal.confirm({
			title: `Are you sure to ${status ? 'enable' : 'disable'} this user?`,
			onOk: async () => {
				try {
					await updateUser(id, { status: status });

					getData();
				} catch (err) {
					console.log(err);
				}
			}
		})
	}

	return (
		<div>
			{loading ? (
				<Loading />
			) : (
				<React.Fragment>
					<PageTitle titles={titles} />
					<Divider orientation="left" orientationMargin={0}>
						Detail
					</Divider>
					<Row justify="end">
						<Button type="link" onClick={() => onToggleUpdateForm()}>
							<PencilAltIcon width={24} height={24} />
						</Button>
					</Row>
					<Descriptions>
						<Descriptions.Item label="Email">{record.email}</Descriptions.Item>
						<Descriptions.Item label="Full name">{record.full_name}</Descriptions.Item>
						<Descriptions.Item label="Mobile">{record.mobile}</Descriptions.Item>
						<Descriptions.Item label="Role">{record.role?.name}</Descriptions.Item>
						<Descriptions.Item label="Email Verified">{record.email_verified_at}</Descriptions.Item>
						<Descriptions.Item label="Mobile Verified">{record.mobile_verified_at}</Descriptions.Item>
						<Descriptions.Item label="Website">{record.Website}</Descriptions.Item>
						<Descriptions.Item label="Address">{record.Address}</Descriptions.Item>
						<Descriptions.Item label="Pan/GST">{record.PAN_GST}</Descriptions.Item>
						<Descriptions.Item label="Coupon Code">{record.coupon_code}</Descriptions.Item>
						<Descriptions.Item label="Receive updates via whatsapp">
							{record.is_receive_updates_via_whatsapp === 1 ? 'Yes' : 'No'}
						</Descriptions.Item>
						<Descriptions.Item label="Status">
							{record.status === 1 ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>}
						</Descriptions.Item>
						<Descriptions.Item label="Minimum order amount">{record.min_order_amount}</Descriptions.Item>
						<Descriptions.Item label="Maximum order amount">{record.max_order_amount}</Descriptions.Item>
					</Descriptions>

					{/* <Divider orientation="left" orientationMargin={0}>
						Permissions
					</Divider> */}
					{/* <Row gutter={[16, 16]} className="mb-36">
						{Object.keys(permissionGroups).map((group) => (
							<Col lg={8} md={8} sm={12} xs={24} key={group}>
								<Card title={group}>
									{permissionGroups[group].map((permission, index) => (
										<div>
											<Checkbox
												key={index}
												defaultChecked={selectedPermissionIds.includes(permission.id)}
												onChange={() => onTogglePermission(permission.id)}
											>
												{permission.name}
											</Checkbox>
										</div>
									))}
								</Card>
							</Col>
						))}
					</Row> */}
					{/* <Row justify="end" className="mb-36">
						<Button type="primary" loading={loadingAssignPermissions} onClick={onAssignPermissions}>
							Assign permissions
						</Button>
					</Row> */}
					{/* <Divider orientation="left" orientationMargin={0}>
						Stores
					</Divider> */}
					{/* <Divider orientation="left" orientationMargin={0}>
						Sub-merchants
					</Divider> */}
					{/* <Table
						// rowSelection={rowSelection}
						columns={columns}
						dataSource={record.children}
						rowKey="id"
					// onChange={onChangeTable}
					// pagination={{
					// 	pageSize: perPage,
					// 	total: totalCount,
					// 	current: page,
					// }}
					/> */}
					{/* <UserUpdateForm
						visible={visibleUpdateForm}
						record={{ ...record, role: record.role.id }}
						onClose={onToggleUpdateForm}
						onSubmit={onUpdate}
					/> */}
				</React.Fragment>
			)}
		</div>
	);
};

export default UserDetail;
