import React, { useEffect, useState } from "react";
import { Row, Col, Table, Input, Dropdown, Menu, Button } from "antd";
import { BaseSelect } from "components/Elements";
import {
    ChevronDown,
    Delete
} from 'react-iconly';
import { toast } from 'react-toast';

const ShipmentRateTable = (props) => {
    const { platform, orderType, mode, data, onChange } = props;

    const [items, setItems] = useState([
        {
            index: 0,
            from_total: 0,
            to_total: "",
            rate_per_order: "",
            rate_per_order_item: "",
            rate_per_kg: "",
            percent_charge: ""
        }
    ]);
    const [tableBasedOn, setTableBasedOn] = useState('weight');
    const [rateBasedOn, setRateBasedOn] = useState('range');

    const columns = [
        {
            title: "Subtotal range",
            width: '45%',
            render: (text, record, index) => (
                <Row align="middle">
                    <Input
                        addonBefore={tableBasedOn === 'weight' ? 'kg' : '₹'}
                        placeholder="From"
                        value={record.from_total}
                        onChange={(e) => onUpdateItem(index, 'from_total', e.target.value)}
                    />
                    <span className="ml-16 mr-16">-</span>
                    <Input
                        addonBefore={tableBasedOn === 'weight' ? 'kg' : '₹'}
                        placeholder="To"
                        value={record.to_total}
                        onChange={(e) => onUpdateItem(index, 'to_total', e.target.value)}
                    />
                </Row>
            )
        },
        {
            title: "Rate per order",
            render: (text, record, index) => (
                <Row gutter={[8, 8]}>
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={6}>
                        <Input
                            addonBefore={'₹'}
                            placeholder="Per order"
                            value={record.rate_per_order}
                            onChange={(e) => onUpdateItem(index, 'rate_per_order', e.target.value)}
                        />
                    </Col>
                    {
                        rateBasedOn !== 'range' ? (
                            <React.Fragment>
                                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={6}>
                                    <Input
                                        addonBefore={'₹'}
                                        placeholder="Per item"
                                        value={record.rate_per_order_item}
                                        onChange={(e) => onUpdateItem(index, 'rate_per_order_item', e.target.value)}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={6}>
                                    <Input
                                        addonBefore={'%'}
                                        placeholder="Percent charge"
                                        value={record.percent_charge}
                                        onChange={(e) => onUpdateItem(index, 'percent_charge', e.target.value)}
                                    />
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={6}>
                                    <Input
                                        addonBefore={'₹'}
                                        placeholder="Per kg"
                                        value={record.rate_per_kg}
                                        onChange={(e) => onUpdateItem(index, 'rate_per_kg', e.target.value)}
                                    />
                                </Col>
                            </React.Fragment>
                        ) : null
                    }
                </Row>
            )
        },
        {
            title: "Action",
            render: (text, record, index) => {
                if (index > 0 && index === items.length - 1) {
                    return (
                        <div className="link" onClick={onRemoveItem}>
                            <Delete set="light" width={24} height={24} />
                        </div>
                    )
                }

                return null;
            }
        }
    ];

    useEffect(() => {
        setTableBasedOn(data?.fixed_rates_table_based_on || 'weight');
        setRateBasedOn(data?.fixed_rates_based_on || 'range');
        if (data?.rules?.length) setItems(data?.rules)
        else setItems([
            {
                index: 0,
                from_total: 0,
                to_total: "",
                rate_per_order: "",
                rate_per_order_item: "",
                rate_per_kg: "",
                percent_charge: ""
            }
        ]);
    }, [data]);

    useEffect(() => {
        onChange(`${platform}.storefront.${orderType}.${mode}.rate.rules`, items);
    }, [items]);

    const onChangeTableBasedOnOption = (value) => {
        setTableBasedOn(value);
        onChange(`${platform}.storefront.${orderType}.${mode}.rate.fixed_rates_table_based_on`, value);
    }

    const onChangeRateBasedOnOption = (value) => {
        setRateBasedOn(value);
        onChange(`${platform}.storefront.${orderType}.${mode}.rate.fixed_rates_based_on`, value);
    }

    const onAddItem = () => {
        const newItems = [...items];
        const lastItem = newItems[newItems.length - 1];
        
        if (lastItem) {
            let isValid = true;

            if (!lastItem.from_total && lastItem.from_total !== 0) isValid = false;
            if (!lastItem.to_total || !lastItem.rate_per_order) isValid = false;
            if (rateBasedOn === 'range_subtotal_weight') {
                if (!lastItem.rate_per_order_item || !lastItem.rate_per_kg || !lastItem.percent_charge) isValid = false;
            }

            if (isValid) {
                newItems.push({
                    index: newItems.length,
                    from_total: Number(lastItem.to_total) + 0.01,
                    to_total: "",
                    rate_per_order: "",
                    rate_per_order_item: "",
                    rate_per_kg: "",
                    percent_charge: ""
                });
                setItems(newItems);
            } else {
                toast.error("Please fill all fields before adding new one.");
            }
        } else {
            newItems.push({
                index: 0,
                from_total: 0,
                to_total: "",
                rate_per_order: "",
                rate_per_order_item: "",
                rate_per_kg: "",
                percent_charge: ""
            });
            setItems(newItems);
        }
    }

    const onRemoveItem = () => {
        const newItems = [...items];
        newItems.pop();
        setItems(newItems);
    }

    const onUpdateItem = (index, name, value) => {
        const newItems = [...items];
        newItems[index][name] = value;
        setItems(newItems);
    }

    return (
        <div>
            <p>Set your own shipping cost calculation rules based on order price, number of items, or weight.</p>
            <Row className="mb-16" justify="space-between" align="middle">
                <Col>
                    <Row>
                        <Row className="mr-16">
                            <span className="mr-16">Table based on:</span>
                            <BaseSelect
                                style={{ width: 250 }}
                                options={[
                                    { value: 'weight', label: 'Weight' },
                                    { value: 'subtotal', label: 'Subtotal (after all discounts)' },
                                ]}
                                size='small'
                                value={tableBasedOn}
                                onChange={(value) => onChangeTableBasedOnOption(value)}
                            />
                        </Row>
                        <Row className="mr-16">
                            <span className="mr-16">Rate based on:</span>
                            <BaseSelect
                                style={{ width: 250 }}
                                options={[
                                    { value: 'range', label: 'Range only' },
                                    { value: 'range_subtotal_weight', label: 'Range, subtotal and weight' }
                                ]}
                                size='small'
                                value={rateBasedOn}
                                onChange={(value) => onChangeRateBasedOnOption(value)}
                            />
                        </Row>
                    </Row>
                </Col>
                <Button type="primary" onClick={onAddItem}>
                    Add row
                </Button>
            </Row>
            <Table
                rowKey={'index'}
                className="shipment-rate-table"
                columns={columns}
                dataSource={items}
                pagination={false}
            />
        </div>
    )
}

export default ShipmentRateTable;