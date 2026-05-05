import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Switch, Input, message, DatePicker } from 'antd';
import dayjs from 'dayjs';
import TableBar from "components/TableBar";
import { useLocation, useNavigate } from 'react-router-dom';
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import api from 'utils/api';
import PageTitle from 'components/PageTitle';
import {WalletOutlined} from '@ant-design/icons';
const { RangePicker } = DatePicker;

const titles = [{ path: '/transfarpayout', title: 'Transfer to Payout' }];
const TransfarList = () => {
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [transaction_to_payout, settransaction_to_payout] = useState();
  const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
  const [totalCount, setTotalCount] = useState(0);
  const [totalAmount, setTotelAmt] = useState(0);
  const [records, setRecords] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [transferAmount, setTransferAmount] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const columns = [
    {
      title: 'Created at',
      key: 'created_at',
      dataIndex: 'created_at',
      render: (text, record) => {
        const date = new Date(text);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();

        return (
          <div>
            <div>{formattedDate}</div>
            <div>{formattedTime}</div>
          </div>
        );
      },
    },
    {
      title: 'Order ID',
      key: 'orderid',
      dataIndex: 'orderid',
    },
    {
      title: 'Refrence Details',
      key: 'type',
      dataIndex: 'type',
    },
    {
      title: 'Amount',
      key: 'amount',
      dataIndex: 'amount',
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (text) => {
        let color = '';
        if (text === 'success') {
          color = 'green';
        } else if (text === 'faild') {
          color = 'red';
        }
        return <span style={{ color }}>{text}</span>;
      }
    },
  ];

  const handleTransfer = async () => {
    try {
      const response = await api.post('/Amount-settlement-payin-to-payout', {
        amount: transferAmount,
        type: 'account'
      });
      console.log('Transfer successful:', response.data);
      message.success('Transfer successful!');
      setIsTableLoading(true);
      fetchManagerList(searchKeyword);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error('Error transferring:', error);
    }
  };

  const fetchManagerList = async (keyword,created_at_date_min,created_at_date_max,page,per_page) => {

    setIsTableLoading(true);
    try {
      // console.warn(page+'ghghghgh');
      if(page == undefined){
        page = 1;
        per_page = 10;
      }
      const response = await api.get('/Amount-settlement-payin-to-payout-list?created_at_date_min'+created_at_date_min+'&created_at_date_max'+created_at_date_max+'&page='+page+'&perPage='+per_page,);
      
      const data = response.data.data;
      // console.warn(dayjs(record.created_at).format('YYYY-MM-DD'));
      const filteredRecords = keyword
      ? data.filter((record) =>
          record.orderid.toLowerCase().includes(keyword.toLowerCase())
        )
        : data;
      const totalAmount = response.data.transaction_to_payout;
      setTotelAmt(totalAmount)
      setRecords(filteredRecords);
      // alert(filteredRecords.length);
      console.warn(response.data.total_records);
      // setTotalCount(filteredRecords.length);
      setTotalCount(response.data.total_records);
    } catch (error) {
      console.error('Error fetching TransfarList:', error);
    }
    setIsTableLoading(false);
  };

  useEffect(() => {
    fetchManagerList(searchKeyword);
    onSearch();
    onChangeDates();
  }, []);

  
  const onSearch = (keyword) => {
    // console.warn('PP');
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
    const urlParams = new URLSearchParams(window.location.search);
    let created_at_date_min = urlParams.get('created_at_date_min');
    let created_at_date_max = urlParams.get('created_at_date_max');
    fetchManagerList(keyword,created_at_date_min,created_at_date_max);
  };

  const onChangeTable = (pagination, filters, sorter, extra) => {
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
    fetchManagerList(null,null,null,pagination.current,pagination.pageSize);
  };
  const onChangeDates = (dates) => {
    const urlParams = new URLSearchParams(window.location.search);
    let keyword = urlParams.get('keyword');
    // console.warn(keyword+'juikjkj');
    let query = parseQueryParams(location);
    if(dates != undefined){

      if (dates[0] && dates[1]) {
        query = {
          ...query,
          created_at_date_min: dayjs(dates[0]).format('YYYY-MM-DD'),
          created_at_date_max: dayjs(dates[1]).format('YYYY-MM-DD'),
        };
        // console.warn(query);
        fetchManagerList(keyword,dayjs(dates[0]).format('YYYY-MM-DD'),dayjs(dates[1]).format('YYYY-MM-DD'));
      } else {
        delete query.created_at_date_min;
        delete query.created_at_date_max;
      }
    }else{
      delete query.created_at_date_min;
        delete query.created_at_date_max;
        delete query.page;
        delete query.per_page;
    }

    navigate({
      pathname: location.pathname,
      search: stringifyQueryParams(query),
    });
  }


  return (
    <div className='transfer'>
      <div style={{ marginBottom: '16px', display: 'flex',flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <PageTitle titles={titles} />
      <div className='ml-8 statistic-card--purple red-border totaltransfer' >
          <h4>Total Transfer Payout</h4>
          <WalletOutlined />
          <span className='ml-8'>{totalAmount}</span>
        </div>
        </div>

      <div style={{ marginBottom: '16px', display: 'flex',flexWrap: 'wrap', justifyContent: 'start', alignItems: 'flex-start' }}>
        <Input
         className='mb-8'
          placeholder="Amount"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          style={{ marginRight: '8px', width: '200px' }}
        />
        <Button type="primary" className='mb-8' onClick={handleTransfer} style={{ marginRight: '8px', width: '100px', height: '48px' }}>
          Transfer
        </Button>

        <TableBar showFilter={false} onSearch={onSearch} className="mb-8" />
        <RangePicker className='mb-8 ml-16'
          onCalendarChange={(newDates) => onChangeDates(newDates)}
          style={{ height: '50px' }}
        />

        

        {/* <Button type="primary" size='large' onClick={onExport}>Export</Button> */}
      </div>

      <Table
        loading={isTableLoading}
        dataSource={records}
        columns={columns}
        rowKey="id"
        pagination={{
          pageSize: perPage,
          total: totalCount,
          current: page,
          onChange: (page, pageSize) => onChangeTable({ current: page, pageSize: pageSize }, {}, {}, {})
        }}
        scroll={{
          x: true
        }}
      />
    </div>
  );
};
export default TransfarList;
