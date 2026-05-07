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
import { partnermanagerlistadmin, partnerpayoutpayinpermission, partnerpayoutpayoutpermission, updatePartnerPayinPayout } from 'requests/user';

const PartnerMerchantUserList = () => {
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [page, setPage] = useState();
    const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = useState(0);
    const [records, setRecords] = useState([]);

    const searchRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const config = useSelector(state => state.config);

    const titles = [{ path: location.pathname, title: 'Merchant' }];

    const columns = [
        // {
        //     title: 'Email',
        //     key: 'email',
        //     dataIndex: 'email'
        // },


        {
            title: 'Merchant Detail',
            render: (text, record) => (
                <div>
                    <div>
                        <a href={`mailto:${record.merchantEmail}`}>{record.merchantEmail}</a>

                    </div>
                    <div>
                        <span> {record.merchantpassword}</span>
                    </div>
                </div>
            )
        },
        {
            title: 'Partner Detail',
            render: (text, record) => (
                <div>
                    <div>
                        <a href={`mailto:${record.partneremail}`}>{record.partneremail}</a>

                    </div>
                    <div>
                        <span> {record.partnerpassword}</span>
                    </div>
                </div>
            )
        },

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
        // {
        //     title: 'Status',
        //     key: 'status',
        //     dataIndex: 'status',
        //     render: (text, record) => {
        //         return (
        //             <Switch
        //                 defaultChecked={text === 0 ? false : true}
        //                 checkedChildren="Active"
        //                 unCheckedChildren="Inactive"
        //                 onChange={(value) => onUpdate(record.id, { status: Number(value) })}
        //             />
        //         );
        //     },
        // },
        // {
        //     title: 'Actions',
        //     render: (record) => (
        //         <Link to={`/merchant/${record.id}/partner`}>
        //             <Button>Partner</Button>
        //         </Link>
        //     )
        // },
        {
            title: 'Payin',
            key: 'payin_permission_assign',
            dataIndex: 'payin_permission_assign',
            render: (text, record) => {
                return (
                    <>


                        <Switch
                            defaultChecked={record.partnerpayin_permission_assign == 0 ? false : true}
                            checkedChildren={record.partnerpayin_permission_assign == 1 ? 'Active' : 'Inactive'}
                            unCheckedChildren={record.partnerpayin_permission_assign == 0 ? 'Inactive' : 'Active'}
                            // onChange={(value) => onUpdate(record.userid, { payin_permission_assign: Number(record.partnerpayin_permission_assign) })}
                            onClick={() => payin_change_status(record.partnerid, record.partnerpayin_permission_assign)}
                        />
                    </>
                );
            },
        },
        {
            title: 'Payout',
            key: 'payout_permission_assign',
            dataIndex: 'payout_permission_assign',
            render: (text, record) => {
                return (
                    <Switch
                        defaultChecked={record.partnerpayout_permission_assign == 0 ? false : true}
                        checkedChildren={record.partnerpayout_permission_assign == 1 ? 'Active' : 'Inactive'}
                        unCheckedChildren={record.partnerpayout_permission_assign == 0 ? 'Inactive' : 'Active'}
                        // onChange={(value) => onUpdate(record.userid, { payout_permission_assign: Number(record.partnerpayout_permission_assign) })}
                        onClick={() => payout_change_status(record.partnerid, record.partnerpayout_permission_assign)}
                    />
                );
            },
        },
        {
            title: 'Status',
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
                        <option value={both + ',' + record.id} selected={record.payin_or_payout === 'both' ? true : null}>Both</option>
                        <option value={payin + ',' + record.id} selected={record.payin_or_payout === 'payin' ? true : null}>Payin</option>
                        <option value={payout + ',' + record.id} selected={record.payin_or_payout === 'payout' ? true : null}>Payout</option>
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

    ];

    useEffect(() => {
        const query = parseQueryParams(location);
        getRecords(query);
    }, [location]);

    const getRecords = async (query,) => {
        try {
            setIsTableLoading(true);
            const response = await partnermanagerlistadmin(query);
            // console.warn(response.per_page);
            setRecords(response.records);
            setPage(response.page);
            setPerPage(response.per_page);
            setTotalCount(response.total_record);
        } catch (err) {
            console.log(err);
        } finally {
            setIsTableLoading(false);
        }
    };
    const payin_change_status = async (id, data) => {
        if (data == 1) {
            var key = 0;
        } else {
            var key = 1;
        }
        id = {
            userid: id,
            payin_permission_assign: key,
        }
        await partnerpayoutpayinpermission(id);
        getRecords();
    }

    const payout_change_status = async (id, data) => {
        if (data == 1) {
            var key = 0;
        } else {
            var key = 1;
        }
        id = {
            userid: id,
            payout_permission_assign: key,
        }
        await partnerpayoutpayoutpermission(id);
        getRecords();
    }

    // const onUpdate = _.debounce(async (id) => {
    //     try {
    //         // setIsTableLoading(true);
    //         console.warn(id+'sdsdsd');
    //         await partnerpayoutpayinpermission(id);
    //     } catch (err) {
    //         console.log(err);
    //         } finally {
    //         // setIsTableLoading(false);
    //     }
    // }, 500);

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


    // const onUpdate1 = _.debounce(async (id, data) => {
    //     try {
    //         // setIsTableLoading(true);
    //         await updatePartner(id, data);
    //     } catch (err) {
    //         console.log(err);
    //     } finally {
    //         // setIsTableLoading(false);
    //     }
    // }, 500);
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

export default PartnerMerchantUserList;
