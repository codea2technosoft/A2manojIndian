import React, { useEffect, useState } from 'react';
import { Row, Form, Input, Radio, Checkbox, Typography, Alert, Tooltip } from "antd";
import { BaseSelect } from 'components/Elements';
import _ from 'lodash';
import regex from 'utils/regex';

const { Title } = Typography;

const FormKycBusinessDetail = (props) => {
    const { defaultHasGstin, defaultSameOperationalAddress, states, visibleCin, isIndividualPan, onValidateGstin, onLookupCin } = props;

    const [hasGstin, setHasGstin] = useState('1');
    const [isSameOperationalAddress, setIsSameOperationalAddress] = useState(true);

    useEffect(() => {
        setHasGstin(defaultHasGstin);
    }, [defaultHasGstin]);

    useEffect(() => {
        setIsSameOperationalAddress(defaultSameOperationalAddress);
    }, [defaultSameOperationalAddress]);

    const onChangeGstin = _.debounce((value) => {
        onValidateGstin(value);
    }, 500);

    const onSearchCin = _.debounce((value) => {
        onLookupCin(value);
    }, 500);

    return (
        <React.Fragment>
            <Title level={3}>Business Detail</Title>
            <Form.Item name="has_gstin" label="GSTIN" rules={[{ required: true }]}>
                <Radio.Group onChange={(e) => setHasGstin(e.target.value)}>
                    <Radio value='1'>We have a registered GSTIN</Radio>
                    <Radio value='0'>We don’t have a registered GSTIN</Radio>
                </Radio.Group>
            </Form.Item>
            {
                hasGstin === '1' ? (
                    <Form.Item
                        name="gstin"
                        rules={[{ required: true }]}
                    >
                        <Input
                            placeholder='Enter GSTIN number'
                            onChange={(e) => onChangeGstin(e.target.value)}
                        />
                    </Form.Item>
                ) : null
            }
            <Alert
                className='mb-16'
                message={
                    <small>Enter GSTIN & get reviewed faster. We verify your data from GSTIN portal for quick activation. You can add your GST details later once you are registered</small>
                }
                type="warning"
            />
            <Form.Item
                name="business_pan"
                label="Business PAN"
                rules={[{ required: true, pattern: isIndividualPan ? regex.individualPan : regex.pan }]}
                tooltip={{
                    title: "Mandatory for Companies. PAN details should be of the mentioned business only.",
                    placement: 'right'
                }}
            >
                <Input placeholder='Enter Business PAN' />
            </Form.Item>
            <Form.Item
                name="business_name"
                label="Business Name"
                rules={[{ required: true }]}
                tooltip={{
                    title: "We verify the details with the central PAN database. Please ensure you enter the correct PAN details.",
                    placement: 'right'
                }}
            >
                <Input placeholder='Enter Business Name' onChange={(e) => onSearchCin(e.target.value)} />
            </Form.Item>
            {
                visibleCin ? (
                    <Form.Item name="cin" label="CIN" rules={[{ required: true, pattern: regex.cin }]}>
                        <Input placeholder='Enter CIN' />
                    </Form.Item>
                ) : null
            }
            <Form.Item name="authorised_signatory_pan" label="Authorised Signatory PAN" rules={[{ required: true, pattern: regex.pan }]}>
                <Input placeholder='Enter Authorised Signatory PAN' />
            </Form.Item>
            <Form.Item
                name="pan_owner_name"
                label="PAN Owner's Name"
                rules={[{ required: true }]}
                tooltip={{
                    title: "We verify the details with the central PAN database. Please ensure you enter the correct PAN details.",
                    placement: "right"
                }}
            >
                <Input placeholder='Enter PAN Owner Name' />
            </Form.Item>
            <Form.Item
                name="billing_label"
                label="Billing Label"
                rules={[{ required: true }]}
                tooltip={{
                    title: "The brand name that your customers are familiar with. It should either be similar to your registered business name or website name.",
                    placement: "right"
                }}
            >
                <Input placeholder='Enter Billing Label' />
            </Form.Item>
            <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                <Input placeholder='Enter address' />
            </Form.Item>
            <Form.Item name="pincode" label="Pincode" rules={[{ required: true }]}>
                <Input placeholder='Enter pincode' />
            </Form.Item>
            <Form.Item name="city" label="City" rules={[{ required: true }]}>
                <Input placeholder='Enter city' />
            </Form.Item>
            <Form.Item name="state_id" label="State" rules={[{ required: true }]}>
                <BaseSelect
                    options={states}
                    optionLabel='name'
                    optionValue='id'
                    defaultText='Select one'
                />
            </Form.Item>
            <Form.Item name="is_same_operational_address" valuePropName="checked">
                <Checkbox onChange={(e) => setIsSameOperationalAddress(e.target.checked)}>
                    Operational Address same as above
                </Checkbox>
            </Form.Item>
            {
                !isSameOperationalAddress ? (
                    <React.Fragment>
                        <Form.Item name="operational_address" label="Operational address" rules={[{ required: true }]}>
                            <Input placeholder='Enter address' />
                        </Form.Item>
                        <Form.Item name="operational_pincode" label="Operational pincode" rules={[{ required: true }]}>
                            <Input placeholder='Enter pincode' />
                        </Form.Item>
                        <Form.Item name="operational_city" label="Operational city" rules={[{ required: true }]}>
                            <Input placeholder='Enter city' />
                        </Form.Item>
                        <Form.Item name="operational_state_id" label="Operational state" rules={[{ required: true }]}>
                            <BaseSelect
                                options={states}
                                optionLabel='name'
                                optionValue='id'
                                defaultText='Select one'
                            />
                        </Form.Item>
                    </React.Fragment>
                ) : null
            }
        </React.Fragment>
    )
}

export default FormKycBusinessDetail;