import React, { useEffect, useRef } from 'react';
import { Spin, Table, Space, Switch } from 'antd';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import PageTitle from 'components/PageTitle';
import TableBar from 'components/TableBar';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
// request
import { getSms } from 'requests/sms';

const SmsList = () => {
    const [isTableLoading, setIsTableLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = React.useState(0);
    const [records, setRecords] = React.useState([]);
    const searchRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const titles = [{ path: location.pathname, title: 'Transaction Sms' }];

    const columns = [
        {
            title: 'ID',
            key: 'id',
            dataIndex: 'id',
        },
        {
            title: 'Content',
            key: 'content',
            dataIndex: 'content',
        },
        {
            title: 'Last 4 digits',
            key: 'last_four_digits',
            dataIndex: 'last_four_digits',
        },
        {
            title: 'Ref. no',
            key: 'ref',
            dataIndex: 'ref'
        },
        {
            title: 'Amount',
            key: 'amount',
            dataIndex: 'amount'
        },
        {
            title: 'Paid at',
            key: 'paid_at',
            dataIndex: 'paid_at',
        }
    ];

    useEffect(() => {
        const query = parseQueryParams(location);
        getRecords(query);
    }, [location]);

    const getRecords = async (query) => {
        try {
            setIsTableLoading(true);
            const response = await getSms(query);
            
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

    return (
        <div>
            <PageTitle titles={titles} />
            <TableBar
                onSearch={onSearch}
                showFilter={false}
                placeholderInput="Search..."
                inputRef={searchRef}
            />
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
        </div>
    );
};

export default SmsList;
