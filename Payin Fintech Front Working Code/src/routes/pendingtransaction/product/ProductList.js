import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Space, List, Image, Button, Tooltip } from 'antd';

function ProductList({ data, isShowHeader }) {
	const billingPerson = JSON.parse(data.billing_person);

	return (
		<div>
			{isShowHeader && (
				<Row gutter={[24, 24]}>
					<Col span={1}></Col>
					<Col span={3}>
						<span className="size-16 weight-7 violet-color">{data.items.length} Products</span>
					</Col>
					<Col span={20}>
						<Space direction="vertical">
							<div>
								<span className="size-16 weight-7">Ship to : </span>
								{`${billingPerson.street}, ${billingPerson.stateOrProvinceName},
                            ${billingPerson.city}, ${billingPerson.countryName} `}
							</div>
							<div>
								<Space size="large">
									<span>
										<span className="size-16 weight-7">Email ID : </span>
										{data.email}
									</span>
									<span>
										<span className="size-16 weight-7">Mobile number : </span>
										{billingPerson.phone}
									</span>
								</Space>
							</div>
						</Space>
					</Col>
				</Row>
			)}

			<Row className="mt-16">
				<Col span={1}></Col>
				<Col span={23}>
					<List
						itemLayout="horizontal"
						dataSource={data.items}
						renderItem={(item) => (
							<List.Item>
								<List.Item.Meta
									avatar={<Image width={60} height={60} src={item.image} />}
									title={<a className="size-14 weight-7">{item.name}</a>}
									description={
										Array.isArray(item.options)
											? item.options.map((option) => {
													return (
														<div className="size-14" style={{ color: '#262626' }}>
															{option.name}: {option.value}
														</div>
													);
											  })
											: null
									}
								/>

								<Space>
									<div className="size-14 weight-7">{item.sku}</div>
									<Tooltip placement="topLeft" title={`Quantity: ${item.quantity}`}>
										<Button style={{ width: '110px', padding: 6 }}>
											<div className="text-ellipsis">Quantity: {item.quantity}</div>
										</Button>
									</Tooltip>
									<Tooltip placement="topLeft" title={`Weight: ${item.weight}`}>
										<Button style={{ width: '110px', padding: 6 }}>Weight: {item.weight}</Button>
									</Tooltip>
									<Tooltip placement="topLeft" title={`Length: ${item.length}`}>
										<Button style={{ width: '110px', padding: 6 }}>Length: {item.length}</Button>
									</Tooltip>
									<Tooltip placement="topLeft" title={`Width: ${item.width}`}>
										<Button style={{ width: '110px', padding: 6 }}>Width: {item.width}</Button>
									</Tooltip>
									<Tooltip placement="topLeft" title={`Price: ${item.price}`}>
										<Button style={{ width: '110px', padding: 6 }}>Price: {item.price}</Button>
									</Tooltip>
								</Space>
							</List.Item>
						)}
					/>
				</Col>
			</Row>
		</div>
	);
}

ProductList.propTypes = {
	data: PropTypes.object,
	isShowHeader: PropTypes.bool,
};
ProductList.defaultProps = {
	data: {},
	isShowHeader: true,
};

export default ProductList;
