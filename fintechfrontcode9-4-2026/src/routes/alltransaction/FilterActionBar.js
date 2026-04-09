import React from 'react';
import PropTypes from 'prop-types';
import { Button, Divider, Select } from 'antd';
import { RefreshIcon, MenuAlt1Icon, ViewGridIcon } from '@heroicons/react/outline';

const { Option } = Select;

function FilterActionBar(props) {
	const { onRefresh, view, onChangeView } = props;

	return (
		<div className="mt8 mb-24">
			<span className="weight-6 size-16 ">Currently viewing: </span>
			<Button type="link" className="weight-6 size-16">
				All Orders
			</Button>
			<Divider type="vertical" />
			<Select value={view} onChange={onChangeView} bordered={false}>
				<Option value={'card'}>
					<Button className="weight-6 size-16" type="link" icon={<MenuAlt1Icon className="mr-8 icon-btn" />}>
						Card view
					</Button>
				</Option>
				<Option value={'list'}>
					<Button className="weight-6 size-16" type="link" icon={<ViewGridIcon className="mr-8 icon-btn" />}>
						List view
					</Button>
				</Option>
			</Select>

			<Divider type="vertical" />
			<Button
				type="primary"
				className="btn1"
				onClick={() => onRefresh()}
				icon={<RefreshIcon className="mr-8 icon-btn" />}
			>
				Refresh
			</Button>
		</div>
	);
}

FilterActionBar.propTypes = {
	onRefresh: PropTypes.func,
	view: PropTypes.number,
	onChangeView: PropTypes.func,
};

FilterActionBar.defaultProps = {
	onRefresh: () => { },
	onChangeView: () => { },
	view: 1,
};

export default FilterActionBar;
