import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Spin, Table, Button, Row } from 'antd';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import PageTitle from 'components/PageTitle';
import TableBar from 'components/TableBar';
// import { BaseSelect } from 'components/Elements';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import { formatCurrency, generateServiceName, generateSettlementStatusLabel } from 'utils/common';
import { toast } from 'react-toast';
import _ from 'lodash';
import { EditSquare } from 'react-iconly';
import SettlementCreateForm from './SettlementCreateForm';
import SettlementUpdateForm from './SettlementUpdateForm';
// request
import { getSettlements, createSettlement, updateSettlement } from 'requests/order';
import { getPartners, getUsersOfPartner } from 'requests/user';
import { getServices } from 'requests/service';


const SettlementList = () => {
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = useState(0);
    const [records, setRecords] = useState([]);
    const [visibleCreateModal, setVisibleCreateModal] = useState(false);
    const [partners, setPartners] = useState([]);
    const [users, setUsers] = useState([]);
    const [paymentServices, setPaymentServices] = useState([]);
    const [visibleUpdateModal, setVisibleUpdateModal] = useState(false);
    const [currentRecord, setCurrentRecord] = useState({});

    const config = useSelector(state => state.config);

    const searchRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const titles = [{ path: location.pathname, title: 'Settlements' }];

    const columns = [
        {
            title: 'ID',
            key: 'id',
            dataIndex: 'id',
        },
        {
            title: 'Partner / User',
            render: (text, record) => (
                <div>
                    <div><b>{record.user.parent ? record.user.parent.full_name : null}</b></div>
                    <div>{record.user.full_name}</div>
                </div>
            )
        },
        {
            title: 'Settlement ID',
            key: 'settlement_id',
            dataIndex: 'settlement_id',
            render: (text, record) => (
                <div>
                    <div><strong>{generateServiceName(config.service_types, record.service_id)}</strong></div>
                    <div>{text}</div>
                </div>
            )
        },
        {
            title: 'Amount',
            render: (text, record) => (
                <div>
                    <div>{formatCurrency(record.amount_requested)}</div>
                </div>
            )
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (text) => generateSettlementStatusLabel(text)
        },
        {
            title: 'Created at',
            key: 'created_at',
            dataIndex: 'created_at',
        },
        {
            title: 'Action',
            render: (text, record) => (
                <Button type="link" size="small" onClick={() => onOpenUpdateForm(record)}>
                    <EditSquare set="light" primaryColor="blueviolet" />
                </Button>
            )
        }
    ];

    useEffect(() => {
        getAllPartners();
        getAllPaymentServices();
    }, []);

    useEffect(() => {
        const query = parseQueryParams(location);
        getRecords(query);
    }, [location]);

    const getAllPaymentServices = async () => {
        try {
            const servicesResponse = await getServices(1, { is_paginate: 0 });
            setPaymentServices(servicesResponse.records);
        } catch (err) {
            console.log(err);
        }
    }

    const getAllPartners = async (keyword = '') => {
        try {
            const partnerResponse = await getPartners({ is_paginate: 0, keyword: keyword });
            setPartners(partnerResponse.records);
        } catch (err) {
            console.log(err);
        }
    }

    const getRecords = async (query) => {
        try {
            setIsTableLoading(true);
            const response = await getSettlements(query);

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

    const onChangePartner = async (partnerId) => {
        const userResponse = await getUsersOfPartner(partnerId, { is_paginate: 0 });
        setUsers(userResponse.records);
    }

    const onSubmit = async (formData) => {
        try {
            await createSettlement(formData);
            onCloseCreateSettlementForm();
            onRefresh();
        } catch (err) {
            toast.error('An error occurred. Please try again.');
        }
    }

    const onCloseCreateSettlementForm = () => {
        setVisibleCreateModal(false);
    }

    const onSearchPartners = _.debounce((keyword) => {
        getAllPartners(keyword);
    }, 500);

    const onOpenUpdateForm = (record) => {
        setCurrentRecord(record);
        onChangePartner(record.partner_id);
        setVisibleUpdateModal(true);
    }

    const onCloseUpdateForm = () => {
        setVisibleUpdateModal(false);
        setCurrentRecord({});
    }

    const onUpdate = async (formData) => {
        try {
            await updateSettlement(currentRecord.id, formData);
            onRefresh();
        } catch (err) {
            toast.error('An error occurred. Please try again.');
        }
    }

    return (
        <div>
            <PageTitle titles={titles} />
            <Row justify='space-between' align='middle' className='mt-16'>
                <TableBar
                    onSearch={onSearch}
                    showFilter={false}
                    placeholderInput="Search."
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
                />

            </Spin>
            <SettlementCreateForm
                visible={visibleCreateModal}
                partners={partners}
                users={users}
                paymentServices={paymentServices}
                settlementStatuses={config.settlement_statuses}
                onClose={onCloseCreateSettlementForm}
                onSubmit={onSubmit}
                onChangePartner={onChangePartner}
                onSearchPartners={onSearchPartners}
            />
            <SettlementUpdateForm
                record={currentRecord}
                visible={visibleUpdateModal}
                partners={partners}
                users={users}
                paymentServices={paymentServices}
                settlementStatuses={config.settlement_statuses}
                onClose={onCloseUpdateForm}
                onSubmit={onUpdate}
                onChangePartner={onChangePartner}
                onSearchPartners={onSearchPartners}
            />
        </div>
    );
};

export default SettlementList;
