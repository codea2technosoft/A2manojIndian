import React, { useState, useEffect } from 'react';
import { Select, Table, Button, Pagination, Spin, Card, Row, Space } from 'antd';
import api from 'utils/api';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import PageTitle from "components/PageTitle";
import TableBar from 'components/TableBar';
import DatePicker from 'components/DatePicker';
import $ from "jquery";

import { parseQueryParams, stringifyQueryParams } from 'utils/url';

const { RangePicker } = DatePicker;
const antbtnlg = {
  padding: " 6.4px 15px",
  fontSize: '16px',
  borderRadius: "8px",
  height: "60px",
};
const { Option } = Select;

const GetwaywishPayoutReport = () => {
  const [partnerId, setPartnerId] = useState(null);
  const [getwayId, setGetwayId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesOptions, setServicesOptions] = useState([]);
  const [partnerOptions, setPartnerOptions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRange, setDateRange] = useState(['today']);
  const [records, setRecords] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(
    process.env.REACT_APP_RECORDS_PER_PAGE
  );

  const [totalCount, setTotalCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const titles = [{ path: location.pathname, title: "Payout User wise Report" }];
  const columns = [
    //  {
    //     title: "Sr",
    //     render: (text, record, index) => <span>{index + 1}</span>,
    //   },
    {
      title: 'Merchant Details',
      render: (text, records) => (
        <div>
          <div>
          {records.partneremail}<br/><br/>
          {records.mechantemail}
          </div>
        </div>
      )
    },
    {
      title: 'Total Collection',
      render: (text, records) => (
        <div>
          <div>
            {records.totalAmt}
          </div>
        </div>
      )
    },

    {
      title: 'Gateway Charge',
      render: (text, records) => (
        <div>
          <div>
          {records.transaction_fee}
          </div>
        </div>
      )
    },

    {
      title: 'Actions',
      render: (text, record) => (

        <Link to="">
          <Button type="primary" size='large' onClick={() => handleClick(record.getwayname, record.Userid)} style={{ width: 65, height: 35 }}>View</Button>
        </Link>

      ),
    },
  ];
  const handleClick = (id, userid) => {
    window.location.href = `/payout-report?getwayid=${id}&userid=${userid}`;
  };

  const fetchData = async (isTableLoading, keyword, dateRange) => {
    setIsTableLoading(true);
    try {


      let start, end;
      // Set the start and end dates based on the selected date range
      //  console.warn(dateRange+"ghghhghgh");
      if (dateRange === 'today') {
        //  alert(dateRange);
        start = new Date().toISOString().slice(0, 10);
        end = start;
      } else if (dateRange === 'yesterday') {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        start = end = yesterday.toISOString().slice(0, 10);
      } else if (dateRange === 'thisWeek') {
        const currentDate = new Date();
        const firstDayOfWeek = new Date(
          currentDate.setDate(currentDate.getDate() - currentDate.getDay())
        );
        start = firstDayOfWeek.toISOString().slice(0, 10);
        end = new Date().toISOString().slice(0, 10);
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
      } else if (Array.isArray(dateRange) && dateRange.length === 2) {
        start = dateRange[0].toISOString().slice(0, 10);
        end = dateRange[1].toISOString().slice(0, 10);
      }

      else {
        // Default to fetching all records
        start = '';
        end = '';
      }
      const queryParameters = new URLSearchParams(window.location.search)
      const type = queryParameters.get("getwayid");
      // alert(type);
      const response = await api.post('admin/summary/payment-payout-getway-list-user-wise', {
        params: {
          page,
          per_page: perPage,
          isTableLoading,
          start: start,
          end: end,       
        },
        getwayname: type,
        
      });
      const data = response.data;
      const merchantData = response.data.records;
      const totalRecords = response.data.total_records;
      setRecords(merchantData);
      setPage(response.data.page);
      setPerPage(response.data.per_page);
      setTotalCount(totalRecords);
      setIsTableLoading(false);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
 
  
    fetchData(getwayId, partnerId, startDate, endDate, status, dateRange);
  }, [getwayId, partnerId, startDate, endDate, status, page, perPage]);

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPerPage(pageSize)
    setIsTableLoading(false);
  };
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    fetchData('', dates);
  };

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

    fetchData(keyword);
  };
  const availableModes = [
    { key: 'today', label: 'Today' },
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'this_week', label: 'This week' },
    { key: 'last7days', label: 'Last 7 days' },
    { key: 'last30days', label: 'Last 30 days' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: "space-between" }}>
        <PageTitle titles={titles} />

        {/* Select components */}
        <Link to="/payment-payout-report">
          <Button type="primary" size='large' style={{ width: 115, height: 48 }}><span style={{ marginRight: '7px', fontSize: '20px' }}>&larr;</span> Back</Button>
        </Link>

      </div>
      <Card className='mb-16 mt-16'>

        {/* <Row gutter={[8, 8]} align='middle' style={{ justifyContent: 'space-around' }}>
          <button onClick={() => fetchData(" ", " ", 'today')} size="large" className='ant-btn ant-btn-default ant-btn-lg' style={antbtnlg}><span>Today</span></button>
          <button onClick={() => fetchData(" ", " ", 'yesterday')} className='ant-btn ant-btn-default ant-btn-lg' style={antbtnlg}>Yesterday</button>
          <button onClick={() => fetchData(" ", " ", 'thisWeek')} className='ant-btn ant-btn-default ant-btn-lg' style={antbtnlg}>This Week</button>
          <button onClick={() => fetchData(" ", " ", 'last7Days')} className='ant-btn ant-btn-default ant-btn-lg' style={antbtnlg}>Last 7 Days</button>
          <button onClick={() => fetchData(" ", " ", 'last30Days')} className='ant-btn ant-btn-default ant-btn-lg' style={antbtnlg}>Last 30 Days</button>
          <RangePicker onChange={handleDateRangeChange} />
        </Row> */}

      <Row gutter={[8, 8]} justify={'space-between'} align={'middle'}>
        <Space>
            <RangePicker onChange={handleDateRangeChange} />
						<Button type="primary" size='large'>Export</Button>
				</Space>

        <TableBar showFilter={false} placeholderInput="Search..."/>
        </Row>



      </Card>
      <Table
        loading={isTableLoading}
        dataSource={records}
        columns={columns}
        style={{ marginTop: '1rem' }}
        pagination={{
          total: totalCount,
          showTotal: (total) => `Total ${total} items`,
          // pageSize: perPage,
          // current: page,
          onChange: handlePageChange,
          showLoading: isTableLoading,
        }}
        scroll={{
          x: true
        }}
      />
    </div>
  );
};
export default GetwaywishPayoutReport;