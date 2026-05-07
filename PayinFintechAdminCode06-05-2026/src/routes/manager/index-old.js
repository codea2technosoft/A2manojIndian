import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Switch } from 'antd';
import TableBar from "components/TableBar";
import { useLocation, useNavigate } from 'react-router-dom';
import { parseQueryParams, stringifyQueryParams } from "utils/url";
import api from 'utils/api';

const Manager = () => {
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(process.env.REACT_APP_RECORDS_PER_PAGE);
  const [totalCount, setTotalCount] = useState(0);
  const [records, setRecords] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isPopupVisibleCommission, setIsPopupVisibleCommission] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedRecordCommission, setSelectedRecordCommission] = useState(null);
  const [isMerchantEnabled, setIsMerchantEnabled] = useState(false);
  const [isSettlementEnabled, setIsSettlementEnabled] = useState(false);
  const [isServicesEnabled, setIsServicesEnabled] = useState(false);
  const [isPayoutEnabled, setIsPayoutEnabled] = useState(false);
  const [minpayouts, minpayout] = useState();
  const [maxpayouts, maxpayout] = useState();
  const [transactionpayouts, transactionpayout] = useState();
  const [reservedpayouts, reservedpayout] = useState();
  const [minpayoutvalueshows, minpayoutvalueshow] = useState([]);
  const [maxpayoutvalueshows, maxpayoutvalueshow] = useState();
  const [transaction_fee_rate_payoutshows, transaction_fee_rate_payoutshow] = useState();
  const [revered_fee_rate_payoutshows, revered_fee_rate_payoutshow] = useState();
  const location = useLocation();
  const navigate = useNavigate();

  const columns = [
    {
      title: 'Id',
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
      title: 'Payment Commission',
      render: (record) => (
        <Button onClick={() => handleManageClickCommission(record.id)}>Payment Commission</Button>
      )
    },
    {
      title: 'Payout Permission',
      render: (record) => (
        <Button onClick={() => handleManageClick(record.id)}>Payout Permission</Button>
      )
    },
  ];

  const handleManageClickCommission = (record) => {
    setSelectedRecordCommission(record);
    setIsPopupVisibleCommission(true);
  };
  const handleManageClick = (record) => {
    setSelectedRecord(record);
    setIsPopupVisible(true);
  };

  const handlePopupCancel = () => {
    setIsPopupVisible(false);
  };
  const handlePopupCancel1 = () => {
    setIsPopupVisibleCommission(false);
  };


  const handleMerchantToggle = async (checked) => {
   
      try {
        const response = await api.post('/dashbaord-payout-permission-set', {

          type:"1",
          status:checked
        });
  
        console.warn("Add Bank API Response:", response.data.records.payout_permission);
        // minpayout(response.data.records.min_payout);
        if(response.data.records.payout_permission == 'yes'){
          setIsMerchantEnabled(true);
        }else{
          setIsMerchantEnabled(false);
        }
       
      } 
      catch (error) {
        console.error("Error adding bank:", error);
       
      }
    // };
  };

  const handleSettlementToggle = async (checked) => {
     // const handleTransferAmountSubmit = async () => {
      try {
        // Reset validation errors
        const response = await api.post('/dashbaord-payout-permission-set', {
          
          type:"2",
          status:checked
        });
  
        console.warn("Add Bank API Response:", response.data.records.payout_permission);
        if(response.data.records.payout_permission == 'yes'){
          setIsSettlementEnabled(true);
        }else{
          setIsSettlementEnabled(false);
        }
       
      } 
      catch (error) {
        console.error("Error adding bank:", error);
        // Handle error (e.g., display error message)
      }
    // };
    setIsSettlementEnabled(checked);
  };

  const handleServicesToggle = async (checked) => {
    try {
     
      const response = await api.post('/dashbaord-payout-permission-set', {
        
        type:"3",
        status:checked
      });

      console.warn("Add Bank API Response:", response.data.records.payout_permission);
      if(response.data.records.payout_permission == 'yes'){
        setIsServicesEnabled(true);
      }else{
        setIsServicesEnabled(false);
      }
     
    } 
    catch (error) {
      console.error("Error payout:", error);
    }
    setIsServicesEnabled(checked);
  };

  const handlePayoutToggle = (checked) => {
    setIsPayoutEnabled(checked);
  };

  const fetchManagerList = async (keyword) => {
    setIsTableLoading(true);
    try {
      const response = await api.get('/dashbaord-get-partner-list');
      console.warn(response.data.records);
      // const data = await response.data.records.json();
      // console.warn(data);
      // const data =  response;

      const filteredRecords = keyword
        ? response.data.records.filter((record) =>
          record.email.toLowerCase().includes(keyword.toLowerCase())
        )
        : response.data.records;

      setRecords(filteredRecords);
      setTotalCount(filteredRecords.length);
    } catch (error) {
      console.error('Error fetching manager list:', error);
    }
    setIsTableLoading(false);
  };
  const fetchManagerList1 = async (keyword) => {
    setIsTableLoading(true);
    try {
      const response = await api.get('/dashbaord-first-partner-list');
      console.warn(response.data.records);
      // const data = await response.data.records.json();
      // console.warn(data);
      // const data =  response;
      minpayoutvalueshow(response.data.records.min_payout)
      maxpayoutvalueshow(response.data.records.max_payout)
      transaction_fee_rate_payoutshow(response.data.records.transaction_fee_rate_payout);
      revered_fee_rate_payoutshow(response.data.records.revered_fee_rate_payout);

      if(response.data.records.payout_permission == 'yes'){
        setIsMerchantEnabled(true);
      }
      if(response.data.records.payout_transfer_payout == 'yes'){
        setIsSettlementEnabled(true);
      }
      if(response.data.records.payout_transfer_bank == 'yes'){
        setIsServicesEnabled(true);
      }
    //  console.warn(response.data.records);
    } catch (error) {
      console.error('Error fetching manager list:', error);
    }
    setIsTableLoading(false);
  };

  useEffect(() => {
    fetchManagerList();
    fetchManagerList1();
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
  const minpayoutvalue = (e) => {
    minpayout(e.target.value);
  }
  const maxpayoutvalue = (e) => {
    maxpayout(e.target.value);
  }
  const transactionpayoutvalue = (e) => {
    transactionpayout(e.target.value);
  }
  const reservedpayoutvalue = (e) => {
    reservedpayout(e.target.value);
  }
    const handleTransferAmountSubmit = async () => {
      // alert(minpayouts);
      try {
        // Reset validation errors
        const response = await api.post('/dashbaord-payout-commission-set', {
          maxpayout:maxpayouts,
          minpayout:minpayouts,
          reservedpayout:reservedpayouts,
          transactionpayout:transactionpayouts
        });
  
        console.warn("Add Bank API Response:", response.data.records.payout_permission);
        // const handlePopupCancel1 = () => {
          setIsPopupVisibleCommission(false);
        // };
       
      } 
      catch (error) {
        console.error("Error adding bank:", error);
        // Handle error (e.g., display error message)
      }
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
        title="Payout Permission"
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
              <div className='border_second'>Allow Payout:</div>
              <div className='toggle_class'>
                <Switch checked={isMerchantEnabled} onChange={handleMerchantToggle} />
              </div>
            </div>
            <div className='d-flex justify-content-between'>
              <div className='border_second'>Transfer Payin to Payout:</div>
              <div className='toggle_class'>
                <Switch checked={isSettlementEnabled} onChange={handleSettlementToggle} />
              </div>

            </div>

            <div className='d-flex justify-content-between'>
              <div className='border_second'> Transfer Bank:</div>
              <div className='toggle_class'>
                <Switch checked={isServicesEnabled} onChange={handleServicesToggle} />
              </div>
            </div>

            {/* <div className='d-flex justify-content-between'>
              <div className='border_second'>   Payout:</div>
              <div className='toggle_class'>
                <Switch checked={isPayoutEnabled} onChange={handlePayoutToggle} />
              </div>
            </div> */}

          </div>
        )}
      </Modal>
      <Modal
        title="Payout Commission"
        visible={isPopupVisibleCommission}
        onCancel={handlePopupCancel1}
        footer={null}
      >
        {selectedRecordCommission && (
          <div>
            {/* <div className='d-flex justify-content-center'>
              <div className='border_second heading'>Permission</div>
              <div className='border_second heading'>Action</div>
            </div>
            <div className='d-flex border-new justify-content-between'>
              <div className='border_second'>Allaw Payout:</div>
              <div className='toggle_class'>
                <Switch checked={isMerchantEnabled} onChange={handleMerchantToggle} />
              </div>
            </div>
            <div className='d-flex justify-content-between'>
              <div className='border_second'>Transfer Payin to Payout:</div>
              <div className='toggle_class'>
                <Switch checked={isSettlementEnabled} onChange={handleSettlementToggle} />
              </div>

            </div>

            <div className='d-flex justify-content-between'>
              <div className='border_second'> Transfer Bank:</div>
              <div className='toggle_class'>
                <Switch checked={isServicesEnabled} onChange={handleServicesToggle} />
              </div>
            </div> */}



      
            <div className='d-flex border-new justify-content-between'>
              <div className='border_second'>Minimum Payout Set</div>
              <div className='toggle_class'>
             {minpayoutvalueshows}
              </div>
            </div>
            <div className='d-flex justify-content-between'>
              <div className='border_second'><label>Maximun Payout Set</label></div>
              <div className='toggle_class'>
             {maxpayoutvalueshows}
              </div>

            </div>
            <div className='d-flex justify-content-between'>
              <div className='border_second'>Transaction Fees Payout Set</div>
              <div className='toggle_class'>
              {transaction_fee_rate_payoutshows}
              </div>
            </div>

            <div className='d-flex justify-content-between'>
              <div className='border_second'>Reserved Fees Payout Set</div>
              <div className='toggle_class'>
              {revered_fee_rate_payoutshows}
              </div>
            </div>

            <div className='d-flex border-new justify-content-between'>
              <div className='border_second'>Minimum Payout</div>
              <div className='toggle_class'>
              <input type="number" name="minpayout" onChange={minpayoutvalue} ></input>
              </div>
            </div>
            <div className='d-flex justify-content-between'>
              <div className='border_second'><label>Maximun Payout</label></div>
              <div className='toggle_class'>
              <input type="number"  onChange={maxpayoutvalue} ></input>
              </div>

            </div>
            <div className='d-flex justify-content-between'>
              <div className='border_second'>Transaction Fees Payout</div>
              <div className='toggle_class'>
              <input type="number" onChange={transactionpayoutvalue} ></input>
              </div>
            </div>

            <div className='d-flex justify-content-between'>
              <div className='border_second'>Reserved Fees Payout</div>
              <div className='toggle_class'>
              <input type="number" onChange={reservedpayoutvalue} ></input>
              </div>
            </div>

            <div className='mt-16' style={{display:'flex', justifyContent:'center'}}>
              <Button type='button' onClick={handleTransferAmountSubmit} className='btn ant-btn-primary'>Submit</Button>
            </div>



            
{/*             
            <label>Minimum Payout</label>
            <input type="number"></input>
            <label>Maximun Payout</label>
            <input type="number"></input>
            <label>Transaction Fees Payout</label>
            <input type="number"></input>
            <label>Reserved Fees Payout</label>
            <input type="number"></input> */}
            </div>

          
        )}
      </Modal>
      
    </div>
    
  );
};

export default Manager;
