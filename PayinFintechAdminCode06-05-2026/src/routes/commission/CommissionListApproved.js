import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Switch, Card, Row, Col } from 'antd';
import TableBar from "components/TableBar";
import { useLocation, useNavigate } from 'react-router-dom';
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import OverviewCardByDate from './OverviewCardByDate';
import DatePicker from 'components/DatePicker';
import api from 'utils/api';
import PageTitle from "components/PageTitle";
const { RangePicker } = DatePicker;

const CommissionListApproved = () => {
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
  const [totalCount, setTotalCount] = useState(0);
  const [records, setRecords] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState([]);
  const [mode, setMode] = useState('today');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const titles = [{ path: location.pathname, title: "Settled Comission" }];

  const columns = [
   
    {
      title: 'Payment Getway',
      key: 'payment_getway',
      dataIndex: 'payment_getway',
    },

    {
      title: 'Transaction Amount',
      key: 'total_amt',
      dataIndex: 'total_amt'
    },
    {
      title: 'Amount',
      key: 'amount',
      dataIndex: 'amount'
    },

    {
      title: 'Gateway Charge',
      key: 'reserve_amount',
      dataIndex: 'reserve_amount'
    },
    


    {
      title: 'S2P Change',
      key: 'management_fee',
      dataIndex: 'management_fee'
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status'
    },

  ];


  const fetchManagerList = async (keyword, dateRange) => {
    setIsTableLoading(true);
    try {
      let start, end;

      // Set the start and end dates based on the selected date range
     if (dateRange === 'today') {
        start = new Date().toISOString().slice(0, 10);
        end = start;
      } else if (dateRange === 'yesterday') {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        start = end = yesterday.toISOString().slice(0, 10);
      } else if (dateRange === 'last7Days') {
        const currentDate = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(currentDate.getDate() - 7);
        start = sevenDaysAgo.toISOString().slice(0, 10);
        end = new Date().toISOString().slice(0, 10);
      } else if (dateRange === 'last30Days') {
        const currentDate = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(currentDate.getDate() - 30);
        start = thirtyDaysAgo.toISOString().slice(0, 10);
        end = new Date().toISOString().slice(0, 10);
      } else if (dateRange === 'last90Days') {
        const currentDate = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(currentDate.getDate() - 90);
        start = thirtyDaysAgo.toISOString().slice(0, 10);
        end = new Date().toISOString().slice(0, 10);
      } else if (Array.isArray(dateRange) && dateRange.length === 2) {
        start = dateRange[0].toISOString().slice(0, 10);
        end = dateRange[1].toISOString().slice(0, 10);
      }
      
      else {
        // Default to fetching all records
        start = '';
        end = '';
      }

      const response = await api.get('/admin/summary/commission-approved', {
        params: {
        
          start: start,
          end: end,
        },
      });

      const data = response.data;
      const filteredRecords = keyword
        ? data.records.filter((record) =>
            record.email.toLowerCase().includes(keyword.toLowerCase())
          )
        : data.records;
      const totalRecords = response.data.total_records;
      setRecords(filteredRecords);
      // setTotalCount(filteredRecords.length);
      setPage(response.data.page);
      setPerPage(response.data.per_page);
      setTotalCount(totalRecords);

    } catch (error) {
      console.error('Error fetching BeneficiaryList:', error);
    }
    setIsTableLoading(false);
  };

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPerPage(pageSize)
    //fetchManagerList('', dateRange);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    fetchManagerList('', dates);
  };

  useEffect(() => {
    fetchManagerList('', dateRange);
  }, []);

  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     // alert(selectedRowKeys);
  //     setSelectedRowKeys(selectedRowKeys);
  //     // onSelectRecords(selectedRowKeys);
  //   },
  //   getCheckboxProps: (record) => ({}),
  // };
  // const onToggleAssignForm = () => {
  //   // alert(selectedRowKeys);
  //   const data = selectedRowKeys;
  //   return new Promise((resolve, reject) => {
  //     return api
  //       .post('/admin/summary/commission-withdraw', data)
  //       .then((response) => {
  //         resolve(response.data);
  //       })
  //       .catch((err) => {
  //         toast.error(err.response.data.message);
  //         reject(err);
  //       });
  //   });
  //   // setVisibleAssignForm(!visibleAssignForm);
  // };
  // const handlePageChange = (newPage) => {
  //   setPage(newPage);
  // };

  // const handlePerPageChange = (newPerPage) => {
  //   setPerPage(newPerPage);
  // };


  const onSearch = (keyword) => {
    let query = parseQueryParams(location.search);
    // alert(query);
    query = {
      ...query,
      page: 1,
      keyword: keyword,
    };

    navigate.push({
      pathname: location.pathname,
      search: stringifyQueryParams(query),
    });

    fetchManagerList(keyword);
  };

  const availableModes = [
		{ key: 'today', label: 'Today' },
		{ key: 'yesterday', label: 'Yesterday' },
		{ key: 'last7days', label: 'Last 7 days' },
		{ key: 'last30days', label: 'Last 30 days' },
    { key: 'last90days', label: 'Last 90 days' },
	];

  return (
    <div>
       <PageTitle titles={titles} />
     <Card className='mb-24'>
     <Row gutter={[8, 8]} align='middle' style={{justifyContent:'space-around'}}>
            <button onClick={() => fetchManagerList('', 'today')} size="large" className='ant-btn ant-btn-default ant-btn-lg'><span>Today</span></button>
            <button onClick={() => fetchManagerList('', 'yesterday')} className='ant-btn ant-btn-default ant-btn-lg'>Yesterday</button>
            <button onClick={() => fetchManagerList('', 'thisWeek')} className='ant-btn ant-btn-default ant-btn-lg'>This Week</button>
            <button onClick={() => fetchManagerList('', 'last7Days')} className='ant-btn ant-btn-default ant-btn-lg'>Last 7 Days</button>
            <button onClick={() => fetchManagerList('', 'last30Days')} className='ant-btn ant-btn-default ant-btn-lg'>Last 30 Days</button>
        <RangePicker onChange={handleDateRangeChange} />
        {/* <Button className="h-50"
          disabled={!selectedRowKeys.length}
          type="default"
          onClick={onToggleAssignForm}
        >
          Settle Selected Amount
        </Button> */}
        </Row>
        </Card>
      <Table
      //  rowSelection={rowSelection}
        loading={isTableLoading}
        dataSource={records}
        columns={columns}
        rowKey="id"
        pagination={{
          total: totalCount,
          showTotal: (total) => `Total ${total} items`,
          pageSize: perPage,
          current: page,
          onChange: handlePageChange,
        }}
        scroll={{
          x: true
        }}
      />
    </div>
  );
};
export default CommissionListApproved;
