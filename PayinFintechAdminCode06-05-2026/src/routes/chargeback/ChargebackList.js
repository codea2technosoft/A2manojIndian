import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Spin, Table, Button, Switch, Modal, Row } from 'antd';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import PageTitle from 'components/PageTitle';
import TableBar from 'components/TableBar';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import ChargebackCreateForm from './ChargebackCreateForm';
import ChargebackUpdateForm from './ChargebackUpdateForm';
import { EditSquare, Delete } from "react-iconly";
// request
import { getPartners } from 'requests/user';
import { getChargebackTransactions, createChargebackTransaction, updateChargebackTransaction, deleteChargebackTransaction } from 'requests/chargeback';

const ChargebackList = () => {
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

    const config = useSelector(state => state.config);

    const searchRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const titles = [{ path: location.pathname, title: 'Chargeback Transactions' }];

    const columns = [
        {
            title: 'ID',
            key: 'id',
            dataIndex: 'id',
        },
        {
            title: 'Partner',
            render: (text, record) => (
                <div>
                    <div>{record.partner.full_name}</div>
                    <div>{record.partner.email}</div>
                </div>
            )
        },
        {
            title: 'Transaction ID',
            key: 'tx_id',
            dataIndex: 'tx_id'
        },
        {
            title: 'Amount',
            key: 'amount',
            dataIndex: 'amount'
        },
        {
            title: 'Note',
            key: 'note',
            dataIndex: 'note'
        },
        {
            title: 'Chargeback at',
            key: 'chargeback_at',
            dataIndex: 'chargeback_at',
            render: (text) => (
                <span>{new Date(text).toLocaleString('en-GB')}</span>
            )
        },
        {
            title: 'Actions',
            render: (text, record) => (
                <div>
                    <Button type="link" size="small" onClick={() => onOpenUpdateForm(record)}>
                        <EditSquare set="light" primaryColor="blueviolet" />
                    </Button>
                    <Button type="link" size="small" onClick={() => onDeleteTransaction(record.id)}>
                        <Delete set="light" primaryColor="red" />
                    </Button>
                </div>
            )
        },
    ];

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getPartners({ is_paginate: 0 });
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
            const response = await getChargebackTransactions(query);

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

    const onCreateTransaction = async (data) => {
        try {
            await createChargebackTransaction(data);
            // refresh list
            navigate({
                pathname: location.pathname,
                search: stringifyQueryParams({}),
            });
        } catch (err) {
            console.log(err);
        }
    }

    const onUpdateTransaction = async (data) => {
        try {
            await updateChargebackTransaction(currentId, data);
            // refresh list
            navigate({
                pathname: location.pathname,
                search: stringifyQueryParams({}),
            });
        } catch (err) {
            console.log(err);
        }
    }

    const onDeleteTransaction = async (id) => {
        try {
            Modal.confirm({
                title: 'Warning',
                content: 'Do you want to delete this transaction?',
                onOk: async () => {
                    await deleteChargebackTransaction(id);
                    // refresh list
                    navigate({
                        pathname: location.pathname,
                        search: stringifyQueryParams({}),
                    });
                }
            })
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <PageTitle titles={titles} />
            <Row justify='space-between' align='middle' className='mt-16'>
            <TableBar
                onSearch={onSearch}
                showFilter={false}
                placeholderInput="Search..."
                inputRef={searchRef}
                children={
                    <div>
                        <Button type='primary' size='large' onClick={onToggleCreateForm}>
                            Create new transaction
                        </Button>
                    </div>
                }
                
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
                />
            </Spin>
            <ChargebackCreateForm
                users={users}
                visible={visibleCreateForm}
                onClose={onToggleCreateForm}
                onSubmit={onCreateTransaction}
            />
            <ChargebackUpdateForm
                users={users}
                visible={visibleUpdateForm}
                onClose={onCloseUpdateForm}
                onSubmit={onUpdateTransaction}
                record={currentRecord}
            />
        </div>
    );
};

export default ChargebackList;
