import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Row, Modal, Table, Button } from "antd";
import TableBar from "components/TableBar";
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import { getCountries, createCountry, deleteCountry } from 'requests/country';
import { TrashIcon } from '@heroicons/react/outline';
import PageTitle from 'components/PageTitle';
import CountryCreateForm from 'routes/country/CountryCreateForm';

const CountryList = () => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = useState(0);
    const [records, setRecords] = useState([]);
    const [visibleCreateForm, setVisibleCreateForm] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const titles = [{ path: location.pathname, title: 'Countries' }];

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
                <Link to={`${location.pathname}/${record.id}`}>{text}</Link>
            ),
            sorter: true
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            sorter: true
        },
        {
            title: 'Mobile code',
            dataIndex: 'mobile_code',
            key: 'mobile_code',
            sorter: true
        },
        {
            title: 'States',
            dataIndex: 'state_count',
            key: 'state_count',
            render: (text, record) => (
                <Link to={`${location.pathname}/${record.id}/states`}>{text} states</Link>
            )
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
            const response = await getCountries(query);
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
            data = {
                ...data,
                mobile_code: `+${data.mobile_code}`
            }
            await createCountry(data);

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
                await deleteCountry(id);
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
                <Button type="primary" onClick={onToggleCreateForm}>Create new country</Button>
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
            <CountryCreateForm
                visible={visibleCreateForm}
                onClose={onToggleCreateForm}
                onSubmit={onCreate}
            />
        </div>
    )
}

export default CountryList;