import React from 'react';
import { Select, Spin } from 'antd';
import PropTypes from 'prop-types';
const { Option } = Select;

const BaseSelect = (props) => {
	const {
		defaultText,
		selected,
		options,
		attr,
		optionValue, // name of value field
		optionLabel, // name of label field
		additionalLabel,
		onChange,
		onScrollEnd,
		fetching,
		...rest
	} = props;

	const handleScroll = (e) => {
		let element = e.target;
		// Khi element.scrollHeight == element.clientHeight + element.scrollTop thì đó là scroll tới bottom
		if (element.scrollHeight === element.clientHeight + element.scrollTop) {
			onScrollEnd();
		}
	};

	let value = selected ? selected : '';

	if (options.length) {
		let temp = options.find((option) => option[optionValue] === selected);
		if (!temp) value = '';

		if (!defaultText) {
			value = options[0][optionValue];
		}
	}

	return (
		<Select
			defaultValue={value}
			notFoundContent={fetching ? <Spin size="small" /> : null}
			{...rest}
			onChange={(value) => onChange(value)}
			filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
			onPopupScroll={(e) => handleScroll(e)}
		>
			{defaultText ? <Option value="">{defaultText}</Option> : null}
			{options.map((option, index) => {
				let label = option[optionLabel];
				if (additionalLabel) {
					label = '(' + option[additionalLabel] + ') ' + option[optionLabel];
				}
				return (
					<Option key={`${option[optionValue]}_${index}`} value={option[optionValue]}>
						{label}
					</Option>
				);
			})}
		</Select>
	);
};

BaseSelect.propTypes = {
	defaultText: PropTypes.string,
	options: PropTypes.array.isRequired,
	attr: PropTypes.object,
	onChange: PropTypes.func,
	onScrollEnd: PropTypes.func,
};
BaseSelect.defaultProps = {
	defaultText: '',
	optionValue: 'value',
	optionLabel: 'label',
	onScrollEnd: () => {},
};

export default BaseSelect;
