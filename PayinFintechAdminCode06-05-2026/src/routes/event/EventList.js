import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Row, Modal, Table, Button, Switch } from 'antd';
import TableBar from 'components/TableBar';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import { getEvents, createEvent, deleteEvent, updateEvent } from 'requests/event';
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid';
import PageTitle from 'components/PageTitle';
import parse from 'html-react-parser';
import EventCreateForm from 'routes/event/EventCreateForm';
import EventUpdateForm from 'routes/event/EventUpdateForm';
import { EVENT_TYPES } from 'constants/common';
import EventWhatsappTemplate from 'routes/event/EventWhatsappTemplate.js';
import 'assets/styles/event.scss';

const EventList = () => {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = useState(0);
    const [records, setRecords] = useState([]);
    const [visibleCreateForm, setVisibleCreateForm] = useState(false);
    const [visibleUpdateForm, setVisibleUpdateForm] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [visibleWhatsappTemplate, setVisibleWhatsappTemplate] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const titles = [{ path: location.pathname, title: 'Notification Events' }];

    const onUpdateStatus = async (data) => {
        try {
            await updateEvent(data.id, { status: !data.status });

            // refresh list
            navigate({
                pathname: location.pathname,
                search: stringifyQueryParams({}),
            });
        } catch (err) {
            console.log(err);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Button className="p-0" type="link" onClick={() => onEdit(record)}>
                    {text}
                </Button>
            ),
            sorter: true,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text) => {
                return parse(text);
            },
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (text, record) => {
                const type = EVENT_TYPES.filter((item) => item.value === record.type);
                return <div>{type[0]?.display}</div>;
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                return (
                    <Switch
                        defaultChecked={text}
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                        onChange={() => onUpdateStatus(record)}
                    />
                );
            },
        },
        {
            title: 'Whatsapp template',
            render: (record) => (
                <div style={{ textAlign: 'center', color: '#6C5DD3' }}>
                    <PencilAltIcon width={24} onClick={() => showEditWhatsappTemplate(record)} />
                </div>
            ),
        },
        {
            title: 'Actions',
            render: (text, record) => (
                <Button danger type="link" size="small" onClick={() => onDelete(record.id)}>
                    <TrashIcon width={24} height={24} />
                </Button>
            ),
        },
    ];

    useEffect(() => {
        const query = parseQueryParams(location);
        getRecords(query);
    }, [location]);

    const onChangeTable = (pagination, filters, sorter, extra) => {
        console.log(pagination, filters, sorter, extra);

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
                order_type: sorter.order === 'ascend' ? 'asc' : 'desc',
            };
        } else {
            delete query.order_by;
            delete query.order_type;
        }

        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query),
        });
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

    const getRecords = async (query) => {
        try {
            const response = await getEvents(query);

            setRecords(response.records);
            setPage(response.page);
            setPerPage(response.per_page);
            setTotalCount(response.total_records);
        } catch (err) {
            console.log(err);
        }
    };

    const onToggleCreateForm = () => {
        setVisibleCreateForm(!visibleCreateForm);
    };

    const onCreate = async (data) => {
        try {
            await createEvent(data);

            // refresh list
            navigate({
                pathname: location.pathname,
                search: stringifyQueryParams({}),
            });
        } catch (err) {
            console.log(err);
        }
    };

    const onEdit = (event) => {
        setSelectedEvent(event);
        onToggleUpdateForm();
    };

    const showEditWhatsappTemplate = (event) => {
        setSelectedEvent(event);
        setVisibleWhatsappTemplate(true);
    };

    const closeEditWhatsappTemplate = () => {
        setSelectedEvent(null);
        setVisibleWhatsappTemplate(false);
    };

    const onToggleUpdateForm = () => {
        // in case hide update form, set selected event is null
        if (visibleUpdateForm) setSelectedEvent(null);

        setVisibleUpdateForm(!visibleUpdateForm);
    };

    const onUpdate = async (data) => {
        try {
            await updateEvent(selectedEvent.id, data);

            // refresh list
            navigate({
                pathname: location.pathname,
                search: stringifyQueryParams({}),
            });
        } catch (err) {
            console.log(err);
        }
    };

    const onDelete = (id) => {
        Modal.confirm({
            title: 'Warning',
            content: 'Are you sure to delete this record?',
            onOk: async () => {
                await deleteEvent(id);
                // refresh list
                navigate({
                    pathname: location.pathname,
                    search: stringifyQueryParams({}),
                });
            },
        });
    };

    return (
        <div>
            <PageTitle titles={titles} />
            <TableBar showFilter={false} onSearch={onSearch} />
            <Row className="mb-16" justify="end">
                <Button type="primary" onClick={onToggleCreateForm}>
                    Create new event
                </Button>
            </Row>
            <Table
                columns={columns}
                dataSource={records}
                rowKey="id"
                onChange={onChangeTable}
                indentSize={25}
                pagination={{
                    pageSize: perPage,
                    total: totalCount,
                    current: page,
                }}
            />
            <EventCreateForm visible={visibleCreateForm} onClose={onToggleCreateForm} onSubmit={onCreate} />
            {selectedEvent ? (
                <EventUpdateForm
                    record={selectedEvent}
                    visible={visibleUpdateForm}
                    onClose={onToggleUpdateForm}
                    onSubmit={onUpdate}
                />
            ) : null}
            <EventWhatsappTemplate
                visible={visibleWhatsappTemplate}
                event={selectedEvent}
                onClose={closeEditWhatsappTemplate}
                onSubmit={onUpdate}
            />
        </div>
    );
};

export default EventList;
