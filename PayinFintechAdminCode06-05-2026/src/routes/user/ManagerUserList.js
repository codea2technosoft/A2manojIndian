import React, { useEffect, useRef, useState } from 'react';
import { Spin, Table, Space, Switch, Row, InputNumber, Button } from 'antd';
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom';
import _ from 'lodash';
import PageTitle from 'components/PageTitle';
import TableBar from 'components/TableBar';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
// request
import { getUsersOfPartner, updateUserOfPartner, onboardUsersOfPartner, getPartner } from 'requests/user';
import { toast } from 'react-toast';
import { formatCurrency } from 'utils/common';

const ManagerUserList = () => {
    const [titles, setTitles] = useState([{ path: '', title: 'Users' }]);
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = useState(0);
    const [records, setRecords] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const searchRef = useRef(null);
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();


    const columns = [
        // {
        //     title: 'ID',
        //     key: 'id',
        //     dataIndex: 'id',
        // },
        {
            title: 'Details',
            key: 'full_name',
            dataIndex: 'full_name',
            render: (text, record) => (
                <div>
                    <Link to={`${location.pathname}/${record.id}`}>
                        <strong>{text}</strong>
                    </Link>
                    <div><a href={`mailto:${record.email}`}>{record.email}</a></div>
                    <div><a href={`tel:${record.mobile}`}>{record.mobile}</a></div>
                </div>
            ),
            width: 150,
        },
        {
            title: 'Total Transaction(Success)',
            key: 'paid_order_amount',
            dataIndex: 'paid_order_amount',
            render: (text) => formatCurrency(text)
        },
        {
            title: 'Total Settlement',
            key: 'settlement_amount',
            dataIndex: 'settlement_amount',
            render: (text) => formatCurrency(text)
        },
        {
            title: 'Payment status',
            dataIndex: 'payment_status',
            key: 'payment_status',
            render: (text, record) => {
                return (
                    <Switch
                        defaultChecked={text === 0 ? false : true}
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                        onChange={(value) => onUpdate(record.id, { payment_status: Number(value) })}
                    />
                );
            },
        },
        {
            title: 'Min TA',
            dataIndex: 'min_order_amount',
            key: 'min_order_amount',
            render: (text, record) => {
                return (
                    <InputNumber size='small' defaultValue={text} onChange={(value) => onUpdate(record.id, { min_order_amount: value })} />
                );
            },
        },
        {
            title: 'Max TA',
            dataIndex: 'max_order_amount',
            key: 'max_order_amount',
            render: (text, record) => {
                return (
                    <InputNumber size='small' defaultValue={text} onChange={(value) => onUpdate(record.id, { max_order_amount: value })} />
                );
            },
        },
        {
            title: 'Transaction fee (%)',
            dataIndex: 'transaction_fee_rate',
            key: 'transaction_fee_rate',
            render: (text, record) => {
                return (
                    <InputNumber size='small' defaultValue={text} onChange={(value) => onUpdate(record.id, { transaction_fee_rate: value })} />
                );
            },
        },
        {
            title: 'Reseller fee (%)',
            dataIndex: 'reserve_amount_rate',
            key: 'reserve_amount_rate',
            render: (text, record) => {
                return (
                    <InputNumber size='small' defaultValue={text} onChange={(value) => onUpdate(record.id, { reserve_amount_rate: value })} />
                );
            },
        }
    ];

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await getPartner(params.id);

                setTitles([
                    { path: '/partners', title: response.full_name },
                    { path: location.pathname, title: 'Users' }
                ]);
            } catch (err) {
                console.log(err);
            }
        }

        getData();
    }, [params]);

    useEffect(() => {
        const query = parseQueryParams(location);
        getRecords(query);
    }, [location]);

    const getRecords = async (query) => {
        try {
            setIsTableLoading(true);
            const response = await getUsersOfPartner(params.id, query);

            setRecords(response.records);
            setPage(response.page);
            setPerPage(response.per_page);
            setTotalCount(response.total_records);
        } catch (err) {
            console.log(err);
        } finally {
            setIsTableLoading(false);
        }
    };

    const onSearch = (keyword) => {
        let query = parseQueryParams(location);
        query = {
            ...query,
            page: 1,
            keyword: keyword,
        };

        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query),
        });
    };

    const onRefresh = () => {
        let query = parseQueryParams(location);
        query = {
            page: 1,
            keyword: '',
        };

        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query),
        });

        if (searchRef.current?.input.value) {
            searchRef.current.handleReset();
        }
    };



    const onChangeTable = (pagination) => {
        console.log(pagination);

        let query = parseQueryParams(location);
        query = {
            ...query,
            page: pagination.current,
            per_page: pagination.pageSize,
        };

        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query),
        });
    };

    const onUpdate = _.debounce(async (id, data) => {
        try {
            setIsTableLoading(true);
            await updateUserOfPartner(params.id, id, data);
        } catch (err) {
            console.log(err);
        } finally {
            setIsTableLoading(false);
        }
    }, 500);



    const onOnboardingUsers = async () => {
        try {
            setIsTableLoading(true);
            const data = {
                user_ids: selectedRowKeys,
                onboarding_service_ids: [1]
            };

            await onboardUsersOfPartner(data);

            toast.success('Please wait. Onboarding in progress...');
        } catch (err) {
            console.table(err);
            let message = 'An error occured. Please try again.';
            if (err.response.data.message) message = err.response.data.message;

            toast.error(message);
        } finally {
            setIsTableLoading(false);
        }
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys)
        },
    };

    return (
        <div>
            <PageTitle titles={titles} />
            <Row justify='space-between' align='middle'>
                <TableBar
                    onSearch={onSearch}
                    showFilter={false}
                    placeholderInput="Search..."
                    inputRef={searchRef}
                />
                
                {/* <Button
                    type='primary'
                    size='large'
                    disabled={!selectedRowKeys.length}
                    onClick={onOnboardingUsers}
                >
                    Onboarding
                </Button> */}
                <Link to="/manager-setting-partners-lists">
                    <Button type="primary" size='large' style={{ width: 115, height: 48 }}><span style={{ marginRight: '7px', fontSize: '20px' }}>&larr;</span> Back</Button>
                </Link>
            </Row>
            <Spin spinning={isTableLoading}>
                <Table
                    style={{ marginTop: '10px' }}
                    rowSelection={rowSelection}
                    dataSource={records}
                    columns={columns}
                    onChange={onChangeTable}
                    rowKey={'id'}
                    pagination={{
                        pageSize: perPage,
                        total: totalCount,
                        current: page,
                    }}
                    scroll={{
                        x: true
                    }}
                />
            </Spin>
        </div>
    );
};

export default ManagerUserList;
