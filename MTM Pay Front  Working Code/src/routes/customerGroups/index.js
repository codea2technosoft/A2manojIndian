import { PencilIcon, PlusSmIcon } from "@heroicons/react/solid";
import { Button, Modal, Spin, Table, Tabs } from "antd";
import PageTitle from "components/PageTitle";
import TableBar from "components/TableBar";
import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
// requests
import { getCustomerGroups } from "requests/customerGroup";

const CustomerGroupList = () => {
    const [isTableLoading, setIsTableLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = React.useState(0);
    const [records, setRecords] = React.useState([]);
    const [currentRecord, setCurrentRecord] = React.useState([]);
    const [visibleCreateForm, setVisibleCreateForm] = React.useState(false);
    const [visibleAddressList, setVisibleAddressList] = React.useState(false);
    const [visibleUpdateForm, setVisibleUpdateForm] = React.useState(false);
    const [addresses, setAddresses] = React.useState([]);
    const [currentId, setCurrentId] = React.useState(null);


    const location = useLocation();
    const navigate = useNavigate();

    const titles = [{ path: location.pathname, title: "Customer groups" }];

    const columns = [
        {
            title: "ID",
            key: "id",
            dataIndex: "id",
        },
        {
            title: "Name",
            key: "name",
            dataIndex: "name",
        },
        {
            title: "Store",
            render: (record) => (
                <Link to={`/stores/${record.store_id}`}>
                    {record.user_store.store_name}
                </Link>
            )
        },
    ];

    const getRecords = async (query) => {
        try {
            setIsTableLoading(true);
            const response = await getCustomerGroups(query);
            setIsTableLoading(false);
            setRecords(response.records);
            setPage(response.page);
            setPerPage(response.per_page);
            setTotalCount(response.total_records);
        } catch (err) {
            console.log(err);
        }
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

    useEffect(() => {
        const query = parseQueryParams(location);
        getRecords(query);
    }, [location]);


    const onChangeTable = (pagination) => {
        console.log(pagination)

        let query = parseQueryParams(location);
        query = {
            ...query,
            page: pagination.current,
            per_page: pagination.pageSize,
        };

        navigate({
            pathname: location.pathname,
            search: stringifyQueryParams(query)
        });
    }

    return (
        <div>
            <PageTitle titles={titles} />
            <TableBar onSearch={onSearch} showFilter={false} />
            {/* <CurrenViewing onRefresh={onRefresh} /> */}
            <Spin spinning={isTableLoading}>
                <Table
                    dataSource={records}
                    columns={columns}
                    onChange={onChangeTable}
                    rowKey={"id"}
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

export default CustomerGroupList;
