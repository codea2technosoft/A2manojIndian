import { useEffect, useState } from 'react';
import { Row, Col, Checkbox, Typography, Menu, Dropdown } from 'antd';
import { ChevronDown } from 'react-iconly';
import { useSelector } from 'react-redux';
// request
import { updateOrderDetail } from 'requests/order';

const OrderPaymentStatusDropdown = (props) => {
    const { orderId, defaultValue, readonly, onChangeStatus } = props;

    const [value, setValue] = useState('');
    const [displayedText, setDisplayedText] = useState('');
    const [className, setClassName] = useState('');

    const config = useSelector((state) => state.config);

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    useEffect(() => {
        const statusValue = Number(value);
        
        const status = config.pay_statuses.find((item) => Number(item.value) === statusValue);
        if (status) {
            setDisplayedText(status.display);
        }

        if ([1].includes(statusValue)) setClassName('text-warning');
        else if ([2, 8].includes(statusValue)) setClassName('text-success');
        else if ([4, 5].includes(statusValue)) setClassName('text-gray');
        else if ([6].includes(statusValue)) setClassName('text-primary');
        else setClassName('text-error');
    }, [value]);


    const onChange = (selectedValue) => {
        setValue(selectedValue);
        if (onChangeStatus) {
            onChangeStatus(selectedValue);
        } else {
            updateOrderDetail(orderId, { payment_status: selectedValue });
        }
    };

    const renderPaymentMenu = () => (
        <Menu onClick={({ key }) => onChange(key)}>
            {config.pay_statuses.map((status) => (
                <Menu.Item key={status.value}>{status.display}</Menu.Item>
            ))}
        </Menu>
    );

    if (readonly) {
        return (
            <Row align="middle" className={className}>
                <span className="mr-8">{displayedText}</span>
            </Row>
        );
    }

    return (
        <Dropdown overlay={renderPaymentMenu()} className="mr-36">
            <Row align="middle" className={className}>
                <span className="mr-8">{displayedText}</span>
                <ChevronDown set="light" size={18} stroke="bold" />
            </Row>
        </Dropdown>
    );
};

export default OrderPaymentStatusDropdown;
