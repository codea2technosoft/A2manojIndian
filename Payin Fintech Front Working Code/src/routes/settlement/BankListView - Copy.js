import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Modal, Switch, Form, Input, Row, Col, Select, InputNumber, message } from 'antd';
import TableBar from "components/TableBar";
import { useLocation, useNavigate } from 'react-router-dom';
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import api from 'utils/api';
const { Option } = Select;

const BankListView = () => {
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
  const [totalCount, setTotalCount] = useState(0);
  const [records, setRecords] = useState([]);
  const [records1, setRecords1] = useState([]);
  const location = useLocation();
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();
  const [bankList, setBankList] = useState([]);
  const columns1 = [
    {
      title: 'Order ID',
      key: 'created_at',
      dataIndex: 'created_at',
      render: (text, record) => {
        const date = new Date(text);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();

        return (
          <div>
            <div>Payout</div>
            {record.id ? <div>SN: {record.id}</div> : null}
            <div>
              <div>{formattedDate}</div>
              <div>{formattedTime}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Transaction Details',
      key: 'bank_name',
      dataIndex: 'bank_name',
      render: (text, record) => {
        return (
          <div>
            {
              record.bankname ? <div>Bank: {record.bankname}</div> : null
            }
            {
              record.accountnumber ? <div>Account: {record.accountnumber}</div> : null
            }
            {
              record.Ifsc ? <div>IFSC: {record.Ifsc}</div> : null
            }
            {
              record.mode ? <div>Mode: {record.mode}</div> : null
            }

          </div>
        )
      }
    },
    {
      title: 'Refrence Details',
      key: 'accountnumber',
      dataIndex: 'accountnumber',
      render: (text, record) => {
        return (
          <div>
            <div>Order ID : {record.orderid}</div>
           
              {
              record.rrn_trx_id ? <div>Refrence: {record.rrn_trx_id}</div> : null
            }
            {
              record.tid ? <div>Txn Id: {record.tid}</div> : null
            }
          
           
          </div>
        )
      }
    },


    {
      title: 'Amount',
      key: 'Amount',
      dataIndex: 'Amount',
      render: (text, record) => {
        return (
          <div>

            {
              record.amount ? <div>Totel: {record.amount}</div> : null
            }
            {
              record.subtotal ? <div>Settled Amt: {record.subtotal}</div> : null
            }
            {
              record.fees ? <div>Fees Amt: {record.fees}</div> : null
            }
            {
              record.gst ? <div>GST Amt: {record.gst}</div> : null
            }


          </div>
        )
      }
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

  const fetchBankList = async (keyword, page, per_page) => {
    console.warn('anil' + page + 'dfdf' + per_page);
    if (page == undefined) {
      var page = 1;
      var per_page = 10;
    }
    setIsTableLoading(true);
    try {
      // const response = await api.get(`/Payout-settlement-transaction-list?page=${page}&perPage=${per_page}`);
      const response = await api.get('/Payout-settlement-transaction-list', {
        params: {
          page,
          per_page: perPage,
          keyword,
        },
      });

      console.warn(response);
      const data = response.data;
      const filteredRecords = keyword
        ? data.data.filter((record) =>
          record.tid.toLowerCase().includes(keyword.toLowerCase())
        )
        : data.data;
      setRecords1(filteredRecords);
      setTotalCount(response.data.total_records);
      if (Array.isArray(filteredRecords)) {
        setBankList(filteredRecords);
      } else {
        console.error("Invalid bank list format:", data.bankList);
      }
    } catch (error) {
      console.error("Error fetching bank list:", error);
    }
    setIsTableLoading(false);
  };

  useEffect(() => {
    var page = 1;
    var per_page = 10;
    fetchBankList();
  }, []);

  const onSearch = (keyword) => {
    let query = parseQueryParams(location);
    query = {
      ...query,
      page: 1,
      keyword: keyword,
    };

    fetchBankList(keyword, page, perPage)

  };
  
  const onChangeTable = (pagination, filters, sorter, extra) => {
    
    let query = parseQueryParams(location);
    query.page = pagination.current;
    query.per_page = pagination.pageSize;

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
    
    fetchBankList('keyword', query.page, query.per_page);
    
  };



  const onToggleFilter = () => {
    setIsShowFilter(!isShowFilter);
  };
  const [isShowFilter, setIsShowFilter] = useState(false);
  const searchRef = useRef(null);

  return (
    <div className='settlement'>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems:'baseline' }}>
        <h2 className='mt-16' style={{ fontWeight: 700 }}>Transfer to Bank Transaction History</h2>
        <TableBar
          placeholderInput="Transaction ID"
          onSearch={onSearch}
          onFilter={onToggleFilter}
          isActiveFilter={isShowFilter}
          inputRef={searchRef}
          showFilter={false}
        />
      </div>
      <Table
      className='mt-8'
        loading={isTableLoading}
        dataSource={records1}
        columns={columns1}
        onChange={onChangeTable}
        rowKey="id"
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
export default BankListView;
