import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Switch } from 'antd';
import TableBar from "components/TableBar";
import { useLocation, useNavigate } from 'react-router-dom';
import { parseQueryParams, stringifyQueryParams } from "utils/url";

const Manager = () => {
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
    {
      title: 'Actions',
      render: (record) => (
        <Button onClick={() => handleManageClick(record)}>Manage</Button>
      )
    },
  ];


  const handleManageClick = (record) => {
    setSelectedRecord(record);
    setIsPopupVisible(true);
  };

  const handlePopupCancel = () => {
    setIsPopupVisible(false);
  };


  const handleMerchantToggle = (checked) => {
    setIsMerchantEnabled(checked);
   
  };

  const handleSettlementToggle = (checked) => {
    setIsSettlementEnabled(checked);
  };

  const handleServicesToggle = (checked) => {
    setIsServicesEnabled(checked);
  };

  const handlePayoutToggle = (checked) => {
    setIsPayoutEnabled(checked);
  };

  const fetchManagerList = async (keyword) => {
    setIsTableLoading(true);
    try {
      const response = await fetch('https://api.fintechdaddy.in/managerList');
      const data = await response.json();

      const filteredRecords = keyword
        ? data.records.filter((record) =>
            record.email.toLowerCase().includes(keyword.toLowerCase())
          )
        : data.records;

      setRecords(filteredRecords);
      setTotalCount(filteredRecords.length);
    } catch (error) {
      console.error('Error fetching manager list:', error);
    }
    setIsTableLoading(false);
  };

  useEffect(() => {
    fetchManagerList();
  }, []);

  const onSearch = (keyword) => {
    let query = parseQueryParams(location.search);
    alert(query);
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
      <Modal
        title="Manage Manager Roles"
        visible={isPopupVisible}
        onCancel={handlePopupCancel}
        footer={null}
      >
        {selectedRecord && (
          <div>
            {/* <p>ID: {selectedRecord.id}</p>
            <p>Name: {selectedRecord.full_name}</p>
            <p>Email: {selectedRecord.email}</p>
            <p>Phone: {selectedRecord.mobile}</p> */}
            <div className='d-flex justify-content-center'>
            <div className='border_second heading'>Permission</div>
            <div className='border_second heading'>Action</div>
            </div>
            <div className='d-flex border-new justify-content-between'>
             <div className='border_second'>Merchant:</div>
             <div className='toggle_class'>
              <Switch checked={isMerchantEnabled}  onChange={handleMerchantToggle} />
              </div>
            </div>
            <div className='d-flex justify-content-between'>
            <div className='border_second'>Settlement:</div>
            <div className='toggle_class'>
            <Switch checked={isSettlementEnabled} onChange={handleSettlementToggle} />
            </div>
             
            </div>

            <div className='d-flex justify-content-between'>
            <div className='border_second'> Services:</div>
            <div className='toggle_class'>
              <Switch checked={isServicesEnabled}  onChange={handleServicesToggle} />
              </div>
            </div>

            <div className='d-flex justify-content-between'>
            <div className='border_second'>   Payout:</div>
            <div className='toggle_class'>
              <Switch checked={isPayoutEnabled} onChange={handlePayoutToggle} />
            </div>
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
};

export default Manager;
