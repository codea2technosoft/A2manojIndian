import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Spin, Table, Space, Switch, Row, InputNumber, Button } from 'antd';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import _ from 'lodash';
import PageTitle from 'components/PageTitle';
import TableBar from 'components/TableBar';
import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import { BaseSelect } from 'components/Elements';
// request
import { getPartners} from 'requests/userone';

const PartnerList = () => {
    const [isTableLoading, setIsTableLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
    const [totalCount, setTotalCount] = useState(0);
    const [records, setRecords] = useState([]);

    const searchRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const config = useSelector(state => state.config);

    const titles = [{ path: location.pathname, title: 'Partners' }];

    const columns = [
        {
            title: 'ID',
            key: 'id',
            dataIndex: 'id'
        },
        {
            title: 'Name',
            key: 'full_name',
            dataIndex: 'full_name'
        },
        {
            title: 'Email',
            key: 'email',
            dataIndex: 'email'
        },
        {
            title: 'Phone',
            key: 'mobile',
            dataIndex: 'mobile',
        },
        // {
        //     title: 'Settlement Cycle',
        //     key: 'settlement_cycle',
        //     dataIndex: 'settlement_cycle',
        //     render: (text, record) => (
        //         <BaseSelect
        //             style={{width: 300}}
        //             selected={text}
        //             defaultText={!text ? 'Select one' : ''}
        //             options={config.settlement_cycles}
        //             optionLabel='display'
        //             optionValue='value'
        //             onChange={(value) => onUpdate(record.id, { settlement_cycle: Number(value) })}
        //         />
        //     )
        // },
        // {
        //     title: 'Status',
        //     key: 'status',
        //     dataIndex: 'status',
        //     render: (text, record) => {
        //         return (
        //             <Switch
        //                 defaultChecked={text === 0 ? false : true}
        //                 checkedChildren="Active"
        //                 unCheckedChildren="Inactive"
        //                 onChange={(value) => onUpdate(record.id, { status: Number(value) })}
        //             />
        //         );
        //     },
        // },
        {
            title: 'Actions',
            render: (record) => (
                <Link to={`/partners/${record.id}/users`}>
                    <Button>Manage</Button>
                </Link>
            )
        },
    ];

    useEffect(() => {
        const query = parseQueryParams(location);
        getRecords(query);
    }, [location]);


    const getRecords = async (query) => {
        try {
             setIsTableLoading(true);
            const response = await getPartners(query);     
            setRecords(response.records);
            setPage(response.page);
            setPerPage(response.per_page);
            setTotalCount(response.total_records);
         
        } 
        catch (err) {
          alert(err.message);
          console.log(err);
        } 
        finally {
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

    // const onRefresh = () => {
    //     let query = parseQueryParams(location);
    //     query = {
    //         page: 1,
    //         keyword: '',
    //     };

    //     navigate({
    //         pathname: location.pathname,
    //         search: stringifyQueryParams(query),
    //     });

    //     if (searchRef.current?.input.value) {
    //         searchRef.current.handleReset();
    //     }
    // };

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

    // const onUpdate = _.debounce(async (id, data) => {
    //     try {
    //         setIsTableLoading(true);
    //         await updatePartner(id, data);
    //     } catch (err) {
    //         console.log(err);
    //     } finally {
    //         setIsTableLoading(false);
    //     }
    // }, 500);

    return (
        <div>
            <PageTitle titles={titles} />
            <Row justify='space-between' align='middle'>
                <TableBar
                    onSearch={onSearch}
                    showFilter={false}
                    placeholderInput="Search..."
                    inputRef={searchRef}
                />
            </Row>
            
                <Table
                    loading={isTableLoading}
                    dataSource={records}
                    columns={columns}
                    onChange={onChangeTable}
                    rowKey={'id'}
                    pagination={{
                        pageSize: perPage,
                        total: totalCount,
                        current: page,
                    }}
                    scroll={{
                        x: true
                    }}
                />
            
        </div>
    );  
};

export default PartnerList;
