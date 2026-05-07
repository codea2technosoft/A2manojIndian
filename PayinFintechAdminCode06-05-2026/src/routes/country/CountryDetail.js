import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Form, Row, Col, Input, Select, Button, Divider, Card, Checkbox } from 'antd';
import _ from 'lodash';
import { getCountry, updateCountry } from 'requests/country';
import PageTitle from 'components/PageTitle';
import Loading from 'components/Loading';

const CountryDetail = (props) => {
    const [loading, setLoading] = useState(true);
    const [record, setRecord] = useState(null);
    const [titles, setTitles] = useState([{ path: '/countries', title: 'Countries' }]);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const location = useLocation();
    const params = useParams();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const record = await getCountry(params.id);
            setTitles([
                { path: '/countries', title: 'Countries' },
                { path: location.pathname, title: record.name }
            ]);
            setRecord(record);

            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    const onUpdate = async (data) => {
        try {
            setLoadingUpdate(true);
            await updateCountry(params.id, data)
        } catch (err) {
            console.log(err);
        } finally {
            setLoadingUpdate(false);
        }
    }

    return (
        <div>
            {
                loading ? (
                    <Loading />
                ) : (
                    <React.Fragment>
                        <PageTitle titles={titles} />
                        <Link to={`/countries/${params.id}/states`}>
                            <Button type="default">
                                {record.state_count} states
                            </Button>
                        </Link>
                        <Form
                            layout='vertical'
                            initialValues={record}
                            onFinish={onUpdate}
                            className='mt-24'
                        >
                            <Row gutter={[16, 16]}>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <Form.Item name="code" label="Code" rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col lg={8} md={8} sm={24} xs={24}>
                                    <Form.Item name="mobile_code" label="Mobile code" rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row justify='end'>
                                <Button type='primary' loading={loadingUpdate} htmlType='submit'>Update</Button>
                            </Row>
                        </Form>
                    </React.Fragment>
                )
            }
        </div>
    );
}

export default CountryDetail;