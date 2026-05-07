import React, { useState, useEffect } from 'react';
import { Select, Table, Button, Pagination, Spin } from 'antd';
import api from 'utils/api';
import DatePicker from 'components/DatePicker';

import { parseQueryParams, stringifyQueryParams } from 'utils/url';
import { DownloadOutlined } from '@ant-design/icons';
import { toast } from 'react-toast';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import PageTitle from "components/PageTitle";

const { Option } = Select;

const AdminData = () => {
  const [partnerId, setPartnerId] = useState(null);
  const [getwayId, setGetwayId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesOptions, setServicesOptions] = useState([]);
  const [partnerOptions, setPartnerOptions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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
  const titles = [{ path: location.pathname, title: "Admin Data" }];
  const columns = [
    {
      title: 'Transaction Id',
      render: (text, records) => (
        <div>
          <div style={{ color: '#6C5DD3' }}>{records.transaction_data ? records.transaction_data.tx_id : null}</div>
        </div>
      )
    },

    {
      title: 'Order ID',
      render: (text, records) => (
        <div>
          <div style={{ color: '#6C5DD3' }}>{records.transaction_data ? records.transaction_data.order_id : null}</div>
        </div>
      )
    },

    {
      title: 'Email',
      render: (text, records) => (
        <div>
          <div>{records.partner ? records.partner.email : null}</div>
        </div>
      )
    },


    {
      title: 'Amount',
      key: 'total',
      dataIndex: 'total'
    },

    {
      title: 'Payment Status',
      key: 'payment_status',
      dataIndex: 'payment_status',
      render: (text) => {
        const statusMap = {
          1: 'Awaiting',
          2: 'Success',
          3: 'Cancel',
          4: 'Refund',
          7: 'Failed',
        };
        return <div style={{ color: '#6C5DD3' }}>{statusMap[text]}</div>;

      },
    },

    {
      title: 'Created At',
      key: 'created_at',
      dataIndex: 'created_at'
    },

  ];


  const CustomLoader = () => (
    <div style={{ textAlign: 'center', paddingTop: '20px' }}>
      <Spin size="large" />
    </div>
  );



  const fetchData = async (getwayId, partnerId, startDate, endDate, status, isTableLoading) => {

    try {
      const response = await api.get('admin/summary/merchant-list', {
        params: {
          getwayId,
          partnerId,
          status,
          start: startDate ? startDate.format('YYYY-MM-DD') : null,
          end: endDate ? endDate.format('YYYY-MM-DD') : null,
          page,
          per_page: perPage,
          isTableLoading
        },
      });
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
    fetchData(getwayId, partnerId, startDate, endDate, status);
  }, [getwayId, partnerId, startDate, endDate, status, page, perPage]);


  useEffect(() => {
    setIsTableLoading(true);
    api.get('admin/summary/merchant-list')
      .then(response => {
        const data = response.data.partner;
        const services = response.data.service;
        const servicesData = services.map(item => ({ value: item.id, label: item.name }));
        const optionData = data.map(item => ({ value: item.id, label: item.full_name }));
        setServicesOptions(servicesData);
        setPartnerOptions(optionData);
        setIsTableLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setIsTableLoading(false);
      });
  }, []);

  const handleDateChange = (dates) => {
    setStartDate(dates[0]);
    setEndDate(dates[1]);
    fetchData(getwayId, partnerId, dates[0], dates[1]);
    setIsTableLoading(false);

  };

  const handleGatewayChange = (value) => {
    setGetwayId(value);
    fetchData(value, partnerId, startDate, endDate);
    setIsTableLoading(false);
  };

  const handlePartnerChange = (value) => {
    setPartnerId(value);
    fetchData(getwayId, value, startDate, endDate);

  };

  // const onChangeTable = (pagination, filters, sorter, extra) => {
  //   console.log(pagination, filters, sorter, extra);

  //   let query = parseQueryParams(location);
  //   query = {
  //     ...query,
  //     page: pagination.current,
  //     per_page: pagination.pageSize,
  //   };

  //   navigate({
  //     pathname: location.pathname,
  //     search: stringifyQueryParams(query),
  //   });
  // };

  const onExport = async () => {
    try {
      setIsTableLoading(true);
      const response = await api.get('admin/summary/export-tansaction-list', {
        params: {
          getwayId,
          partnerId,
          status,
          start: startDate ? startDate.format('YYYY-MM-DD') : null,
          end: endDate ? endDate.format('YYYY-MM-DD') : null,
        },
      });

      if (response && response.data.filepath) {
        window.open(`https://api.step2pay.online/files/${response.data.filepath}`, '_blank');
      }

    } catch (err) {
      console.error(err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsTableLoading(false);
    }
  };

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPerPage(pageSize)
    setIsTableLoading(false);
  };

  return (
    <div>
      <PageTitle titles={titles} />
      {/* Select components */}
      <Select
        showSearch
        placeholder="Select Payment Gateway"
        optionFilterProp="children"
        loading={isTableLoading}
        style={{ width: 180, marginRight: '1rem' }}
        onChange={handleGatewayChange}
      >
        {servicesOptions.map(option => (
          <Option key={option.value} value={option.value}>{option.label}</Option>
        ))}
      </Select>

      <Select
        showSearch
        placeholder="Select Merchant Name"
        optionFilterProp="children"
        loading={isTableLoading}
        style={{ width: 180, marginRight: '1rem' }}
        onChange={handlePartnerChange}
      >
        {partnerOptions.map(option => (
          <Option key={option.value} value={option.value}>{option.label}</Option>
        ))}
      </Select>

      <Select placeholder="Report Status"
        style={{ width: 180, marginRight: '1rem' }}
        value={status}
        onChange={(value) => setStatus(value)}
      >

        <Option value="1">Awaiting</Option>
        <Option value="2">Success</Option>
        <Option value="3">Cancel</Option>
        <Option value="4">Refund</Option>
        <Option value="7">Failed</Option>
      </Select>

      {/* Date Range Picker */}
      <DatePicker.RangePicker
        style={{ marginRight: '1rem' }}
        onChange={handleDateChange}
      />
      {/* Table */}

      <Button type="primary" size='large' onClick={onExport} style={{ width: 115, height: 48 }}>Export</Button>
      <Table
        loading={isTableLoading}
        dataSource={records}
        columns={columns}
        style={{ marginTop: '1rem' }}
        pagination={{
          total: totalCount,
          showTotal: (total) => `Total ${total} items`,
          pageSize: perPage,
          current: page,
          onChange: handlePageChange,
          showLoading: isTableLoading,
        }}
        scroll={{
          x: true
        }}
      />

      {/* <Pagination
      total={totalCount}
      showTotal={(total) => `Total ${total} items`}
      defaultPageSize={perPage}
      defaultCurrent={1}
      onChange={(page, pageSize) => {
        setPage(page);
      }}
  /> */}




    </div>
  );
};
export default AdminData;


