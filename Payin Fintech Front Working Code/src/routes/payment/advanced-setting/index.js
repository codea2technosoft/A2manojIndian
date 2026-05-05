import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Button, Row, Col } from 'antd';
import PageTitle from 'components/PageTitle';
import Loading from 'components/Loading';
import WebhookUrl from './setting/WebhookUrl';
import ApiDocs from './setting/ApiDocs';
import TransferPayin from './setting/TransferPayin';
import PaymentPartner from './setting/PaymentPartner';
import PaymentSettlements from './setting/PaymentSettlements';
import PaymentTransfer from './setting/PaymentTransfer';
import PaymentGateway from './setting/PaymentGateway';
// styles
import 'assets/styles/payment.scss';
// requests
import { getPaymentSettings, savePaymentSettings } from 'requests/payment';
import Channels from './Channels';

const titles = [{ title: 'Settings' }];

const { TabPane } = Tabs;

function PaymentAdvancedSettings() {
    const [tab, setTab] = useState('rate');
    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [data, setData] = useState({});
    const [dataPayin, setDataPayin] = useState({});

    useEffect(() => {
        const getData = async () => {
            // get initial settings data
            const response = await getPaymentSettings();
            // setData(response.payoutWebHookUrl);
            // alert(response.payin_webhook_url);
            setData(response);
            setDataPayin(response.payin_webhook_url);
            setLoading(false);
        };

        getData();
    }, []);

    const onChangeTab = (value) => {
        setTab(value);
    };

    const updateData = (namePath, value) => {
        const newData = { ...data };
        const paths = namePath.split('.');
        let subData = newData;
        const length = paths.length;
        for (let i = 0; i < length - 1; i++) {
            let elem = paths[i];
            if (!subData[elem]) subData[elem] = {};
            subData = subData[elem];
        }
        subData[paths[length - 1]] = value;

        // console.warn(newData+'op');

        setData(newData);
    };

    const onSubmit = async () => {
        try {
            setLoadingSubmit(true);
            await savePaymentSettings(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingSubmit(false);
        }
    };

    return (
        <div className="wrap-payment mb-36">
            {/* <PageTitle titles={titles} /> */}
            {loading ? (
                <Loading />
            ) : (
                <div>
                    <Tabs
                        defaultActiveKey={tab}
                        size="large"
                        onChange={(value) => onChangeTab(value)}
                        className="setting_tab"
                    >
                        <TabPane tab="API Docs" key="Api">
                            <ApiDocs data={data?.partner || {}} onUpdateData={updateData} />
                        </TabPane>
                        <TabPane tab="Webhook URL" key="Webhook_URL">
                            <WebhookUrl data={data || {}} onUpdateData={updateData} />
                            {/* <WebhookUrl data={dataPayin || {}} onUpdateData={updateData} /> */}
                            <Row justify="end" className="mt-32">
                                <Col lg={6} md={12} sm={24} xs={24}>
                                    <Button onClick={onSubmit} size="large" type="primary" loading={loadingSubmit}>
                                        Save
                                    </Button>
                                </Col>
                            </Row>
                        </TabPane>
                        {/* <TabPane tab="Transfer From PayIN" key="transfer">
                            <TransferPayin data={data?.partner || {}} onUpdateData={updateData} />
                        </TabPane> */}
                        {/* 
                        <TabPane tab="Payments" key="payment">
                            <PaymentPartner data={data?.partner || {}} onUpdateData={updateData} />
                        </TabPane>

                        <TabPane tab="Settlements" key="settlements">
                            <PaymentSettlements data={data?.partner || {}} onUpdateData={updateData} />
                        </TabPane> */}
                        {/* <TabPane
								tab='Transfers'
								key="transfers"
							>
								<PaymentTransfer
									data={data?.partner || {}}
									onUpdateData={updateData}
								/>
							</TabPane> */}

                        {/* <TabPane
								tab='Gateways'
								key="gateways"
							>
								<Channels 
									settings={data?.platform}
									onUpdateData={updateData}
								/>
							</TabPane> */}
                    </Tabs>
                    {/* <Row justify="end" className="mt-32">
                        <Col lg={6} md={12} sm={24} xs={24}>
                            <Button onClick={onSubmit} size="large" type="primary" loading={loadingSubmit}>
                                Save
                            </Button>
                        </Col>
                    </Row> */}
                </div>
            )}
        </div>
    );
}

export default PaymentAdvancedSettings;
