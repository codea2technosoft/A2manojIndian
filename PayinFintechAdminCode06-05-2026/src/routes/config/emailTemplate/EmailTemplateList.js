import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Row, Modal, Table, Button, Switch, Tag } from 'antd';
import TableBar from 'components/TableBar';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import PageTitle from 'components/PageTitle';
import moment from 'moment';
// requests
import {
	getEmailTemplates,
    updateEmailTemplate
} from 'requests/emailTemplate';

const EmailTemplateList = () => {
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
	const [totalCount, setTotalCount] = useState(0);
	const [records, setRecords] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    const titles = [
        { path: '/config', title: 'Config' },
        { path: location.pathname, title: 'Email Templates' },
    ];

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true
        },
        {
            title: 'Event',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Link to={`${location.pathname}/${record.id}`}>{text}</Link>
            )
        },
        {
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (text, record) => {
				return (
					<Switch
						checked={text === 0 ? false : true}
						checkedChildren="Active"
						unCheckedChildren="Inactive"
						onChange={() => onUpdateStatus(record)}
					/>
				);
			},
		},
        {
            title: 'Last update at',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (text) => (
                <div>{moment(text).format('YYYY-MM-DD HH:mm')}</div>
            )
        }
    ];

    useEffect(() => {
        const query = parseQueryParams(location);
        getRecords(query);
    }, [location]);
    
    const onUpdateStatus = async (data) => {
		try {
			await updateEmailTemplate(data.id, { status: data.status === 0 ? 1 : 0 });

			// refresh list
			navigate({
				pathname: location.pathname,
				search: stringifyQueryParams({}),
			});
		} catch (err) {
			console.log(err);
		}
	};

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
            setLoading(true);
            const response = await getEmailTemplates(query);
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

    return (
        <div>
            <PageTitle titles={titles} />
            <TableBar
                showFilter={false}
                onSearch={onSearch}
            />
            <Row className="mb-16" justify="end">
                <Link to={`${location.pathname}/create`}>
					<Button type="primary">
						Create new template
					</Button>
				</Link>
            </Row>
            <Table
                columns={columns}
                dataSource={records}
                rowKey='id'
                loading={loading}
                onChange={onChangeTable}
                pagination={{
                    pageSize: perPage,
                    total: totalCount,
                    current: page,
                }}
            />
        </div>
    )
}

export default EmailTemplateList;