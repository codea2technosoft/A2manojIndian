import { useEffect, useState } from 'react';
import { Row, Col, Checkbox, Typography, Menu, Dropdown } from 'antd';
import { ChevronDown } from 'react-iconly';
import { useSelector } from 'react-redux';
// request
import { updateOrderDetail } from 'requests/order';

const OrderFulfillmentStatusDropdown = (props) => {
    const { orderId, defaultValue } = props;

    const [value, setValue] = useState('');
    const [displayedText, setDisplayedText] = useState('');
    const [className, setClassName] = useState('');

    const config = useSelector(state => state.config);

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    useEffect(() => {
        const statusValue = Number(value);
        const status = config.fulfillment_statuses.find(item => Number(item.value) === statusValue);

        if (status) {
            setDisplayedText(status.display);
        }

        if ([1].includes(statusValue)) setClassName('text-primary');
        else if ([2].includes(statusValue)) setClassName('text-warning');
        else if ([3, 7, 8].includes(statusValue)) setClassName('text-success');
        else if ([4, 6].includes(statusValue)) setClassName('text-gray');
        else setClassName('text-error');
    }, [value]);

    const onChange = (selectedValue) => {
        setValue(selectedValue);
        updateOrderDetail(orderId, { fulfillment_status: selectedValue });
    }

    const renderFulfillmentMenu = () => (
        <Menu onClick={({ key }) => onChange(key)}>
            {
                config.fulfillment_statuses.map((status) => (
                    <Menu.Item key={status.value}>{status.display}</Menu.Item>
                ))
            }
        </Menu>
    );

    return (
        <Dropdown overlay={renderFulfillmentMenu()} className="mr-36">
            <Row align="middle" className={className}>
                <span className='mr-8'>{displayedText}</span>
                <ChevronDown set="light" size={18} stroke="bold" />
            </Row>
        </Dropdown>
    )
}

export default OrderFulfillmentStatusDropdown;