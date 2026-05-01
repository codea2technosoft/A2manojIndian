import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FilterIcon, SearchIcon } from '@heroicons/react/outline';
import { Row, Input, Space } from 'antd';
import _ from 'lodash';
// css
import 'assets/styles/components/table-bar.scss';

const TableBar = (props) => {
	const { showFilter, onFilter, showSearch, onSearch, placeholderInput, children, isActiveFilter, inputRef } = props;
	const [activeFilter, setActiveFilter] = useState(false);

	useEffect(() => {
		if (!isActiveFilter && activeFilter) {
			setActiveFilter(false);
		}
	}, [isActiveFilter]);

	const onClickFilter = () => {
		if (!activeFilter) {
			setActiveFilter(true);
			onFilter();
		} else {
			setActiveFilter(false);
		}
	};

	const onChangeInput = _.debounce(onSearch, 1000);

	return (
		<Row className="Search-filter w-100" justify={'space-between'} style={{ alignItems:'baseline'}}>
			<Space size={0} className="mb-0" style={{width:'100%'}}>
				{showFilter ? (
					<div
						className={`app-circle-icon filter-button ${activeFilter ? 'app-circle-icon--active' : ''}`}
						onClick={onClickFilter}
					>
						<FilterIcon width={24} height={24} />
					</div>
				) : null}
				{showSearch ? (
					<Input
						ref={inputRef}
						placeholder={placeholderInput}
						prefix={<SearchIcon width={24} height={24} />}
						className="search-input"
						allowClear
						onChange={(e) => onChangeInput(e.target.value)}
					/>
				) : null}
			</Space>
			{children}
		</Row>
	);
};

TableBar.propTypes = {
	showFilter: PropTypes.bool,
	onFilter: PropTypes.func,
	showSearch: PropTypes.bool,
	onSearch: PropTypes.func,
	placeholderInput: PropTypes.string,
	children: PropTypes.element,
	isActiveFilter: PropTypes.bool,
	inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
};

TableBar.defaultProps = {
	showFilter: true,
	placeholderInput: 'Search..',
	onFilter: () => {},
	showSearch: true,
	onSearch: () => {},
	children: <></>,
	isActiveFilter: false,
	inputRef: null,
};

export default TableBar;
