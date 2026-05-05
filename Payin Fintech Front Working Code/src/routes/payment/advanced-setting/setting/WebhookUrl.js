import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Row, Col, Typography, Switch, Input } from 'antd';
// request
import { getUsers } from 'requests/user';
import { BaseSelect } from 'components/Elements';

const { Title } = Typography;

const WebhookUrl = (props) => {
    const { data, onUpdateData } = props;

    const [usingSingleAccount, setUsingSingleAccount] = useState(false);
    const [subUserOptions, setSubUserOptions] = useState([]);

    const config = useSelector((state) => state.config);

    useEffect(() => {
        getAllUsers();
    }, []);

    const getAllUsers = async () => {
        const response = await getUsers({ is_paginate: 0 });
        const options = response.records.map((item) => ({
            label: item.full_name,
            value: item.id,
        }));
        setSubUserOptions(options);
    };
    return (
        <div>
            <Card>
               
            <div className='mt-16'>
                    <Title level={5}>Webhook receiver URL Payout </Title>
                    <Input defaultValue={data.payoutWebHookUrl} onChange={(e) => onUpdateData(`payout.webhook_url`, e.target.value)}/>

            </div>
            </Card>


              <Card>
               
            <div className='mt-16'>
                    <Title level={5}>Webhook receiver URL Payin </Title>
                    <Input defaultValue={data.payinWebHookUrl} onChange={(e) => onUpdateData(`payin.webhook_url`, e.target.value)}/>

            </div>
            </Card>

        </div>
    )
    
};

export default WebhookUrl;
