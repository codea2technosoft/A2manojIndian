import React, { useEffect, useState } from 'react';
import { Form, Input, Tooltip, Typography } from "antd";
import { PhoneInput } from 'components/Elements';
// request
import { getIpInfo } from "requests/common";
import { getCountries } from 'requests/country';

const { Title } = Typography;

const FormKycContact = (props) => {
    const { defaultCountry, countries, onChangeCountry, disablePhoneInput } = props;

    const onSelectCountry = (country) => {
        onChangeCountry(country);
    }

    return (
        <React.Fragment>
            <Title level={3}>Contact Information</Title>
            <Form.Item name="full_name" label="Contact name" rules={[{ required: true }]}>
                <Input placeholder='Your name' />
            </Form.Item>
            <Form.Item name="country_id" label="Country" hidden rules={[{ required: true }]}>
                <Input placeholder='Your country' />
            </Form.Item>
            <Form.Item name="mobile" label="Contact number" rules={[{ required: true }]}
                tooltip={{
                    title: "We will reach out to this phone for any account related issues.",
                    placement: "right"
                }}
            >
                {/* <Input placeholder='Your mobile number' disabled={disablePhoneInput} /> */}
                <PhoneInput
                    disabled={disablePhoneInput}
                    placeholder='Mobile number without country code'
                    countries={countries}
                    defaultCountry={defaultCountry}
                    onSelectCountry={onSelectCountry}
                />
            </Form.Item>
            <Form.Item name="email" label="Contact email" rules={[{ required: true }]}>
                <Input placeholder='Your email' disabled />
            </Form.Item>
        </React.Fragment>
    )
}

export default FormKycContact;