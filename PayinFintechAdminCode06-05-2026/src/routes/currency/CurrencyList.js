import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Row, Modal, Table, Button } from "antd";
import TableBar from "components/TableBar";
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import { getCurrencies, createCurrency, deleteCurrency, updateCurrency } from 'requests/currency';
import { TrashIcon } from '@heroicons/react/outline';
import PageTitle from 'components/PageTitle';
import CurrencyCreateForm from 'routes/currency/CurrencyCreateForm';
import CurrencyUpdateForm from 'routes/currency/CurrencyUpdateForm';

const CurrencyList = () => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = useState(0);
    const [records, setRecords] = useState([]);
    const [visibleCreateForm, setVisibleCreateForm] = useState(false);
    const [visibleUpdateForm, setVisibleUpdateForm] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    const titles = [{ path: location.pathname, title: 'Currencies' }];

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Button className='p-0' type="link" onClick={() => onEdit(record)}>{text}</Button>
            ),
            sorter: true
        },
        {
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'symbol'
        },
        {
            title: 'Display type',
            dataIndex: 'display_type',
            key: 'display_type',
            sorter: true
        },
        {
            title: 'Thousand',
            dataIndex: 'thousand',
            key: 'thousand',
            sorter: true
        },
        {
            title: 'Exchange rate',
            dataIndex: 'exchange_rate',
            key: 'exchange_rate',
            sorter: true
        },
        {
            title: 'Actions',
            render: (text, record) => (
                <Button danger type='link' size='small' onClick={() => onDelete(record.id)}>
                    <TrashIcon width={24} height={24} />
                </Button>
            )
        },
    ];

    useEffect(() => {
        const query = parseQueryParams(location);
        getRecords(query);
    }, [location]);

    const onChangeTable = (pagination, filters, sorter, extra) => {
        console.log(pagination, filters, sorter, extra)

        let query = parseQueryParams(location);
        query = {
            ...query,
            page: pagination.current,
            per_page: pagination.pageSize,
        };

        if (sorter.order) {
            query = {
                ...query,
                order_by: sorter.field,
                order_type: sorter.order === 'ascend' ? 'asc' : 'desc'
            }
        } else {
            delete query.order_by;
            delete query.order_type;
        }

        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query)
        });
    }

    const onSearch = (keyword) => {
        let query = parseQueryParams(location);
        query = {
            ...query,
            page: 1,
            keyword: keyword
        };

        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query)
        });
    }

    const getRecords = async (query) => {
        try {
            const response = await getCurrencies(query);
            setRecords(response.records);
            setPage(response.page);
            setPerPage(response.per_page);
            setTotalCount(response.total_records);
        } catch (err) {
            console.log(err);
        }
    }

    const onToggleCreateForm = () => {
        setVisibleCreateForm(!visibleCreateForm);
    }

    const onCreate = async (data) => {
        try {
            await createCurrency(data);

            // refresh list
            navigate({
                pathname: location.pathname,
                search: stringifyQueryParams({})
            });
        } catch (err) {
            console.log(err);
        }
    }

    const onEdit = (currency) => {
        setSelectedCurrency(currency);
        onToggleUpdateForm();
    }

    const onToggleUpdateForm = () => {
        // in case hide update form, set selected currency is null
        if (visibleUpdateForm) setSelectedCurrency(null);

        setVisibleUpdateForm(!visibleUpdateForm);
    }

    const onUpdate = async (data) => {
        try {
            await updateCurrency(selectedCurrency.id, data);

            // refresh list
            navigate({
                pathname: location.pathname,
                search: stringifyQueryParams({})
            });
        } catch (err) {
            console.log(err);
        }
    }

    const onDelete = (id) => {
        Modal.confirm({
            title: "Warning",
            content: "Are you sure to delete this record?",
            onOk: async () => {
                await deleteCurrency(id);
                // refresh list
                navigate({
                    pathname: location.pathname,
                    search: stringifyQueryParams({})
                });
            }
        });
    }

    return (
        <div>
            <PageTitle titles={titles} />
            <TableBar
                showFilter={false}
                onSearch={onSearch}
            />
            <Row className="mb-16" justify="end">
                <Button type="primary" onClick={onToggleCreateForm}>Create new currency</Button>
            </Row>
            <Table
                columns={columns}
                dataSource={records}
                rowKey='id'
                onChange={onChangeTable}
                pagination={{
                    pageSize: perPage,
                    total: totalCount,
                    current: page,
                }}
            />
            <CurrencyCreateForm
                visible={visibleCreateForm}
                onClose={onToggleCreateForm}
                onSubmit={onCreate}
            />
            {
                selectedCurrency ? (
                    <CurrencyUpdateForm
                        record={selectedCurrency}
                        visible={visibleUpdateForm}
                        onClose={onToggleUpdateForm}
                        onSubmit={onUpdate}
                    />
                ) : null
            }
        </div>
    )
}

export default CurrencyList;