import { Button, Table, Tag } from 'antd';
import dayjs from 'dayjs';
import { parse, stringify } from 'qs';
import { useEffect, useState } from 'react';
import { FaRedo } from 'react-icons/fa';
import ReactJson from 'react-json-view';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toast';
import PageTitle from '../../components/PageTitle/index.js';
import { getSentMessageLogs, resendWhatsappMessage } from '../../requests/notification.js';

export default function SentMessageLogs() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [types, setTypes] = useState();
    const [statuses, setStatuses] = useState();
    const [statusColors, setStatusColors] = useState();
    const [currentQuery, setCurrentQuery] = useState({
        page: 1,
        per_page: 10,
    });

    const enumMessageTypes = useSelector((state) => state.config.notification_message_types);
    const enumStatuses = useSelector((state) => state.config.notification_statuses);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const types = {};
        for (const type of enumMessageTypes) {
            types[type.value] = type.display;
        }
        setTypes(types);

        const statuses = {};
        const statusColors = {};
        for (const status of enumStatuses) {
            statuses[status.value] = status.display;
            statusColors[status.value] = status.color;
        }
        setStatuses(statuses);
        setStatusColors(statusColors);
    }, [enumMessageTypes, enumStatuses]);

    useEffect(() => {
        getData();
    }, [location.pathname, location.search]);

    const getData = async () => {
        try {
            setLoading(true);

            const query = parse(location.search.slice(1));
            setCurrentQuery(query);

            const data = await getSentMessageLogs(query);
            setData(data);
        } catch (err) {
            toast.error(err.response?.data.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page, per_page) => {
        const query = {
            ...currentQuery,
            page,
            per_page,
        };

        navigate({
            pathname: location.pathname,
            search: stringify(query),
        });
    };

    const handleResendWhatsappMessage = async (id) => {
        try {
            setLoading(true);
            await resendWhatsappMessage(id);
            toast.success('Success');
            await getData();
        } catch (err) {
            toast.error(err.response?.data.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Order',
            dataIndex: 'order',
            render: (order) => <Link to={`/orders/${order.id}`}>{'#' + order.platform_order_id}</Link>,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            render: (value) => types[value],
        },
        {
            title: 'Receive number',
            dataIndex: 'receive_number',
        },
        {
            title: 'Whatsapp template',
            dataIndex: 'whatsapp_template',
            render: (data) => (
                <div className="whatsapp-template-viewer">
                    <ReactJson src={data} name="template" collapsed />
                </div>
            ),
        },
        {
            title: 'Sent at',
            dataIndex: 'sent_at',
            render: (time) => (
                <div>
                    <span className="nowrap">{dayjs(time).format('YYYY-MM-DD')}</span>
                    <span> </span>
                    <span className="nowrap">{dayjs(time).format('HH:mm')}</span>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (value) => <Tag color={statusColors[value]}>{statuses[value] || value}</Tag>,
        },
        {
            title: 'Action',
            render: (record, index) => (
                <div className="action">
                    <Button onClick={() => handleResendWhatsappMessage(record.id)}>
                        <FaRedo />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="sent-message-logs">
            <PageTitle
                titles={[
                    { path: '/notifications', title: 'Notifications' },
                    { path: '/notifications/logs', title: 'Logs' },
                ]}
            />
            <Table
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={data.records}
                pagination={{
                    current: data.page,
                    pageSize: data.per_page,
                    total: data.total_records,
                    showSizeChanger: true,
                    onChange: handlePageChange,
                }}
            />
        </div>
    );
}
