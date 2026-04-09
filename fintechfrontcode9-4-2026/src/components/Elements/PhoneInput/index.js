import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Select } from 'antd';
// css
import 'assets/styles/components/phone-input.scss';

const { Option } = Select;

const PhoneInput = (props) => {
    const { countries, defaultCountry, onSelectCountry, className, disabled, ...restProps } = props;

    const [countryOptions, setCountryOptions] = useState([]);

    useEffect(() => {
        const options = countries.map((country) => (
            <Option value={country.id} key={country.id}>
                <img src={`${process.env.REACT_APP_ASSET_URL}${country.flag}`} />
                <span>{country.name}</span>
                <span>({country.mobile_code})</span>
            </Option>
        ));

        setCountryOptions(options);
    }, [countries]);

    const onSearch = (input) => {
        const keyword = input.toLowerCase();

        const filteredContries = countries.filter(country => {
            return country.name.toLowerCase().includes(keyword) || country.code.toLowerCase().includes(keyword);
        });

        const options = filteredContries.map((country) => (
            <Option value={country.id} key={country.id}>
                <img src={`${process.env.REACT_APP_ASSET_URL}${country.flag}`} />
                <span>{country.name}</span>
                <span>({country.mobile_code})</span>
            </Option>
        ));

        setCountryOptions(options);
    }

    const onSelect = (id) => {
        const selectedCountry = countries.find(country => country.id === id);
        onSelectCountry(selectedCountry);
    }

    const renderCountryDropdown = () => (
        <Select 
            disabled={disabled}
            defaultValue={defaultCountry ? defaultCountry.id : ''}
            dropdownClassName='phone-input-dropdown' 
            // showSearch
            onChange={(value) => onSelect(value)}
            // onSearch={onSearch}
            filterOption={false}
        >
            {countryOptions.map(option => option)}
        </Select>
    )

    return (
        <Input 
            className={`phone-input-wrapper ${className}`}
            addonBefore={renderCountryDropdown()}
            disabled={disabled}
            {...restProps}
        />
    )
}

PhoneInput.propTypes = {
	countries: PropTypes.array,
    defaultCountry: PropTypes.any,
    onSelectCountry: PropTypes.func,
    className: PropTypes.string,
};

PhoneInput.defaultProps = {
	countries: [],
    onSelectCountry: () => {},
    className: ''
};

export default PhoneInput;