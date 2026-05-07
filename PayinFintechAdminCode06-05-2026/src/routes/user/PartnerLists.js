import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Spin, Table, Space, Switch, Row, InputNumber, Button } from 'antd';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import _ from 'lodash';
import PageTitle from 'components/PageTitle';
import TableBar from 'components/TableBar';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
// import { BaseSelect } from 'components/Elements';
// request
import { getPartners, updatePartner,updatePartnerPayinPayout } from 'requests/user';

const PartnerLists = () => {
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = useState(0);
    const [records, setRecords] = useState([]);

    const searchRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const config = useSelector(state => state.config);

    const titles = [{ path: location.pathname, title: 'Partners' }];

    const columns = [
        // {
        //     title: 'ID',
        //     key: 'id',
        //     dataIndex: 'id'
        // },
        // {
        //     title: 'Name',
        //     key: 'full_name',
        //     // dataIndex: 'full_name',
        //     render: (text, record) => (
        //         <span>{record.full_name}<br></br> {record.email}</span>
        //     )
        // },

        {
            title: 'Name/Email',
            render: (text, record) => (
                <div>
                    <div>
                    <span> {record.full_name}</span>
                        
                    </div>
                    <div>
                    <a href={`mailto:${record.email}`}>{record.email}</a>
                    </div>
                </div>
            )
        },
        
        // {
        //     title: 'Email',
        //     key: 'email',
        //     dataIndex: 'email'
        // },
        // {
        //     title: 'Phone',
        //     key: 'mobile',
        //     dataIndex: 'mobile',
        // },
        // {
        //     title: 'Settlement Cycle',
        //     key: 'settlement_cycle',
        //     dataIndex: 'settlement_cycle',
        //     render: (text, record) => (
        //         <BaseSelect
        //             style={{width: 300}}
        //             selected={text}
        //             defaultText={!text ? 'Select one' : ''}
        //             options={config.settlement_cycles}
        //             optionLabel='display'
        //             optionValue='value'
        //             onChange={(value) => onUpdate(record.id, { settlement_cycle: Number(value) })}
        //         />
        //     )
        // },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (text, record) => {
                return (
                    <Switch
                        defaultChecked={text === 0 ? false : true}
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                        onChange={(value) => onUpdate(record.id, { status: Number(value) })}
                    />
                );
            },
        },
        {
            title: 'Payin Payout',
            key: 'status',
            dataIndex: 'status',
            render: (text, record) => {
                var both = 'both';
                var payin = 'payin';
                var payout = 'payout';
                return (
                    // <Switch
                    //     defaultChecked={text === 0 ? false : true}
                    //     checkedChildren="Active"
                    //     unCheckedChildren="Inactive"
                    //     onChange={(value) => onUpdate(record.id, { status: Number(value) })}
                    // />
                    <select onChange={handleChange}>
                        <option value={both+','+record.id} selected={record.payin_or_payout === 'both' ? true : null}>Both</option>
                        <option  value={payin+','+record.id} selected={record.payin_or_payout === 'payin' ? true : null}>Payin</option>
                        <option  value={payout+','+record.id} selected={record.payin_or_payout === 'payout' ? true : null}>Payout</option>
                    </select>
                //     <BaseSelect
                //     style={{width: 300}}
                //     defaultText={!text ? 'Select one' : ''}
                //     // options={record.payin_or_payout}
                //     optionLabel='display'
                //     optionValue='value'
                //     onChange={(value) => onUpdate(record.id, { settlement_cycle: Number(value) })}
                // />
                );
            },
        },
        {
            title: 'Actions',
            render: (record) => (
                <Link to={`${record.id}/manager-setting-user`}>
                    <Button>Manage</Button>
                </Link>
            )
        },
    ];

    useEffect(() => {
        const query = parseQueryParams(location);
        getRecords(query);
    }, [location]);

    const getRecords = async (query) => {
        try {
            setIsTableLoading(true);
            const response = await getPartners(query);

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
            await updatePartner(id, data);
        } catch (err) {
            console.log(err);
        } finally {
            setIsTableLoading(false);
        }
    }, 500);
    const handleChange = _.debounce(async (id) => {
        try {
            setIsTableLoading(true);
            await updatePartnerPayinPayout(id.target.value);
        } catch (err) {
            console.log(err);
        } finally {
            setIsTableLoading(false);
        }
    }, 500);

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
                <Link to="/manager-setting-user-detail">
                    <Button type="primary" size='large' style={{ width: 115, height: 48 }}><span style={{ marginRight: '7px', fontSize: '20px' }}>&larr;</span> Back</Button>
                </Link>
            </Row>

            <Spin spinning={isTableLoading}>
                <Table
                    style={{ marginTop: '10px' }}
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

export default PartnerLists;
