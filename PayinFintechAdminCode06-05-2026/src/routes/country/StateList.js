import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Row, Modal, Table, Button } from "antd";
import TableBar from "components/TableBar";
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import { getCountry, getStates, createState, updateState, deleteState } from 'requests/country';
import { TrashIcon } from '@heroicons/react/outline';
import PageTitle from 'components/PageTitle';
import Loading from 'components/Loading';
import StateCreateForm from 'routes/country/StateCreateForm';
import StateUpdateForm from 'routes/country/StateUpdateForm';

const StateList = () => {
    const [loading, setLoading] = useState(true);
    const [country, setCountry] = useState(null);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = useState(0);
    const [records, setRecords] = useState([]);
    const [visibleCreateForm, setVisibleCreateForm] = useState(false);
    const [visibleUpdateForm, setVisibleUpdateForm] = useState(false);
    const [selectedState, setSelectedState] = useState(null);
    const [titles, setTitles] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Button className='p-0' type="link" onClick={() => onEdit(record)}>{text}</Button>
            )
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code'
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

    const onChangePagination = (page, pageSize) => {
        let query = parseQueryParams(location);
        query = {
            ...query,
            page,
            per_page: pageSize
        };

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
            // get country detail
            const country = await getCountry(params.id);
            setCountry(country);

            setTitles([
                { path: '/countries', title: 'Countries' },
                { path: `/countries/${country.id}`, title: country.name },
                { path: `/countries/${country.id}/states`, title: 'States' },
            ]);

            // get states
            const response = await getStates(params.id, query);
            setRecords(response.records);
            setPage(response.page);
            setPerPage(response.per_page);
            setTotalCount(response.total_records);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const onToggleCreateForm = () => {
        setVisibleCreateForm(!visibleCreateForm);
    }

    const onCreate = async (data) => {
        try {
            await createState(params.id, data);

            // refresh list
            navigate({
                pathname: location.pathname,
                search: stringifyQueryParams({})
            });
        } catch (err) {
            console.log(err);
        }
    }

    const onEdit = (state) => {
        setSelectedState(state);
        onToggleUpdateForm();
    }

    const onToggleUpdateForm = () => {
        // in case hide update form, set selected state is null
        if (visibleUpdateForm) setSelectedState(null);

        setVisibleUpdateForm(!visibleUpdateForm);
    }

    const onUpdate = async (data) => {
        try {
            await updateState(params.id, selectedState.id, data);

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
                await deleteState(params.id, id);
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
            {
                loading ? (
                    <Loading />
                ) : (
                    <div>
                        <PageTitle titles={titles} />
                        <TableBar
                            showFilter={false}
                            onSearch={onSearch}
                        />
                        <Row className="mb-16" justify="end">
                            <Button type="primary" onClick={onToggleCreateForm}>Create new state</Button>
                        </Row>
                        <Table
                            columns={columns}
                            dataSource={records}
                            rowKey='id'
                            pagination={{
                                pageSize: perPage,
                                total: totalCount,
                                current: page,
                                onChange: onChangePagination
                            }}
                        />
                        <StateCreateForm
                            visible={visibleCreateForm}
                            onClose={onToggleCreateForm}
                            onSubmit={onCreate}
                        />
                        {
                            selectedState ? (
                                <StateUpdateForm
                                    record={selectedState}
                                    visible={visibleUpdateForm}
                                    onClose={onToggleUpdateForm}
                                    onSubmit={onUpdate}
                                />
                            ) : null
                        }
                    </div>
                )
            }
        </div>
    )
}

export default StateList;