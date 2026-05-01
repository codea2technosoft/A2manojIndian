import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Switch, Input, message, DatePicker, Modal } from 'antd';
import dayjs from 'dayjs';
import TableBar from "components/TableBar";
import { useLocation, useNavigate } from 'react-router-dom';
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import api from 'utils/api';
import PageTitle from 'components/PageTitle';
import { WalletOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const titles = [{ path: '/transfarpayout', title: 'Transfer to Payout' }];

const TransfarList = () => {
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [transaction_to_payout, settransaction_to_payout] = useState();
  const [per_page, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
  const [totalCount, setTotalCount] = useState(0);
  const [totalAmount, setTotelAmt] = useState(0);
  const [records, setRecords] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [transferAmount, setTransferAmount] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [created_at_date_min, setcreated_at_date_min] = useState('');
  const [created_at_date_max, setcreated_at_date_max] = useState('');
  const [keyword, setkeyword] = useState('');
  const [isButtonVisible, setIsButtonVisible] = useState(true);
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
      message.success({
        content: 'Transfer successful!',
        duration: 2, 
        className: 'custom-success-message succesful', 
      });
      setIsTableLoading(true);
      setIsButtonVisible(false);
      fetchManagerList(searchKeyword);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error transferring:', error);
    }
  };

  const fetchManagerList = async (keyword, created_at_date_min, created_at_date_max, page, per_page) => {

    setIsTableLoading(true);
    try {

      if (!created_at_date_min) {
        const today = new Date().toISOString().split('T')[0];
      }

      if (!created_at_date_max) {
        const today = new Date().toISOString().split('T')[0];
        created_at_date_max = today;
      }

      // if (page == undefined) {
      //   page = 1;
      //   per_page = 10;
      // }

      const response = await api.get(`/Amount-settlement-payin-to-payout-list?created_at_date_min=${created_at_date_min}&created_at_date_max=${created_at_date_max}&page=${page}&perPage=${per_page}`);
      const data = response.data.data;

      const filteredRecords = keyword
        ? data.filter((record) =>
          record.orderid.toLowerCase().includes(keyword.toLowerCase())
        )
        : data;
      const totalAmount = response.data.transaction_to_payout;
      setTotelAmt(totalAmount)
      setRecords(filteredRecords);
      console.warn(response.data.total_records);
      setTotalCount(response.data.total_records);
    } catch (error) {
      console.error('Error fetching TransfarList:', error);
    }
     setIsTableLoading(false);
  };


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
    fetchManagerList(keyword, created_at_date_min, created_at_date_max);
  };

  // const onChangeTable = (pagination, filters, sorter, extra) => {
  //   console.log('onChangeTable called with page:', pagination.current, 'per_page:', pagination.pageSize);
  //   let query = parseQueryParams(location);
  //   query = {
  //     ...query,
  //     page: pagination.current,
  //     per_page: pagination.pageSize,
  //   };

  //   if (sorter.order) {
  //     query = {
  //       ...query,
  //       order_by: sorter.field,
  //       order_type: sorter.order === 'ascend' ? 'asc' : 'desc',
  //     };
  //   } else {
  //     delete query.order_by;
  //     delete query.order_type;
  //   }

  //   navigate({
  //     pathname: location.pathname,
  //     search: stringifyQueryParams(query),
  //   });
  //   fetchManagerList(null,null,null,pagination.current,pagination.pageSize);
  // };



  const onChangeTable = (pagination, sorter) => {
    const { current, pageSize } = pagination;

    const newPage = pagination;
    const newPerPage = per_page;

    const query = {
      page: newPage,
      per_page: newPerPage,
    };

    if (sorter.order) {
      query.order_by = sorter.field;
      query.order_type = sorter.order === 'ascend' ? 'asc' : 'desc';
    } else {
      delete query.order_by;
      delete query.order_type;
    }

    setPage(newPage);
    setPerPage(newPerPage);
    navigate({
      pathname: location.pathname,
      search: stringifyQueryParams(query),
    });

  fetchManagerList(keyword, created_at_date_min, created_at_date_max, newPage, newPerPage);
  };




  useEffect(() => {
    fetchManagerList(searchKeyword, created_at_date_min, created_at_date_max, page, per_page);
    onSearch();
    onChangeDates();
  }, []);

  

  const onChangeDates = (dates) => {
    const urlParams = new URLSearchParams(window.location.search);
    let keyword = urlParams.get('keyword');
    // console.warn(keyword+'juikjkj');
    let query = parseQueryParams(location);
    if (dates != undefined) {

      if (dates[0] && dates[1]) {
        query = {
          ...query,
          created_at_date_min: dayjs(dates[0]).format('YYYY-MM-DD'),
          created_at_date_max: dayjs(dates[1]).format('YYYY-MM-DD'),
        };
        // console.warn(query);
        fetchManagerList(keyword, dayjs(dates[0]).format('YYYY-MM-DD'), dayjs(dates[1]).format('YYYY-MM-DD'));
      } else {
        delete query.created_at_date_min;
        delete query.created_at_date_max;
      }
    } else {
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
      <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <PageTitle titles={titles} />
        <TableBar showFilter={false} onSearch={onSearch} className="mb-0" />
      </div>

      <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', justifyContent: 'start', alignItems: 'flex-start' }}>
        
        
      <div className="d-flex">
      <Input
          className='mb-8'
          placeholder="Amount"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          style={{ marginRight: '8px', width: '200px' }}
        />
        <Button type="primary" className='mb-8' onClick={handleTransfer}
          style={{
            marginRight: '8px',
            width: '100px',
            height: '48px',
            display: isButtonVisible ? 'block' : 'none',
          }}
        >
          Transfer
        </Button>
      </div>
      <div className='ml-8 statistic-card--purple d-flex red-border totaltransfer' >
          <h4>Total Transfer Payout</h4>
         <div className="walletdesign" style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
         <WalletOutlined className="titlewallet" />
          <span className='ml-8'>{totalAmount}</span>
         </div>
        </div>

        <RangePicker className='mb-16 ml-16'
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
          current: page,
          pageSize: per_page,
          total: totalCount,
          onChange: onChangeTable,
        }}
        scroll={{
          x: true
        }}
      />

    </div>
  );
};
export default TransfarList;
