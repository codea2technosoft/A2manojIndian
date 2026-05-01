import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Spin, Table, Button, Switch, Modal, Row, Col,Card } from 'antd';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import PageTitle from 'components/PageTitle';
import TableBar from 'components/TableBar';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import CreatePayoutsBeneficiaryAccountForm from './CreatePayoutsBeneficiaryAccountForm';
import UpdatePayoutsBeneficiaryAccountForm from './UpdatePayoutsBeneficiaryAccountForm';
import { EditSquare, Delete } from 'react-iconly';
// request
import { getUsers } from 'requests/user';
import {
    addgetPayoutsBeneficiaryAccounts,
    newcreatePayoutsBeneficiaryAccounts,
    updatePayoutsBeneficiaryAccounts,
    deletePayoutsBeneficiaryAccounts,
} from 'requests/payouts';

const PayoutsBeneficiaryAccountList = () => {
    const [isTableLoading, setIsTableLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = React.useState(0);
    const [records, setRecords] = React.useState([]);
    const [currentRecord, setCurrentRecord] = React.useState({});
    const [visibleCreateForm, setVisibleCreateForm] = React.useState(false);
    const [visibleUpdateForm, setVisibleUpdateForm] = React.useState(false);
    const [currentId, setCurrentId] = React.useState(null);
    const [users, setUsers] = React.useState([]);

    const config = useSelector((state) => state.config);

    const searchRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const titles = [{ path: location.pathname, title: 'Beneficiaries' }];

    const columns = [
        {
            title: 'ID',
            key: 'id',
            dataIndex: 'id',
        },
       
        {
            title: 'Beneficiary Name',
            key: 'name',
            dataIndex: 'name',
        },
        {
            title: 'Bank Name',
            key: 'bank_name',
            dataIndex: 'bank_name',
        },

        {
            title: 'Account Number',
            key: 'account_number',
            dataIndex: 'account_number',
        },
        
        {
            title: 'IFSC Code',
            key: 'ifsc_code',
            dataIndex: 'ifsc_code',
        },
        
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (text) => text.toUpperCase(),
        }
        
        
    ];

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers({ is_paginate: 0 });
                setUsers([...data.records]);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const query = parseQueryParams(location);
        getRecords(query);
    }, [location]);

    const getRecords = async (query) => {
        try {
            setIsTableLoading(true);
            const response = await addgetPayoutsBeneficiaryAccounts(query);
            setRecords(response.data);
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

    const onToggleCreateForm = () => {
        setVisibleCreateForm(!visibleCreateForm);
    };

    const onOpenUpdateForm = (record) => {
        setCurrentId(record.id);
        setCurrentRecord(record);
        setVisibleUpdateForm(true);
    };

    const onCloseUpdateForm = () => {
        setVisibleUpdateForm(false);
        setCurrentId(null);
        setCurrentRecord({});
    };

    // const onCreate = async (data) => {
    //     try {
    //         await newcreatePayoutsBeneficiaryAccounts(data);
    //         console.log(data);
    //         // refresh list
    //         navigate({
    //             pathname: location.pathname,
    //             search: stringifyQueryParams({}),
    //         });
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };


    const onCreate = async (data) => {
        try {
            const response = await newcreatePayoutsBeneficiaryAccounts(data);
            console.warn(response.message);
    
            if (response.message === false) {
                alert(response.status);
                // showAlert(response.status);
            }
            console.log(data);
            navigate({
                pathname: location.pathname,
                search: stringifyQueryParams({}),
            });
        } catch (err) {
            console.log(err);
        }
    };
    
 const onUpdate = async (data) => {
        try {
            await updatePayoutsBeneficiaryAccounts(currentId, data);
            // refresh list
            navigate({
                pathname: location.pathname,
                search: stringifyQueryParams({}),
            });
        } catch (err) {
            console.log(err);
        }
    };

    const onDelete = async (id) => {
        try {
            Modal.confirm({
                title: 'Warning',
                content: 'Do you want to delete this transaction?',
                onOk: async () => {
                    await deletePayoutsBeneficiaryAccounts(id);
                    // refresh list
                    navigate({
                        pathname: location.pathname,
                        search: stringifyQueryParams({}),
                    });
                },
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            {/* <PageTitle titles={titles} /> */}
            <Row gutter={[16, 8]} align={'middle'} justify={'space-between'} className='bgred'>
                <Col xs={24} md={12} lg={8} xl={7}>
                    <Card className="wallet_box">
                        <TableBar
                            onSearch={onSearch}
                            showFilter={false}
                            placeholderInput="Search..."
                            inputRef={searchRef}
                            // children={
                            // }
                        />
                    </Card>
                </Col>
                <Col xs={24} md={12} lg={6} xl={6}>
                    <Card className="wallet_box">
                        <Button type="primary" size="large" onClick={onToggleCreateForm}>
                            Create New Beneficiary
                        </Button>
                    </Card>
                </Col>
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
                />
            </Spin>
            <CreatePayoutsBeneficiaryAccountForm
                users={users}
                visible={visibleCreateForm}
                onClose={onToggleCreateForm}
                onSubmit={onCreate}
            />
            <UpdatePayoutsBeneficiaryAccountForm
                users={users}
                visible={visibleUpdateForm}
                onClose={onCloseUpdateForm}
                onSubmit={onUpdate}
                record={currentRecord}
            />
        </div>
    );
};

export default PayoutsBeneficiaryAccountList;
