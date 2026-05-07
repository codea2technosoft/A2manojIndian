import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Switch } from 'antd';
import TableBar from "components/TableBar";
import { useLocation, useNavigate } from 'react-router-dom';
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import api from 'utils/api';
import {deletePayoutsBeneficiaryAccounts } from 'requests/list';
import {Delete } from "react-iconly";

const BeneficiallyList = () => {
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
  const [totalCount, setTotalCount] = useState(0);
  const [records, setRecords] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isMerchantEnabled, setIsMerchantEnabled] = useState(false);
  const [isSettlementEnabled, setIsSettlementEnabled] = useState(false);
  const [isServicesEnabled, setIsServicesEnabled] = useState(false);
  const [isPayoutEnabled, setIsPayoutEnabled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const columns = [
    // {
    //   title: 'ID',
    //   key: 'id',
    //   dataIndex: 'id'
    // },
    {
      title: 'Beneficiary Name',
      key: 'name',
      dataIndex: 'name'
    },

    {
      title: 'Account Number',
      key: 'account_number',
      dataIndex: 'account_number',
  },

    


    {
      title: 'IFSC Code',
      key: 'ifsc_code',
      dataIndex: 'ifsc_code',
    },

    {
      title: 'Bank Name',
      key: 'bank_name',
      dataIndex: 'bank_name'
    },

    {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
      },

      {
        title: 'Verify',
        render: (record) => {
          if (record.status === 'pending') {
            return (
              <div>
                <Button onClick={() => handleVerify(record.id)}>Verify</Button>
                <Button type="link" size="small" onClick={() => onDelete(record.id)}>
                        <Delete set="light" primaryColor="red" />
                </Button>
              </div>
            );
          } else {
            return <div style={{ color: 'green' }}>Verified</div>;
          }
        },
      },
  ];

  const fetchManagerList = async (keyword) => {
    setIsTableLoading(true);
    try {
      const response = await api.get('/beneficiary-data');
      console.warn(response);
      const data = response.data;
      const filteredRecords = keyword
        ? data.records.filter((record) =>
            record.email.toLowerCase().includes(keyword.toLowerCase())
          )
        : data.records;
      setRecords(filteredRecords);
      setTotalCount(filteredRecords.length);
    } catch (error) {
      console.error('Error fetching BeneficiaryList:', error);
    }
    setIsTableLoading(false);
  };
  
  useEffect(() => {
    fetchManagerList();
  }, []);

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


  const handleVerify = async (id) => {
    try {
      const response = await api.get('beneficiary-data-success', { params: { id } });
      if (response.data.message === "success" && response.data.records) {
        const updatedData = data.map((item) => {
          if (item.id === id) {
            return { ...item, status: 'success', ...response.data.records };
          }
          return item;
        });
        setData(updatedData);
        console.log('Verification successful');
        fetchManagerList();
      } else {
        console.error('Verification failed');
      }
    } catch (error) {
      console.error('Error during verification:', error);
    }
  };
  

  const onDelete = async (id) => {
    try {
      const confirmed = await Modal.confirm({
        title: 'Warning',
        content: 'Do you want to delete this transaction?',
      });
      
      if (confirmed) {
        await deletePayoutsBeneficiaryAccounts(id);
        // Refresh list
        navigate({
          pathname: location.pathname,
          search: stringifyQueryParams({}),
        });
      }
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div>
      <TableBar showFilter={false} onSearch={onSearch} />
      <Table
        loading={isTableLoading}
        dataSource={records}
        columns={columns}
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
export default BeneficiallyList;
